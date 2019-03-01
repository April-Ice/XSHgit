import { Component,ViewChild } from '@angular/core';
import {
	NavController,
	NavParams,
	ToastController,
	ViewController,
	Navbar,
	Platform,
	AlertController
} from 'ionic-angular';
import { Social } from './../../plugin/native';
import { query } from '@angular/core/src/animation/dsl';

// import { FoodPage } from './food';
import { MeetingPage } from './meeting';
import { RoomPage } from './room';
import { WeddingPage } from './wedding';
import { EditFoods } from './editfood';
import {HomePage} from "../home/home";
import {ViewsPage} from "../show/views";

import { ProductService } from '../../providers/product';
import * as $ from 'jquery';

@Component({
	selector: 'page-food',
	templateUrl: 'food.html',
	providers: [ProductService]
})
export class FoodPage {
	@ViewChild(Navbar) navBar: Navbar;
	public isFirst=true;

	public menuList = [];//菜单列表
	public curMenu;//当前菜单
	public productList = [];//菜品列表
	public curDishNum = 0;//当前菜单菜品数量

	public dishTypeList=[];//菜品分类列表
	public curDishType=null;//当前菜品分类

	public addMenuVisible = false;//添加菜单弹窗
	public addMenuName="";
	public addPriceNumber;
	public addAllNumber:1;
	public cut_price;//折扣总价
	public min_discount;
	public pri_number;//原价


	public add2OrderModal = false;//加入订单弹窗
	public orderlist = [];//订单列表

	public isOrderAlert = false;//订单提示红色字体
	public isPriceAlert = false;//订单提示红色字体
	public isNumberAlert = false;//订单提示红色字体

	public showSmallName = false;//菜单全名
	public isPad = false;
	public 	menuIdList = [];

	public canPrice;
	public curMenuId;
	public isManage = window.localStorage.getItem('manage ');
	public order_id = '';
	public order_name = '';
	public op_num;
	public showTopName = false;

	public ifFixId = false;

