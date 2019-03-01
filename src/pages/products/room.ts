import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, ToastController } from 'ionic-angular';

import { FoodPage } from './food';
import { MeetingPage } from './meeting';
import { WeddingPage } from './wedding';

import { ProductService } from '../../providers/product';
import * as $ from 'jquery';
import { HomePage } from "../home/home";


@Component({
	selector: 'page-room',
	templateUrl: 'room.html',
	providers: [ProductService]
})
export class RoomPage {
	public account_id = localStorage.getItem('account_id');
	public isManage = window.localStorage.getItem('manage ');

	public admin = true;
	public showedit = false;

	public menulists = [];
	public addname = '';
	public productlist = [];
	public cartlist = [];

	public showcart = false;

	public modalVisible = false;
	public editTypeVisible = false;
	public addTypeVisible = false;
	public modalOrderVisible = false;
	public placeForm = {};
	public isAlert = false;

	public second = 0;       //二级目录选中状态
	public secondname;       //二级目录名称
	public typeP_num = 0;	 //选中的分类包含商品数量
	public typeId;

	public curRoomId = 0;
	public orderList = [];

	public imgUpLoad;  //上传图片

	public order_id;
	public ifFixId = false;

	public showTopName = false;
	public order_name;
	public op_num;

	public addnumber = 1;

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public service: ProductService,
		public toastCtrl: ToastController,
		public alertCtrl: AlertController
	) {
		this.order_id = navParams.get('order_id');
		console.log('navParams.get(order_id)=====', navParams.get('order_id'));
		if (navParams.get('order_id')) {
			this.ifFixId = true;
			this.getOrderInfo();
			this.showTopName = true;
		}
		this.getproducts();
	}

	//获取订单信息
	getOrderInfo() {
		let query = {
			order_id: this.order_id
		}
		this.service.GetMealOrderInfo(query).then(data => {
			this.order_name = data.order_name;
			this.op_num = data.op_num;
		});
	}

	goBack() {
		this.navCtrl.push(HomePage);
	}

	checkMenu(num, id, name) {

		this.second = num;
		this.secondname = name;
		this.showedit = false;
		this.typeId = id;

		this.productlist = [];

		let data = {
			typeId: id,
			account_id: this.account_id
		};

		this.service.getProductByType(data).then(data => {
			if (data.status == 1) {
				for (let i = 0; i < data['list'].length; i++) {
					let t = {
						id: data['list'][i]['id'],
						img: data['list'][i]['ref_pic_url'],
						title: data['list'][i]['product_name'],
						detail: data['list'][i]['description'],
						price: data['list'][i]['price']
					};
					this.productlist.push(t);
				};
				this.typeP_num = data['list'].length;
			}
		});
	}

	getproducts() {
		this.service.getRoomMemu(this.account_id).then(data => {
			console.log(data);
			if (data.status == 1) {
				for (let i = 0; i < data['product'].length; i++) {
					let t = {
						id: data['product'][i]['id'],
						img: data['product'][i]['ref_pic_url'],
						title: data['product'][i]['product_name'],
						detail: data['product'][i]['description'],
						price: data['product'][i]['price'],
					};
					this.productlist.push(t);
				};

				this.menulists = [];
				for (let i = 0; i < data['list'].length; i++) {
					let t = {
						img: data['list'][i]['img'],
						name: data['list'][i]['name'],
						id: data['list'][i]['id']
					}
					this.menulists.push(t);
				};

				// this.secondname = data['list'][0]['name'];
				this.typeP_num = data['product'].length;
				// this.typeId = data['list'][0]['id'];
				console.log(this.typeId);
			}
		});
	}

	// ----新增修改二级目录分类--------
	addMenu() {
		this.addTypeVisible = true;
	}
	// 添加会议分类提交
	formAddSubmit(form) {
		let query = {
			name: this.addname
		}
		this.service.AddRoomType(query).then(data => {
			if (data.status == 1) {
				this.getRoomType();
				this.hideTypeModal();
			}
		});
		this.addname = '';
	}

	getRoomType() {
		this.service.getRoomType().then(data => {
			if (data.status == 1) {
				this.menulists = data.list;
			}
		});
	}

	editType(name) {
		this.editTypeVisible = true;
		this.addname = name;
	}

	hideTypeModal() {
		this.editTypeVisible = false;
		this.addTypeVisible = false;
	}

	// 编辑会议分类提交
	formEditSubmit(form) {
		this.service.EditSupplierType(this.typeId, this.addname).then(data => {
			if (data.status == 1) {
				this.getRoomType();
				this.hideTypeModal();
			}
		});
		this.addname = '';
	}
	// ----新增修改二级目录end--------

	// 删除当前二级目录
	delType(num) {
		let alert = this.alertCtrl.create({
			title: '当前分类下有' + num + '个商品，确认删除？',
			buttons: [
				{
					text: '确定',
					handler: () => {
						this.service.DeleteSupplierType(this.typeId).then(data => {
							if (data) {
								this.getRoomType();
							}
						});
					}
				},
				{
					text: '取消',
					role: 'cancel',
					handler: () => { }
				}
			],
		});
		alert.present();

	}

	//开启加入订单弹窗
	addCart(id) {
		this.curRoomId = id;
		this.modalOrderVisible = true;
		this.service.getOrderDoingAndDone().then(data => {
			this.orderList = data;
		});
	}
	//关闭加入订单弹窗
	hideOrderModal() {
		this.modalOrderVisible = false;
	}

	//加入订单确认
	formOrderSubmit(form) {
		form.roomId = this.curRoomId;
		if (this.ifFixId) {
			form.orderId = this.order_id;
		}
		if (!form.orderId || !form.number) {
			let toast = this.toastCtrl.create({
				message: '请输入完整！',
				showCloseButton: true,
				position: 'middle',
				duration: 2000
			});
			toast.present();
			return;
		}
		this.service.roomAddToOrder(form).then(data => {
			if (data.status == 2) {
				let toast = this.toastCtrl.create({
					message: '该商品不存在！',
					showCloseButton: true,
					position: 'middle',
					duration: 2000
				});
				toast.present();
			} else if (data.status == 1) {
				this.modalOrderVisible = false;
				let toast = this.toastCtrl.create({
					message: '加入订单成功！',
					showCloseButton: true,
					position: 'middle',
					duration: 2000
				});
				this.op_num++;
				toast.present();
			} else {
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


	editProducts() {
		this.showedit = true;
	}

	editSucess() {
		this.showedit = false;
	}
	// 删除产品
	delItem(id) {
		let alert = this.alertCtrl.create({
			title: '确认删除？',
			// subTitle: 'Your friend, Obi wan Kenobi, just accepted your friend request!',
			buttons: [{
				text: '确定',
				handler: () => {
					this.service.deleteProduct(id).then(data => {
						console.log(data);
						// this.getproducts();
					})
						.catch(err => function () {
							console.log(err);
						})

				}
			}]
		});
		alert.present();
	}
	// 新增产品
	addProducts() {
		this.placeForm = {};
		this.modalVisible = true;
		this.getproducts();
	}

	// 修改产品
	editItem(id) {
		this.placeForm = {
			name: '产品名称',
			price: '1998',
			detail: '产品详细介绍'
		}
		this.modalVisible = true;
	}

	formSubmit(form) {



		if (form.unit == undefined || form.unit.length == 0) {
			this.isAlert = true;

		} else {
			this.isAlert = false;
			form.img = this.imgUpLoad;
			console.log(form, this.typeId);
			this.service.addProduct(this.account_id, this.typeId, form.name, form.price, form.cost, form.unit, form.detail, form.img).then(data => {
				this.modalVisible = false;
				console.log(data);
			})
				.catch(err => {
					let alertMsg = this.alertCtrl.create({
						title: '图片不能超过1M',
						buttons: ['确定']
					});
					alertMsg.present();
				})
		}
	}

	hideModal() {
		this.modalVisible = false;
	}

	showCart() {
		this.showcart = true;
		this.getCartlist();
	}

	hideCart() {
		this.showcart = false;
	}

	getCartlist() {
		this.cartlist = [
			{
				id: '1',
				title: '988婚宴',
				price: '100',
				amount: '12',
				mark: '12小时使用时长，包含免费摆台，免费茶水'
			},
			{
				id: '2',
				title: '988婚宴',
				price: '100',
				amount: '12',
				mark: '12小时使用时长，包含免费摆台，免费茶水'
			},
			{
				id: '3',
				title: '988婚宴',
				price: '100',
				amount: '12',
				mark: '12小时使用时长，包含免费摆台，免费茶水'
			},
		];
	}

	gotoMenu(name) {
		console.log(name);
		if (name == 'meeting') {
			this.navCtrl.push(MeetingPage).then(() => {
				this.navCtrl.removeView(this.navCtrl.getPrevious());
			});
		} else if (name == 'food') {
			this.navCtrl.push(FoodPage).then(() => {
				this.navCtrl.removeView(this.navCtrl.getPrevious());
			});;
		} else if (name == 'room') {
			// this.navCtrl.push(RoomPage).then(() => {
			// 	this.navCtrl.removeView(this.navCtrl.getPrevious());
			// });;
		} else if (name == 'wedding') {
			this.navCtrl.push(WeddingPage).then(() => {
				this.navCtrl.removeView(this.navCtrl.getPrevious());
			});;
		} else {
			console.log("找不到此页面");
		}
	}

	// 上传图片传回base64
	public uploadfn2(data) {
		this.imgUpLoad = data;
	}
}
