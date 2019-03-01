
import { Social } from './../../plugin/native';
import { query } from '@angular/core/src/animation/dsl';
import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
// import { ModalController } from 'ionic-angular';
import { CalendarComponent, CalendarComponentOptions } from 'ion2-calendar'

//--------------待解决问题  不能直接引用index-----------------------------
// import { LoginPage } from '../index';
//----------------------------------------------------------------------
import { LoginPage } from '../login/login';
import { ChartPage } from '../charts/chart';
import { ordersDataPage } from '../charts/orders';
import { FoodPage } from '../products/food';
import { PicsPage } from '../show/pics';
import { ViewsPage } from '../show/views';
import { AddOrderPage } from './addorder';
import { FloatMenuPage } from './floatMenu';
import { EditFoods } from '../products/editfood';
import {OrderSearchPage} from './ordersearch'

import { HomeService } from '../../providers/home';
import { Sites } from '../../helpers/adpter';

@Component({
	selector: 'page-home',
	templateUrl: 'home.html',
	providers: [HomeService]
})
export class HomePage {

	@ViewChild('calendar', { read: CalendarComponent }) calendarRef: CalendarComponent;

	public token = localStorage.getItem('token');
    public account_id = localStorage.getItem('account_id');
    public ifHotel = false; //是否为酒店版,true为酒店版


	public login: any;
	public hallId = 0;
	public hallname = '全部大厅';
	public orderlists = [];

	public orderlistsOrign = [];
	public imgSrc = 'assets/imgs/index/bg.jpg';
	//www.cike360.com/PHP_BackGround测试  crm.cike360.com 正式 localhost:8101
	public nowUrl = 'http://www.cike360.com/PHP_BackGround';
	// public nowUrl = 'http://localhost:8101';
	public Imgs = [];
	public space = null;
	public hallList = [];
	public preHallList = [];
	public afterHallList = [];
	public panorama_url = '';

	public selectHotel = 0;

	public curYear = new Date().getFullYear();
	public checkmonth = 0;
	public checkpreload = {};

	public ordertypevalue = 0;

	// 总订单日历，单月订单
	public hotelList
	public yearVisible
	public monthVisible
	public yearDeal
	public yearNoDeal

	public monthData = [];
	public monthdataTop = [];
	public monthdataBottom = [];

	// search查询
	public searchQuery: string = '';
	public titleItems: string[] = [];

