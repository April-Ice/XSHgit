import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, ToastController } from 'ionic-angular';

import { RoomPage } from './room';
import { FoodPage } from './food';
import { WeddingPage } from './wedding';

import { ProductService } from '../../providers/product';
import * as $ from 'jquery';
import { query } from '@angular/core/src/animation/dsl';
import { HomePage } from "../home/home";

@Component({
	selector: 'page-meeting',
	templateUrl: 'meeting.html',
	providers: [ProductService]
})
export class MeetingPage {

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
	public placeForm = {};

	public addTypeVisible = false;

	public modalOrderVisible = false;
	public editTypeVisible = false;

	public second = 0;     //二级目录选中状态
	public secondname;     //二级目录名称
	public secondSegment;  //二级目录segment
	public typeP_num = 0;
	public typeId;

	public curRoomId = 0;
	public orderList = [];

	public imgUpLoad;  //上传图片

	public isAlert = false;

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

	checkMenu(id) {
		this.getproducts();
	}

	//选择分类
	checkSecond(num, name, id) {
		this.second = num;
		this.secondname = name;
		this.secondSegment = name;
		this.showedit = false;
		this.typeId = id;

		this.productlist = [];

		let data = {
			typeId: this.typeId,
			account_id: this.account_id
		}

		this.service.getProductByType(data).then(data => {
			if (data.status == 1) {
				for (let i = 0; i < data['list'].length; i++) {
					let t = {
						id: data['list'][i]['id'],
						img: data['list'][i]['ref_pic_url'],
						title: data['list'][i]['product_name'],
						detail: data['list'][i]['description'],
						price: data['list'][i]['price'],
					};
					this.productlist.push(t);
				};
				this.typeP_num = data['list'].length;
			}
		});
	}

	//初始渲染
	getproducts() {
		this.service.getMeetingMemu(this.account_id).then(data => {
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

				this.secondname = data['list'][0]['name'];
				this.typeP_num = data['product'].length;
			}
		});
	}

	editProducts() {
		this.showedit = true;
	}

	editSucess() {
		this.showedit = false;
	}
	// 删除产品
	delItem(id) {
		let query = { id: id };
		this.service.DeleteProduct(query).then(data => {
			if (data) {
				this.getproducts();
			}
		});
	}

	// 删除全部产品
	delAllItem(id) {
		let alert = this.alertCtrl.create({
			title: '当前分类下有8个产品，确认全部删除？',
			// subTitle: 'Your friend, Obi wan Kenobi, just accepted your friend request!',
			buttons: ['确定']
		});
		alert.present();
	}

	// 删除产品图片 ???????
	delItemImg(id) {
		let query = { id: id };
		this.service.DeleteProductImg(query).then(data => {
			if (data) {
				this.getproducts();
			}
		});
	}

	// 新增产品
	addProducts() {
		this.placeForm = {};
		this.modalVisible = true;
	}

	// 修改产品
	editItem(id) {
		this.placeForm = {
			name: '产品名称',
			price: '1998',
			detail: '产品详细介绍'
		}
		this.modalVisible = true;
		this.getproducts();
	}

	formSubmit(form) {

		if (form.unit == undefined || form.unit.length == 0) {
			this.isAlert = true;

		} else {
			this.isAlert = false;
			form.img = this.imgUpLoad;
			this.service.addProduct(this.account_id, this.typeId, form.name, form.price, form.cost, form.unit, form.detail, form.img).then(data => {
				this.modalVisible = false;
			})
		}

	}

	hideModal() {
		this.modalVisible = false;
	}


	//开启加入订单弹窗
	addCart(id) {
		console.log(id);
		this.curRoomId = id;
		this.modalOrderVisible = true;
		this.service.getOrderDoingAndDone().then(data => {
			this.orderList = data;
		});
	}
	// 隐藏加入订单弹窗
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

	hideCart() {
		this.showcart = false;
	}

	deltaocanItem(id) {
		let alert = this.alertCtrl.create({
			title: '确认删除？',
			buttons: [{
				text: '确定',
				handler: () => {
					this.service.deleteProduct(id).then(data => {
						console.log(data);

					})
						// .catch(err => function () {
						// 	console.log(err);
						// })

				}
			}]
		});
		alert.present();
	}

	// 新增/修改全部商品
	addMenu() {
		this.addTypeVisible = true;
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
				this.getMeetingType();
				this.hideTypeModal();
			}
		});
		this.addname = '';
	}

	// 添加会议分类提交
	formAddSubmit(form) {
		let query = {
			name: this.addname
		}
		this.service.AddMeetingType(query).then(data => {
			if (data.status == 1) {
				this.getMeetingType();
				this.hideTypeModal();
			}
		});
		this.addname = '';
	}

	getMeetingType() {
		this.service.getMeetingType().then(data => {
			if (data.status == 1) {
				this.menulists = data.list;
				console.log(this.menulists);
			}
		});
	}

	// 删除全部商品
	delType(num) {
		let alert = this.alertCtrl.create({
			title: '当前分类下有' + num + '个商品，确认删除？',
			buttons: [
				{
					text: '确定',
					handler: () => {
						this.service.DeleteSupplierType(this.typeId).then(data => {
							if (data) {
								this.getMeetingType();
							}
						});
					}
				},
				{
					text: '取消',
					role: 'cancel',
					handler: () => { }
				}
			]
		});
		alert.present();
	}

	gotoMenu(name) {
		console.log(name);
		if (name == 'meeting') {
			// this.navCtrl.push(MeetingPage).then(() => {
			// 	this.navCtrl.removeView(this.navCtrl.getPrevious());
			// });
		} else if (name == 'food') {
			this.navCtrl.push(FoodPage).then(() => {
				this.navCtrl.removeView(this.navCtrl.getPrevious());
			});;
		} else if (name == 'room') {
			this.navCtrl.push(RoomPage).then(() => {
				this.navCtrl.removeView(this.navCtrl.getPrevious());
			});;
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