	// ionViewDidLoad() {
     //    this.navBar.backButtonClick = this.backButtonClick;
	// }
	// backButtonClick = (e: UIEvent) => {
	// 	// do something
	// 	// this.navCtrl.pop();
	// 	this.navCtrl.push(HomePage);
	// }


	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public toastCtrl: ToastController,
		public  viewController: ViewController,
		public service: ProductService,
		public plt: Platform,
		public alertCtrl: AlertController,

	) {
		this.order_id = navParams.get('order_id');
		if(navParams.get('order_id')){
			this.ifFixId = true;
		}
		this.GetMemu();
		if (this.plt.is('ipad')) {
			// This will only print when on iOS
			// console.log('I am an ipad device!');
			this.isPad = true;
			// console.log("1111")
		}
		if(this.order_id){
			// console.log("this.order_id",this.order_id);
			this.getOrderInfo();
			this.showTopName = true;
		}
	}

	goBack(){
		// this.navCtrl.pop();
		this.navCtrl.push(HomePage);
	}
	//获取订单信息
	getOrderInfo(){
		let query = {
			order_id: this.order_id
		}
		this.service.GetMealOrderInfo(query).then(data => {
			this.order_name = data.order_name;
			this.op_num = data.op_num;
		});
	}

	gotoPrice(){
		// console.log("gotoPrice");
		let url=this.service.baseApi+'/portal/index.php?r=background/bill&order_id='+this.order_id+'&token='+this.service.general.token+'&from=ipad';
		this.navCtrl.push(ViewsPage, { title: '订单详情', url:url,order_id: this.order_id});
	}

	//获取菜单列表及菜品分类
	GetMemu() {
		this.service.GetMealMemu().then(data => {
			if (data.status == 1) {
				// console.log(data);
				this.menuList=data.list;
				// this.menuIdList =
				for (let i=0;i<this.menuList.length;i++){
					this.menuIdList.push(this.menuList[i].id);
				}
				this.curMenu=data.list[0];
				this.curMenuId =this.curMenu.id;
				this.GetDishTypesDishNum();
			}
		});

	}
	//获取菜品分类包含菜品数量
	GetDishTypesDishNum(){
		this.service.GetDishTypesDishNum(this.curMenu.id).then(res=>{
			if (res.status==1) {
				this.dishTypeList=res.list;
				this.dishTypeList.splice(0,0,{
					id:0,
					name:"全部",
					count:0
				})
				this.dishTypeList.forEach(element => {
					this.dishTypeList[0].count+=parseInt(element.count) ;
				});
				this.curDishType=this.dishTypeList[0];
				this.GetMenuDetail();
			}
		})
	}
	//获取菜单菜品
	GetMenuDetail() {
		this.productList = [];
		this.curDishNum=0;
		this.service.GetMenuDetail(this.curMenu.id,this.curDishType.id).then(data => {
			if (data.status == 1) {
				console.log(data);
				this.curMenuId = data.menu.id;
				console.log(this.curMenuId);


				this.productList=data.dishes;
				this.curDishNum=data.dishes.length;
				this.pri_number = data.menu.ori_price;
				this.curMenu = data.menu;

			}
		});
	}
	//变更菜单
	ChangeMenu(menu){
		this.showSmallName = false;
		this.curMenu = menu;
		console.log('this.curMenu',this.curMenu);
		console.log('menu',menu)
		this.pri_number = menu.price || '2999';
		this.GetDishTypesDishNum();
	}                                  
	//变更菜品分类
	ChangeDishType(dishType){
		this.curDishType=dishType;
		this.GetMenuDetail();
	}

	/**添加菜单 */
	// 开启添加菜单弹窗
	OpenAddMenuModal() {
		this.addMenuVisible = true;
		this.addMenuName="";
	}
	//关闭添加菜单弹窗
	CloseAddMenuModal() {
		this.addMenuVisible = false;
	}
	//添加菜单确认
	AddMenuSubmit(form) {
		this.service.AddDishesMenu(form.name).then(data => {
			if(data.status == 1){
				this.CloseAddMenuModal();
				this.menuList.push({
					id:data.msg,
					name:form.name,

				})
			}else{
				this.toastCtrl.create({
					message: '添加菜单失败！',
					showCloseButton: true,
					position: 'middle',
				}).present();
			}
		});
	}

	//编辑菜单内容
	EditMenu() {

		this.navCtrl.push(EditFoods, { menuId: this.curMenu.id });
	}


	/**加入订单*/
	//开启加入订单弹窗
	OpenAdd2OrderModal() {
		console.log(this.pri_number);
		this.addPriceNumber = this.pri_number;
		this.add2OrderModal = true;
		this.isPriceAlert = false;
		this.isOrderAlert = false;
		this.isNumberAlert = false;
		this.service.getOrderDoingAndDone().then(data => {
			this.orderlist=data;
		});
	}
	//关闭加入订单弹窗
	CloseAdd2OrderModal() {
		this.add2OrderModal = false;
	}
	//加入订单确认
	Add2OrderSubmit(form) {
		this.min_discount = localStorage.getItem('min_discount')

		// let isCheck = /^[0-9]+$/ ;
		let isCheck="^[0-9]*[1-9][0-9]*$";
		let r = new RegExp(isCheck);
		console.log(this.pri_number,this.min_discount);
		let flag=r.test(form.number);
		console.log(flag);
		//权限内价格
		this.canPrice = (this.pri_number * this.min_discount).toFixed(2);
		console.log(this.canPrice,form.number);
		//折扣总价
		this.cut_price = (this.pri_number - form.price)*form.number;
		
		if(this.ifFixId){
			form.orderId = this.order_id;
		}
		
		if (form.orderId.length == 0){
			this.isOrderAlert = true;
			return
		}else {
			this.isOrderAlert = false;
		}

		if (form.price < this.canPrice){
			this.isPriceAlert = true;
			return
		}else {
			this.isPriceAlert = false;
		}
		if (!flag){
			this.isNumberAlert = true;
			console.log('!!!')
			return
		}else {
			this.isPriceAlert = false;
		}

		this.service.MenuAdd2Order(this.curMenu.id,form.orderId,form.price,this.addAllNumber).then(data => {
			if(data.status==2){
				let toast = this.toastCtrl.create({
					message: '该菜单下没有菜品！',
					showCloseButton: true,
                    position: 'middle',
                    duration: 2000
				});
				toast.present();
			}else if(data.status==1){
				this.add2OrderModal = false;
				this.isNumberAlert = false;
				this.isPriceAlert = false;
				this.isOrderAlert = false;
				let toast = this.toastCtrl.create({
					message: '加入订单成功！',
					showCloseButton: true,
                    position: 'middle',
                    duration: 2000
				});
				this.op_num++;
				toast.present();
			}else{
				let toast = this.toastCtrl.create({
					message: '程序处理出错，请稍后重试！',
					showCloseButton: true,
                    position: 'middle',
                    duration: 2000
				});
				toast.present();
			}
		})
	}
	tapEvent(){
		if (this.isPad){
			if (this.showSmallName){
				this.showSmallName = false;
			}else {
				this.showSmallName = true;
			}
		}

	}

	//删除菜单
	deleteMenu(){

		let index = this.menuIdList.indexOf(this.curMenuId);

		this.alertCtrl.create({
			title: '菜单删除后将无法恢复，您确定要删除吗?',
			// subTitle: 'Your friend, Obi wan Kenobi, just accepted your friend request!',
			buttons: [
				{
					text: '确定',
					handler: data => {
						this.service.DelDishesMenu(this.curMenuId).then(res=>{
							console.log(res);
							if (res.status==1) {
								this.menuList.splice(this.menuList.indexOf(index),1)
							}
							else{
								this.toastCtrl.create({
									message: '删除失败！',
									position: 'middle',
									duration: 1000
								}).present();
							}
						})
					}
				},
				{
					text:"取消"
				}
			]
		}).present();
	}

	//分享
	share() {}

	ionViewWillLeave(){
		this.isFirst=false;
	}
	ionViewWillEnter(){
		if(!this.isFirst){
			this.GetMemu();
		}

		//判断是否为pad 是的话加宽度限制
		if (this.isPad){
			$('.toptitle-menu').css('width','13rem');
		}
	}



	//判断设备信息  改变头部样式

}