	public ifFloat = false;
	public floatList = [];
	public subList = [];
	public department_list = localStorage.getItem('department_list ');
	public isSuper = false;
	public hotelLogo;

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public service: HomeService,
	) {

		// 检测登录
		let uid = window.localStorage.getItem('account_id');
        console.log(uid);
        this.ifHotel = localStorage.getItem('company_type') == '1' ? true : false;

        //是否为酒店版,true为酒店版
		if (uid != null && uid != '') {
			this.login = true;
		} else {
            this.login = false;
            this.gotoLogin();
		}
		this.yearVisible = false;
		this.monthVisible = false;

		// search查询
		// this.initializeItems();

		// this.gotoChart();
		this.getIndexInfo();

		if (localStorage.getItem('company_type') == '1'){
			this.getFloatMenuTwo()
		}else {
			this.getFloatMenu();
		}
		this.getYearData();


	}

	public getFloatMenu() {
		this.floatList = [
			// {
			// 	name: "邀约 & 跟单",
			// 	url: Sites.baseapi+"portal/index.php?r=background/CustomerGather&account_id="+this.account_id+"&token="+this.token
			// },
			// {
			// 	name: "找资源",
			// 	url: ""
			// },
			// {
			// 	name: "我的收藏",
			// 	url: "http://www.cike360.com/school/crm_web/portal/index.php?r=background/sales_list&pre_type=3"
			// },
			// {
			// 	name: "口袋学堂",
			// 	url: "http://www.cike360.com/school/crm_web/portal/index.php?r=background/sales_list&pre_type=3"
			// },
			{
				name: "在线客服",
				url: ""
			},{
				name:'退出',
				url:''
			}
		];
		this.subList = [
			{
				name: "灵感图库",
				url: "http://www.cike360.com/school/crm_web/portal/index.php?r=background/sales_list&pre_type=3"
			},
			{
				name: "效果图库",
				url: "http://www.cike360.com/school/crm_web/portal/index.php?r=background/sales_list&pre_type=3"
			},
			{
				name: "矢量图库",
				url: "http://www.cike360.com/school/crm_web/portal/index.php?r=background/sales_list&pre_type=3"
			},
			{
				name: "视频素材",
				url: "http://www.cike360.com/school/crm_web/portal/index.php?r=background/sales_list&pre_type=3"
			},
			{
				name: "婚礼音乐",
				url: "http://www.cike360.com/school/crm_web/portal/index.php?r=background/sales_list&pre_type=3"
			},
			{
				name: "主持词",
				url: "http://www.cike360.com/school/crm_web/portal/index.php?r=background/sales_list&pre_type=3"
			},
		];
		// console.log(this.floatList);
	}
	public getFloatMenuTwo(){
		this.floatList = [

			// {
			// 	name: "口袋学堂",
			// 	url: "http://www.cike360.com/school/crm_web/portal/index.php?r=background/sales_list&pre_type=3"
			// },
			{
				name: "在线客服",
				url: ""
			},{
				name:'退出',
				url:''
			}
		];
		this.subList = [
			{
				name: "灵感图库",
				url: "http://www.cike360.com/school/crm_web/portal/index.php?r=background/sales_list&pre_type=3"
			},
			{
				name: "效果图库",
				url: "http://www.cike360.com/school/crm_web/portal/index.php?r=background/sales_list&pre_type=3"
			},
			{
				name: "矢量图库",
				url: "http://www.cike360.com/school/crm_web/portal/index.php?r=background/sales_list&pre_type=3"
			},
			{
				name: "视频素材",
				url: "http://www.cike360.com/school/crm_web/portal/index.php?r=background/sales_list&pre_type=3"
			},
			{
				name: "婚礼音乐",
				url: "http://www.cike360.com/school/crm_web/portal/index.php?r=background/sales_list&pre_type=3"
			},
			{
				name: "主持词",
				url: "http://www.cike360.com/school/crm_web/portal/index.php?r=background/sales_list&pre_type=3"
			},
		];
	}
	public ionViewWillEnter() {
	}

	getIndexInfo() {
		this.service.getIndexInfo().then(data => {
			console.log(data,'!@#!@#');
			if (data.status == 1) {
				this.space = data.space;
				this.hallList = data.hall;
				this.hotelList = data.hotel;
				this.hotelLogo = data.space.logo;
				if (data.hall.length == 1) {
					this.afterHallList = data.hall;
				} else if (data.hall.length > 1) {
					let cutLine = Math.floor(data.hall.length / 2);
					this.preHallList = data.hall.slice(0, cutLine);
					this.afterHallList = data.hall.slice(cutLine);
				}

			}
		});
	}

	getItems(ev: any) {
		this.orderlists = this.orderlistsOrign;
		console.log("查询",this.orderlists);
		// Reset items back to all of the items
		this.initializeItems();

		// set val to the value of the searchbar
		let val = ev.target.value;

		let newlist = [];
		// if the value is an empty string don't filter the items
		if (val && val.trim() != '') {
			this.titleItems = this.titleItems.filter((item, index) => {
				if ((item.toLowerCase().indexOf(val.toLowerCase()) > -1)) {
					newlist.push(this.orderlists[index]);
				}
				return (item.toLowerCase().indexOf(val.toLowerCase()) > -1);
			});
			this.orderlists = newlist;

		} else {
			this.orderlists = this.orderlistsOrign

		}
	}

	initializeItems() {

		this.orderlists.map((item, index) => {
			this.titleItems[index] = item.name;
		});
	}

	getYearData() {
		let query = {
			hotel_list: this.selectHotel, // 获取全部酒店数据时设为0，多个酒店以逗号连
			year: this.curYear,
			token: this.token
		};
		this.service.getYearData(query).then(data => {
			if (data) {
				this.monthData = data.monthData;
				this.yearDeal = data.yearDeal;
				this.yearNoDeal = data.yearNoDeal;

				if (this.monthData.length > 0) {
					console.log(this.monthData);
					this.monthdataTop = [];
					this.monthdataBottom = [];
					for (let i = 0; i < 6; i++) {
						this.monthdataTop.push(this.monthData[i]);
					}
					for (let i = 6; i < 12; i++) {
						this.monthdataBottom.push(this.monthData[i]);
					}
					console.log(this.monthdataTop);
					console.log(this.monthdataBottom);
				}
			}
		});



	}

	getmouthOrders() {
		let query = {
			year: this.curYear,
			account_id: this.account_id,
			staff_hotel_id: 0,// 获取全部酒店数据时设为0，多个酒店以逗号连
            month: this.checkmonth,
            type: this.ordertypevalue
		};
		this.orderlistsOrign = [];
		this.orderlists = [];
		return this.service.getmouthOrders(query).then(data => {

			this.orderlistsOrign = JSON.parse(data.order_data);
            this.orderlists = JSON.parse(data.order_data);
            console.log(this.orderlists,'222')
        });

	}

	showYearOrders() {
		//获取当年订单
		this.getYearData();
		// this.getmouthOrders();
		this.yearVisible = true;
	}

	showSingle(num) {
        // this.getmouthOrders();
        this.checkpreload = {
            year: this.curYear,
            month: this.checkmonth
        };
        this.checkmonth = num;
		//获取当月订单
		this.getmouthOrders().then(() => {
            this.yearVisible = false;
            this.monthVisible = true;
        });
	}

	hideYearModal() {
		this.yearVisible = false;
		this.monthVisible = false;
	}

	gobackModal() {
		this.yearVisible = true;
		this.monthVisible = false;
	}

	getPreYear() {
		this.curYear = this.curYear - 1;
	}

	getNextYear() {
		this.curYear = this.curYear + 1;
	}

	gotoLogin() {
		this.navCtrl.push(LoginPage);
	}

	gotoChart() {
		// this.navCtrl.push(saleChartPage, { hallname: this.hallname });
		this.navCtrl.push(ordersDataPage, { hallname: this.hallname });
	}

	gotoPics() {
		this.navCtrl.push(PicsPage, { spaceId: this.space.id, hallId: this.hallId, hallname: this.hallname });
	}
	gotoViews() {
		this.navCtrl.push(ViewsPage, { title: this.hallname + '720度全景展示', url: this.panorama_url });
	}
	gotoIframe(item) {
		this.navCtrl.push(ViewsPage, { title: item.name, url: item.url });
	}
	gotoOrdersSearch(){
		this.navCtrl.push(OrderSearchPage);
	}
	gotoCompanyIntro() {
		//www.cike360.com/PHP_BackGround测试  crm.cike360.com 正式
		// this.navCtrl.push(ViewsPage, { title: '公司介绍', url: 'http://crm.cike360.com/portal/index.php?r=background/company_introduction&account_id='+localStorage.getItem('account_id') });
		this.navCtrl.push(ViewsPage, { title: '公司介绍', url:this.nowUrl+'/portal/index.php?r=background/company_introduction&account_id='+localStorage.getItem('account_id')+'&from=ipad' });
	}
	gotoServiceSystem() {
		// this.navCtrl.push(ViewsPage, { title: '服务体系', url: 'http://crm.cike360.com/portal/index.php?r=background/service_system&account_id='+localStorage.getItem('account_id')+'&from=ipad' });
		this.navCtrl.push(ViewsPage, { title: '服务体系', url: this.nowUrl+'/portal/index.php?r=background/service_system&from=ipad&account_id='+localStorage.getItem('account_id')+'&from=ipad' });
	}

	//退出登录
	gotoLoginout(){
		window.localStorage.removeItem('local_user');
		window.localStorage.removeItem('local_password');
		this.navCtrl.setRoot(LoginPage);
	}

	gotoProducts() {
		if (this.login) {
			this.navCtrl.push(FoodPage);
		} else {
			this.navCtrl.push(LoginPage);
		}
	}

	gotoAddOrder() {
		this.navCtrl.push(AddOrderPage);
	}

	gotoDetail(id) {
		let acc_id=localStorage.getItem('account_id');
		let url=this.service.baseApi+'/portal/index.php?r=background/bill&order_id='+id+'&token='+this.service.general.token+'&from=ipad';
		console.log(url);
		this.navCtrl.push(ViewsPage, { title: '订单详情', url:url,order_id:id});
	}

	gotoFloat(item) {
		console.log(item);
		if (item.url != '') {
			if(item.name=='邀约 & 跟单'){
				this.gotoIframe(item);
			}else{
					this.navCtrl.push(FloatMenuPage, { item: item });
				// this.navCtrl
			}
		}else {
			if (item.name == '退出'){
				this.gotoLoginout();
				console.log('111')
			}
		}
	}

	setType(num) {
        this.ordertypevalue = num;
        this.getmouthOrders();

	}

	checkHall(hall) {
		// console.log(this.space);
		// console.log(hall);

		if (this.login) {
			if (hall == 0) {
				this.hallId = 0;
				this.hallname = '全部大厅';
				this.space.slogan = this.space.name;
				this.imgSrc = 'https://inspitation-img-store.oss-cn-beijing.aliyuncs.com/hall/bg.jpg';
				// this.space.name = hall.name;
			} else {
				// this.
				this.space.slogan = hall.name;
				this.hallId = hall.id;
				this.hallname = hall.name;
				this.imgSrc = hall.img_url_bg || '';
				this.panorama_url = hall.panorama_url || '';
			}
		} else {
			this.navCtrl.push(LoginPage);
		}
	}

	parseInt(a){
		return parseInt(a);
	}

	deleteOrder(item,index){

		console.log(item);
		for (var i=0;i<this.department_list.length;i++){

			//包含 6  删除所有订单
			if (this.department_list[i] == '6'){
				this.isSuper = true;

				// this.service.delOrderOne(item.order_id).then(data=>{
				// 	console.log(data);
				// })
				// 	.catch(err=>{
				// 		console.log(err);
				// 	})

			}
		}

		//判断等级 然后删除对应订单
		if (this.isSuper){
			console.log('管理员权限');
			//管理员权限
			this.service.delOrderOne(item.order_id).then(data=>{
				console.log(data);
				this.orderlists.splice(index,1);
			})
				.catch(err=>{
					console.log(err);
				})
		} else {
			//普通权限
			console.log('普通权限');

			if (item.designer_id == this.token){
				this.service.delOrderOne(item.order_id).then(data=>{
					console.log(data);
					this.orderlists.splice(index,1);
				})
					.catch(err=>{
						console.log(err);
					})
			}else {
				alert('您无此权限！');
			}
		}
	}

}
