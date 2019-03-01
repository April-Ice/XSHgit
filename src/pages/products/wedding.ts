import { BarcodeScanner } from './../../plugin/native';
import { Sites } from './../../helpers/adpter';
import { Pipe, PipeTransform, Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { DomSanitizer } from '@angular/platform-browser';
import * as $ from 'jquery';

import { FoodPage } from './food';
import { MeetingPage } from './meeting';
import { RoomPage } from './room';
import { EditFoods } from './editfood';
import { WeddingDetailPage } from './weddingIframe';
import { ViewsPage } from '../show/views';

import { ProductService } from '../../providers/product';

@Component({
	selector: 'page-wedding',
	templateUrl: 'wedding.html',
	providers: [ProductService]
})

export class WeddingPage {
	public token = localStorage.getItem('token');
	public account_id = localStorage.getItem('account_id');

	public isManage = window.localStorage.getItem('manage ');

	public admin = true;
	public showedit = false;

	public imgSrc = "assets/imgs/product/stylebg.jpg";
	// public imgSrc = "assets/imgs/index/bg.jpg";

	public menulists = [];
	public productlist = [];
	public cartlist = [];
	public brightMenu = [];  //婚礼亮点的导航
	public personType = []; //婚礼人员
	public allServicePersonTypeList = [];

	public showcart = false;

	public modalVisible = false;
	public modalAddVisible = false;
	public placeForm = {};

	public second = 2;  //二级目录选中状态
	public secondname;  //二级目录名称
	public typeP_num = 0;	//选中的分类包含商品数量

	public chooseTypeValue = '0';

	public taocanlist = [];
	public showTaocanName = false;
	public selectValue = 1;

	public showMoreBtn = false;

	public curSceneId = 0;
	public curStaff = null;
	public curBright = null;
	public orderList = [];
	public doingOrderList = [];
	public servicePersonQuoteList = [];
	public sceneAddToOrderModalVisible = false;
	public staffAddToOrderModalVisible = false;
	public brightAddToOrderModalVisible = false;
	public servicePersonTypeEditModal = false;//服务人员编辑弹窗

	public imgUpLoad;  //上传图片

	public order_id;
	public ifFixId = false;

	public showTopName = false;
	public order_name;
	public op_num;

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public alertCtrl: AlertController,
		private sanitizer: DomSanitizer,
		public service: ProductService
	) {
		this.order_id = navParams.get('order_id');
		if (navParams.get('order_id')) {
			this.ifFixId = true;
			this.getOrderInfo();
			this.showTopName = true;
		}
		this.getMemu();
		this.getproducts();
		// this.isManage = !!this.isManage;
		console.log(this.admin, this.showedit)
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

	getMemu() {
		this.menulists = [
			{ id: 2, name: '场布套餐' },
			{ id: 3, name: '婚礼亮点' },
			{ id: 4, name: '服务人员' },
			{ id: 5, name: '婚纱' },
			{ id: 6, name: '婚品' },
			{ id: 7, name: '布置' },
			{ id: 1, name: '高端定制' }
		];
		this.secondname = this.menulists[0]['name'];  //二级目录名称
	}

	//初始渲染
	getproducts() {
		//场布套餐
		this.getSetList();
	}

	//场布套餐渲染
	getSetList() {
		this.productlist = [];
		this.service.getSetList(this.token).then(data => {
			if (data.status == 1) {
				for (let i = 0; i < data['list'].length; i++) {
					let t = {
						id: data['list'][i]['id'],
						img: data['list'][i]['poster_url'],
						title: data['list'][i]['product_name'],
						detail: data['list'][i]['description'],
						price: data['list'][i]['price'],
						hole_case_id: data['list'][i]['hole_case_id']
					};
					this.productlist.push(t);
				};
				this.typeP_num = data['list'].length;
			}
		})
	}

	editProducts() {
		this.showedit = true;
	}

	editSucess() {
		this.showedit = false;
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
		// this.modalVisible = true;
		this.navCtrl.push(WeddingDetailPage, { name: '编辑套餐' });
	}

	deltaocanItem(id) {
		let alert = this.alertCtrl.create({
			title: '确认删除？',
			// subTitle: 'Your friend, Obi wan Kenobi, just accepted your friend request!',
			buttons: ['确定']
		});
		alert.present();
	}

	ifshowName() {
		console.log(this.selectValue);
		if (this.selectValue == 1) { //本地上传
			this.showTaocanName = true;
		} else {
			this.showTaocanName = false;
		}
	}
	formAddSubmit(form) {
		console.log(form);
		if (form.from == 1) { //方案库
			this.navCtrl.push(WeddingDetailPage, { name: '方案库' });
		} else if (form.from == 2) { //本地上传
			this.navCtrl.push(WeddingDetailPage, { name: '本地上传' });
		}
		this.hideAddModal();
	}

	hideModal() {
		this.modalVisible = false;
	}

	// 清空购物车
	clearCart() { }

	//开启场布套餐加入订单弹窗
	sceneAddToOrder(id, e) {
		e.stopPropagation();
		this.curSceneId = id;
		this.sceneAddToOrderModalVisible = true;
		this.service.getOrderDoing().then(data => {
			this.doingOrderList = data;
		});
	}
	//关闭场布套餐加入订单弹窗
	cancelSceneAddToOrder() {
		this.sceneAddToOrderModalVisible = false;
	}
	//场布套餐加入订单确认
	sceneAddToOrderConfirm(form) {
		form.copy_order_id = this.curSceneId;
		if (this.ifFixId) {
			form.orderId = this.order_id;
		}
		if (!form.orderId) {
			let alert = this.alertCtrl.create({
				title: '请选择订单！',
				buttons: ['OK']
			});
			alert.present();
			return;
		}
		this.service.sceneAddToOrder(form).then(data => {
			this.sceneAddToOrderModalVisible = false;
			let alert = this.alertCtrl.create({
				title: '加入订单成功！',
				buttons: ['OK']
			});
			this.op_num++;
			alert.present();
		})
	}

	/* 婚礼亮点 */
	public brightPointList = [];
	public editBrightPointModal = false;
	public editBrightPoint = null;
	public editBrightPointId = 0;
	public editBrightPointImg = '';
	public editBrightPointName = '';
	public editBrightPointTypeList = [];
	public editBrightPointType = 0;
	public editBrightPointAreaList = [];
	public editBrightPointArea = 0;
	public editBrightPointSubareaList = [];
	public editBrightPointSubarea = 0;
	public editBrightPointPrice = 0;
	public editBrightPointCost = 0;
	public editBrightPointUnit = '';
	public editBrightPointDescription = '';

	//婚礼亮点渲染
	getBrightLight(type) {
		this.productlist = [];
		this.service.getBrightPoint(this.token, type).then(data => {
			// if(data.status==1){
			this.brightPointList = data['point'];
			console.log(this.brightPointList);
			this.typeP_num = data['point'].length;
			this.brightMenu = data['type_list'];
			// }
		})
		this.GetBrightPointTypeAndArea();
	}
	//获取婚礼亮点类型/区域
	GetBrightPointTypeAndArea() {
		this.editBrightPointAreaList = [];
		this.editBrightPointArea = 0;
		this.editBrightPointSubareaList = [];
		this.editBrightPointSubarea = 0;
		this.editBrightPointTypeList = [];
		this.editBrightPointType = 0;
		this.service.GetBrightPointTypeAndArea().then(data => {
			for (const key in data.area) {
				if (data.area.hasOwnProperty(key)) {
					this.editBrightPointAreaList.push(data.area[key]);
				}
			}
			this.editBrightPointAreaList.splice(0, 0, {
				id: 0,
				name: "请选择布置点"
			});
			this.editBrightPointSubareaList.push({
				id: 0,
				name: "请选择子区域"
			})
			this.editBrightPointTypeList = data.type;
			this.editBrightPointTypeList.splice(0, 0, {
				id: 0,
				name: "请选择分类"
			})
		})
	}
	//变更婚礼亮点区域
	ChangeBrightPointArea() {
		for (let i = 0; i < this.editBrightPointAreaList.length; i++) {
			const curBrightPointArea = this.editBrightPointAreaList[i];
			if (curBrightPointArea.id == this.editBrightPointArea) {
				this.editBrightPointSubareaList = curBrightPointArea.subarea;
				this.editBrightPointSubareaList.splice(0, 0, {
					id: 0,
					name: "请选择子区域"
				})
				break;
			}
		}
		this.editBrightPointSubarea = 0;
	}
	//开启新增婚礼亮点弹窗
	OpenAddBrightPointModal() {
		this.editBrightPoint = null;
		this.editBrightPointId = 0;
		this.editBrightPointImg = '';
		this.editBrightPointName = '';
		this.editBrightPointType = 0;
		this.editBrightPointArea = 0;
		this.editBrightPointSubarea = 0;
		this.editBrightPointPrice = null;
		this.editBrightPointCost = null;
		this.editBrightPointUnit = null;
		this.editBrightPointDescription = '';
		this.editBrightPointModal = true;
	}
	//开启编辑婚礼亮点弹窗
	OpenEditBrightPointModal(item) {
		this.editBrightPoint = item;
		this.editBrightPointId = item.id;
		this.editBrightPointImg = item.poster_url;
		this.editBrightPointName = item.product_name;
		this.editBrightPointType = item.type;
		this.editBrightPointArea = item.area;
		this.editBrightPointSubarea = item.subarea;
		this.editBrightPointPrice = item.price;
		this.editBrightPointCost = item.cost;
		this.editBrightPointUnit = item.unit;
		this.editBrightPointDescription = item.description;
		for (let i = 0; i < this.editBrightPointAreaList.length; i++) {
			const curBrightPointArea = this.editBrightPointAreaList[i];
			if (curBrightPointArea.id == this.editBrightPointArea) {
				this.editBrightPointSubareaList = curBrightPointArea.subarea;
				this.editBrightPointSubareaList.splice(0, 0, {
					id: 0,
					name: "请选择子区域"
				})
				break;
			}
		}
		this.editBrightPointModal = true;
	}
	//关闭开启/编辑婚礼亮点弹窗
	CloseEditBrightPointModal() {
		this.editBrightPointModal = false;
	}
	//新增/编辑婚礼亮点确认
	AddOrEditBrightPointConfirm(form) {
		if (this.editBrightPointImg == '') {
			this.alertCtrl.create({
				title: '请上传婚礼亮点图片！',
				buttons: ['OK']
			}).present();
			return;
		}
		if (this.editBrightPointArea == 0) {
			this.alertCtrl.create({
				title: '请选择布置点！',
				buttons: ['OK']
			}).present();
			return;
		}
		if (this.editBrightPointSubarea == 0) {
			this.alertCtrl.create({
				title: '请选择子区域！',
				buttons: ['OK']
			}).present();
			return;
		}
		if (this.editBrightPointType == 0) {
			this.alertCtrl.create({
				title: '请选择分类！',
				buttons: ['OK']
			}).present();
			return;
		}
		if (this.editBrightPointId == 0) {
			this.service.AddBrightPoint(this.editBrightPointImg, this.editBrightPointName, this.editBrightPointType, this.editBrightPointSubarea, this.editBrightPointPrice, this.editBrightPointCost, this.editBrightPointUnit, this.editBrightPointDescription).then(data => {
				if (data.bright_id > 0) {
					this.productlist.push({
						id: data.bright_id,
						poster_url: this.editBrightPointImg,
						price: this.editBrightPointPrice,
						product_name: this.editBrightPointName,
						area: this.editBrightPointArea,
						subarea: this.editBrightPointSubarea,
						type: this.editBrightPointType,
						company_img: null,
						common_use: 1,
						cost: this.editBrightPointCost,
						unit: this.editBrightPointUnit,
						description: this.editBrightPointDescription
					})
					this.CloseEditBrightPointModal();
				} else {
					this.alertCtrl.create({
						title: '新增婚礼亮点失败，请稍后重试！',
						buttons: ['OK']
					}).present();
				}
			})
		} else {
			this.service.EditBrightPoint(this.editBrightPointId, this.editBrightPointImg, this.editBrightPointName, this.editBrightPointType, this.editBrightPointSubarea, this.editBrightPointPrice, this.editBrightPointCost, this.editBrightPointUnit, this.editBrightPointDescription).then(data => {
				if (data.status == 1) {
					this.editBrightPoint.poster_url = this.editBrightPointImg,
						this.editBrightPoint.price = this.editBrightPointPrice,
						this.editBrightPoint.product_name = this.editBrightPointName,
						this.editBrightPoint.area = this.editBrightPointArea,
						this.editBrightPoint.subarea = this.editBrightPointSubarea,
						this.editBrightPoint.type = this.editBrightPointType,
						this.editBrightPoint.cost = this.editBrightPointCost,
						this.editBrightPoint.unit = this.editBrightPointUnit,
						this.editBrightPoint.description = this.editBrightPointDescription
					this.CloseEditBrightPointModal();
				} else {
					this.alertCtrl.create({
						title: '编辑婚礼亮点失败，请稍后重试！',
						buttons: ['OK']
					}).present();
				}
			})
		}
	}
	//上传婚礼亮点图片
	UploadBrightPointImg(data) {
		this.service.UploadBase64Img(data).then(data => {
			if (data.status == 1) {
				this.editBrightPointImg = data.url;
			} else {
				this.alertCtrl.create({
					title: '图片上传失败，请稍后重试！',
					buttons: ['OK']
				}).present();
			}
		})
	}
	//新增服务人员--废弃 begin
	// formAddPersonSubmit(form) {
	// 	form.img = this.imgUpLoad;
	// 	console.log(form);
	// 	this.service.insertSp(this.token, this.account_id, form.name, form.img, form.telephone, this.selectValue).then(data => {
	// 		this.modalPersonVisible = false;
	// 	})
	// }
	// 上传图片传回base64
	// public uploadfn2(data) {
	// 	this.imgUpLoad = data;
	// }
	//新增服务人员--废弃 end
	//删除婚礼亮点
	DelBrightPoint(item, index) {
		this.service.HideBrightPoint(item.id).then(data => {
			if (data.result == 1) {
				this.productlist.splice(index, 1);
			} else {
				this.alertCtrl.create({
					title: '程序处理失败，请稍后重试！',
					buttons: ['OK']
				}).present();
			}
		})
	}
	//开启婚礼亮点加入订单弹窗
	brightAddToOrder(item, e) {
		e.stopPropagation();
		this.curBright = item;
		this.curBright.count = 1;
		this.brightAddToOrderModalVisible = true;
		this.service.getOrderDoingAndDone().then(data => {
			this.orderList = data;
		});
	}
	//关闭婚礼亮点加入订单弹窗
	cancelBrightAddToOrder() {
		this.brightAddToOrderModalVisible = false;
	}
	//婚礼亮点加入订单确认
	brightAddToOrderConfirm(form) {
		form.wedding_bright_point_id = this.curBright.id;
		this.service.brightAddToOrder(form).then(data => {
			if (data.result == 1) {
				this.brightAddToOrderModalVisible = false;
				let alert = this.alertCtrl.create({
					title: '加入订单成功！',
					buttons: ['OK']
				});
				alert.present();
			} else {
				this.alertCtrl.create({
					title: '程序处理失败，请稍后重试！',
					buttons: ['OK']
				}).present();
			}
		})
	}

	/*婚纱*/
	public hunshaList = [];
	public hunshaPageIndex = 1;
	public hunshaTotalPage = 0;

	public editHunshaModal = false;
	public editHunsha = null;
	public editHunshaId = 0;
	public editHunshaImg = '';
	public editHunshaName = '';
	public editHunshaPrice = 0;
	public editHunshaUnit = '';
	public editHunshaCost = 0;
	public editHunshaInventory = 0;
	public editHunshaAmount = 0;
	public editHunshaDescription = '';
	public editHunshaRemark = '';
	//获取婚纱列表
	GetHunshaList() {
		this.hunshaList = [];
		this.service.GetHunshaList(this.hunshaPageIndex).then(data => {
			this.hunshaList = data.product.product_list;
			this.hunshaTotalPage = data.product.total_page;
		})
	}
	//开启新增婚纱弹窗
	OpenAddHunshaModal() {
		this.editHunsha = null;
		this.editHunshaId = 0;
		this.editHunshaImg = '';
		this.editHunshaName = '';
		this.editHunshaPrice = 0;
		this.editHunshaUnit = '';
		this.editHunshaCost = 0;
		this.editHunshaInventory = 0;
		this.editHunshaAmount = 0;
		this.editHunshaDescription = '';
		this.editHunshaRemark = '';
		this.editHunshaModal = true;
	}
	//开启编辑婚纱弹窗
	OpenEditHunshaModal(item) {
		this.editHunsha = item;
		this.editHunshaId = item.service_product_id;
		this.editHunshaImg = item.ref_pic_url;
		this.editHunshaName = item.name;
		this.editHunshaPrice = item.price;
		this.editHunshaUnit = item.unit;
		this.editHunshaCost = item.cost;
		this.editHunshaInventory = item.inventory;
		this.editHunshaAmount = 0;
		this.editHunshaDescription = item.description;
		this.editHunshaRemark = '';
		this.editHunshaModal = true;
	}
	//关闭开启/编辑婚纱弹窗
	CloseEditHunshaModal() {
		this.editHunshaModal = false;
	}
	//新增/编辑婚纱确认
	AddOrEditHunshaConfirm(form) {
		if (this.editHunshaImg == '') {
			this.alertCtrl.create({
				title: '请上传婚纱图片！',
				buttons: ['OK']
			}).present();
			return;
		}
		if (this.editHunshaId == 0) {
			this.service.AddHunsha(this.editHunshaImg, this.editHunshaName, this.editHunshaPrice, this.editHunshaCost, this.editHunshaUnit, this.editHunshaAmount, this.editHunshaRemark, this.editHunshaDescription)
				.then(data => {
					if (data.status == 1) {
						this.hunshaList.push({
							service_product_id: data.id,
							cost: this.editHunshaCost,
							description: this.editHunshaDescription,
							img_url_lg: this.editHunshaImg + "?x-oss-process=image/resize,m_lfit,h_1200,w_1200",
							inventory: this.editHunshaInventory,
							name: this.editHunshaName,
							price: this.editHunshaPrice,
							ref_pic_url: this.editHunshaImg + "?x-oss-process=image/resize,m_lfit,h_300,w_300",
							source: "my_store",
							unit: this.editHunshaUnit
						});
						this.CloseEditHunshaModal();
					} else {
						this.alertCtrl.create({
							title: '新增婚纱失败，请稍后重试！',
							buttons: ['OK']
						}).present();
					}
				})
		}
		else {
			this.service.EditProduct(this.editHunshaId, this.editHunshaImg, this.editHunshaName, this.editHunshaPrice, this.editHunshaUnit, this.editHunshaCost, this.editHunshaAmount, this.editHunshaInventory, this.editHunshaDescription)
				.then(data => {
					this.editHunsha.ref_pic_url = this.editHunshaImg,
						this.editHunsha.name = this.editHunshaName,
						this.editHunsha.price = this.editHunshaPrice,
						this.editHunsha.unit = this.editHunshaUnit,
						this.editHunsha.cost = this.editHunshaCost,
						this.editHunsha.inventory = this.editHunshaInventory,
						this.editHunsha.description = this.editHunshaDescription;
					this.CloseEditHunshaModal();
				})
		}
	}
	//上传婚纱图片
	UploadHunshaImg(data) {
		this.service.UploadBase64Img(data).then(data => {
			if (data.status == 1) {
				this.editHunshaImg = data.url;
			} else {
				this.alertCtrl.create({
					title: '图片上传失败，请稍后重试！',
					buttons: ['OK']
				}).present();
			}
		})
	}
	//删除婚纱
	DelHunsha(item, index) {
		this.service.DelProduct(item.service_product_id).then(data => {
			this.hunshaList.splice(index, 1);
		})
	}

	/*婚品*/
	public hunpinList = [];
	public hunpinPageIndex = 1;
	public hunpinTotalPage = 0;

	public editHunpinModal = false;
	public editHunpin = null;
	public editHunpinId = 0;
	public editHunpinImg = '';
	public editHunpinName = '';
	public editHunpinPrice = 0;
	public editHunpinUnit = '';
	public editHunpinCost = 0;
	public editHunpinInventory = 0;
	public editHunpinAmount = 0;
	public editHunpinDescription = '';
	public editHunpinRemark = '';
	//获取婚品列表
	GetHunpinList() {
		this.hunpinList = [];
		this.service.GetHunpinList(this.hunshaPageIndex).then(data => {
			this.hunpinList = data.product.product_list;
			this.hunpinTotalPage = data.product.total_page;
		})
	}
	//开启新增婚品弹窗
	OpenAddHunpinModal() {
		this.editHunpin = null;
		this.editHunpinId = 0;
		this.editHunpinImg = '';
		this.editHunpinName = '';
		this.editHunpinPrice = 0;
		this.editHunpinUnit = '';
		this.editHunpinCost = 0;
		this.editHunpinInventory = 0;
		this.editHunpinAmount = 0;
		this.editHunpinDescription = '';
		this.editHunpinRemark = '';
		this.editHunpinModal = true;
	}
	//开启编辑婚品弹窗
	OpenEditHunpinModal(item) {
		this.editHunpin = item;
		this.editHunpinId = item.service_product_id;
		this.editHunpinImg = item.ref_pic_url;
		this.editHunpinName = item.name;
		this.editHunpinPrice = item.price;
		this.editHunpinUnit = item.unit;
		this.editHunpinCost = item.cost;
		this.editHunpinInventory = item.inventory;
		this.editHunpinAmount = 0;
		this.editHunpinDescription = item.description;
		this.editHunpinRemark = '';
		this.editHunpinModal = true;
	}
	//关闭开启/编辑婚品弹窗
	CloseEditHunpinModal() {
		this.editHunpinModal = false;
	}
	//新增/编辑婚品确认
	AddOrEditHunpinConfirm(form) {
		if (this.editHunpinImg == '') {
			this.alertCtrl.create({
				title: '请上传婚品图片！',
				buttons: ['OK']
			}).present();
			return;
		}
		if (this.editHunpinId == 0) {
			this.service.AddHunpin(this.editHunpinImg, this.editHunpinName, this.editHunpinPrice, this.editHunpinCost, this.editHunpinUnit, this.editHunpinAmount, this.editHunpinRemark, this.editHunpinDescription)
				.then(data => {
					if (data.status == 1) {
						this.hunpinList.push({
							service_product_id: data.id,
							cost: this.editHunpinCost,
							description: this.editHunpinDescription,
							img_url_lg: this.editHunpinImg + "?x-oss-process=image/resize,m_lfit,h_1200,w_1200",
							inventory: this.editHunpinInventory,
							name: this.editHunpinName,
							price: this.editHunpinPrice,
							ref_pic_url: this.editHunpinImg + "?x-oss-process=image/resize,m_lfit,h_300,w_300",
							source: "my_store",
							unit: this.editHunpinUnit
						});
						this.CloseEditHunpinModal();
					} else {
						this.alertCtrl.create({
							title: '新增婚品失败，请稍后重试！',
							buttons: ['OK']
						}).present();
					}
				})
		}
		else {
			this.service.EditProduct(this.editHunpinId, this.editHunpinImg, this.editHunpinName, this.editHunpinPrice, this.editHunpinUnit, this.editHunpinCost, this.editHunpinAmount, this.editHunpinInventory, this.editHunpinDescription)
				.then(data => {
					this.editHunpin.ref_pic_url = this.editHunpinImg,
						this.editHunpin.name = this.editHunpinName,
						this.editHunpin.price = this.editHunpinPrice,
						this.editHunpin.unit = this.editHunpinUnit,
						this.editHunpin.cost = this.editHunpinCost,
						this.editHunpin.inventory = this.editHunpinInventory,
						this.editHunpin.description = this.editHunpinDescription;
					this.CloseEditHunpinModal();
				})
		}
	}
	//上传婚品图片
	UploadHunpinImg(data) {
		this.service.UploadBase64Img(data).then(data => {
			if (data.status == 1) {
				this.editHunpinImg = data.url;
			} else {
				this.alertCtrl.create({
					title: '图片上传失败，请稍后重试！',
					buttons: ['OK']
				}).present();
			}
		})
	}
	//删除婚品
	DelHunpin(item, index) {
		this.service.DelProduct(item.service_product_id).then(data => {
			this.hunpinList.splice(index, 1);
		})
	}

	/*布置*/
	public buzhiSubAreaId = 0;
	public buzhiList = [];
	public buzhiPageIndex = 1;
	public buzhiTotalPage = 0;

	public editBuzhiModal = false;
	public editBuzhi = null;
	public editBuzhiId = 0;
	public editBuzhiImg = '';
	public editBuzhiName = '';
	public editBuzhiPrice = 0;
	public editBuzhiUnit = '';
	public editBuzhiCost = 0;
	public editBuzhiInventory = 0;
	public editBuzhiAmount = 0;
	public editBuzhiDescription = '';
	public editBuzhiRemark = '';
	//获取婚品列表
	GetBuzhiList() {
		this.buzhiList = [];
		this.service.GetBuzhi().then(res => {
			if (res.status == 1) {
				this.buzhiSubAreaId = res.subarea.id;
				this.service.GetBuzhiList(this.buzhiSubAreaId, this.buzhiPageIndex).then(data => {
					this.buzhiList = data.product.product_list;
					this.buzhiTotalPage = data.product.total_page;
				})
			}
			else {
				this.alertCtrl.create({
					title: '程序处理失败，请稍后重试！',
					buttons: ['OK']
				}).present();
			}
		});
	}
	//开启新增婚品弹窗
	OpenAddBuzhiModal() {
		this.editBuzhi = null;
		this.editBuzhiId = 0;
		this.editBuzhiImg = '';
		this.editBuzhiName = '';
		this.editBuzhiPrice = 0;
		this.editBuzhiUnit = '';
		this.editBuzhiCost = 0;
		this.editBuzhiInventory = 0;
		this.editBuzhiAmount = 0;
		this.editBuzhiDescription = '';
		this.editBuzhiRemark = '';
		this.editBuzhiModal = true;
	}
	//开启编辑婚品弹窗
	OpenEditBuzhiModal(item) {
		this.editBuzhi = item;
		this.editBuzhiId = item.service_product_id;
		this.editBuzhiImg = item.ref_pic_url;
		this.editBuzhiName = item.name;
		this.editBuzhiPrice = item.price;
		this.editBuzhiUnit = item.unit;
		this.editBuzhiCost = item.cost;
		this.editBuzhiInventory = item.inventory;
		this.editBuzhiAmount = 0;
		this.editBuzhiDescription = item.description;
		this.editBuzhiRemark = '';
		this.editBuzhiModal = true;
	}
	//关闭开启/编辑婚品弹窗
	CloseEditBuzhiModal() {
		this.editBuzhiModal = false;
	}
	//新增/编辑婚品确认
	AddOrEditBuzhiConfirm(form) {
		if (this.editBuzhiImg == '') {
			this.alertCtrl.create({
				title: '请上传布置图片！',
				buttons: ['OK']
			}).present();
			return;
		}
		if (this.editBuzhiId == 0) {
			this.service.AddProduct(this.buzhiSubAreaId, this.editBuzhiImg, this.editBuzhiName, this.editBuzhiPrice, this.editBuzhiCost, this.editBuzhiUnit, this.editBuzhiAmount, this.editBuzhiRemark, this.editBuzhiDescription)
				.then(data => {
					if (data.status == 1) {
						this.buzhiList.push({
							service_product_id: data.id,
							cost: this.editBuzhiCost,
							description: this.editBuzhiDescription,
							img_url_lg: this.editBuzhiImg + "?x-oss-process=image/resize,m_lfit,h_1200,w_1200",
							inventory: this.editBuzhiInventory,
							name: this.editBuzhiName,
							price: this.editBuzhiPrice,
							ref_pic_url: this.editBuzhiImg + "?x-oss-process=image/resize,m_lfit,h_300,w_300",
							source: "my_store",
							unit: this.editBuzhiUnit
						});
						this.CloseEditBuzhiModal();
					} else {
						this.alertCtrl.create({
							title: '新增布置失败，请稍后重试！',
							buttons: ['OK']
						}).present();
					}
				})
		}
		else {
			this.service.EditProduct(this.editBuzhiId, this.editBuzhiImg, this.editBuzhiName, this.editBuzhiPrice, this.editBuzhiUnit, this.editBuzhiCost, this.editBuzhiAmount, this.editBuzhiInventory, this.editBuzhiDescription)
				.then(data => {
					this.editBuzhi.ref_pic_url = this.editBuzhiImg,
						this.editBuzhi.name = this.editBuzhiName,
						this.editBuzhi.price = this.editBuzhiPrice,
						this.editBuzhi.unit = this.editBuzhiUnit,
						this.editBuzhi.cost = this.editBuzhiCost,
						this.editBuzhi.inventory = this.editBuzhiInventory,
						this.editBuzhi.description = this.editBuzhiDescription;
					this.CloseEditBuzhiModal();
				})
		}
	}
	//上传婚品图片
	UploadBuzhiImg(data) {
		this.service.UploadBase64Img(data).then(data => {
			if (data.status == 1) {
				this.editBuzhiImg = data.url;
			} else {
				this.alertCtrl.create({
					title: '图片上传失败，请稍后重试！',
					buttons: ['OK']
				}).present();
			}
		})
	}
	//删除婚品
	DelBuzhi(item, index) {
		this.service.DelProduct(item.service_product_id).then(data => {
			this.buzhiList.splice(index, 1);
		})
	}

	/*婚纱/婚品/布置 加入订单*/
	public curProduct = null;
	public productAddToOrderModalVisible = false;
	//开启婚礼亮点加入订单弹窗
	OpenProductAddToOrderModal(item, subareaId) {
		if (subareaId == null) {
			subareaId = this.buzhiSubAreaId;
		}
		this.curProduct = item;
		this.curProduct.buyCount = 1;
		this.curProduct.buyPrice = item.price;
		this.curProduct.buyRemark = "";
		this.curProduct.typ = subareaId;
		this.curProduct.shopCarArea = 9;
		this.curProduct.shopCarSubArea = subareaId;
		this.curProduct.img_id = "";
		this.curProduct.img_type = "";
		this.productAddToOrderModalVisible = true;
		this.service.getOrderDoingAndDone().then(data => {
			this.orderList = data;
			this.curProduct.orderId = 0;
		});
	}
	//关闭婚礼亮点加入订单弹窗
	CloseProductAddToOrderModal() {
		this.productAddToOrderModalVisible = false;
	}
	//婚礼亮点加入订单确认
	ProductAddToOrderConfirm(form) {
		var productList = this.curProduct.source + "|" + this.curProduct.service_product_id + "|" + this.curProduct.img_id + "|" + this.curProduct.img_type +
			"|" + this.curProduct.typ + "|" + this.curProduct.shopCarSubArea + "|" + this.curProduct.name + "|" + this.curProduct.buyPrice + "|" + this.curProduct.cost +
			"|" + this.curProduct.unit + "|" + this.curProduct.buyCount + "|" + this.curProduct.description + "|" + this.curProduct.buyRemark;
		this.service.ProductAdd2Order(this.curProduct.orderId, productList).then(data => {
			this.productAddToOrderModalVisible = false;
			this.alertCtrl.create({
				title: '加入订单成功！',
				buttons: ['OK']
			}).present();
		})
	}

	/* 服务人员 */
	//服务人员渲染
	getServicePerson(type) {
		this.productlist = [];
		this.service.getServicePerson(this.token, type).then(data => {
			if (data.status == 1) {
				for (let i = 0; i < data['service_person'].length; i++) {
					let t = {
						id: data['service_person'][i]['id'],
						img: data['service_person'][i]['avatar'],
						title: data['service_person'][i]['name'],
						detail: data['service_person'][i]['description'],
						price: data['service_person'][i]['price'],
						recommend: data['service_person'][i]['recommend']
					};
					this.productlist.push(t);
				};
				this.typeP_num = data['service_person'].length;
				this.personType = data['type'];
				console.log(this.productlist);
			}
		})
	}
	//开启编辑服务人员类型弹窗
	OpenServicePersonTypeEditModal() {
		this.service.GetServicePersonType().then(data => {
			this.allServicePersonTypeList = data;
		})
		this.servicePersonTypeEditModal = true;
	}
	//关闭编辑服务人员类型弹窗
	CloseServicePersonTypeEditModal() {
		this.servicePersonTypeEditModal = false;
	}
	//更改服务人员类型显示
	ChangeServicePersonTypeShow(item) {
		item.hid = !item.hid;
	}
	//编辑服务人员类型确认
	ServicePersonTypeEditConfirm() {
		let showTypeList = [];
		let hiddenTypeString = "";
		this.allServicePersonTypeList.forEach(element => {
			if (element.hid == true) {
				hiddenTypeString += element.id + ",";
			} else {
				showTypeList.push(element);
			}
		});
		if (hiddenTypeString.length > 0) {
			hiddenTypeString = hiddenTypeString.substring(0, hiddenTypeString.length - 1);
		}
		this.service.HideServicePersonType(hiddenTypeString).then(data => {
			if (data.result == 1) {
				this.personType = showTypeList;
				this.CloseServicePersonTypeEditModal();
			} else {
				this.alertCtrl.create({
					title: '服务人员类型编辑失败，请稍后重试！',
					buttons: ['OK']
				}).present();
			}
		})
	}
	//置顶服务人员
	StickServicePerson(item, index) {
		this.service.SetTopServicePerson(item.id).then(data => {
			if (data.result == 1) {
				item.recommend = 1;
				this.productlist.splice(index, 1);
				this.productlist.splice(0, -1, item);
			}
			else {
				this.alertCtrl.create({
					title: '置顶失败，请稍后重试！',
					buttons: ['OK']
				}).present();
			}
		})
	}
	//取消置顶服务人员
	CancelStickServicePerson(item, index) {
		this.service.SetNoTopServicePerson(item.id).then(data => {
			if (data.result == 1) {
				item.recommend = 0;
				this.productlist.splice(index, 1);
				let i = -1;
				for (var j = 0; j < this.productlist.length; j++) {
					if (this.productlist[j].recommend == 0) {
						i = j;
						break;
					}
				}
				this.productlist.splice(i, -1, item);
			} else {
				this.alertCtrl.create({
					title: '取消置顶失败，请稍后重试！',
					buttons: ['OK']
				}).present();
			}
		})
	}
	//新增服务人员
	AddServicePerson() {
		let url = Sites.baseapi + "portal/index.php?r=background/upload_service_person&origin=hotel&account_id=" + localStorage.getItem("account_id") + "&token=" + localStorage.getItem("token") + "&avatar=" + encodeURIComponent(localStorage.getItem("avatar")) + "&name=" + encodeURIComponent(localStorage.getItem("name"));
		this.gotoIframe("新增服务人员", url);
	}
	//编辑服务人员
	EditServicePerson(item) {
		let url = Sites.baseapi + "/portal/index.php?r=background/upload_case_detail&tid=&pid=1&service_person_id=" + item.id + "&type=service_person&token=" + localStorage.getItem("token");
		this.gotoIframe("服务人员", url);
	}
	//删除服务人员
	DelServicePerson(item, index, e) {
		e.stopPropagation();
		this.service.DelServicePerson(item.id).then(data => {
			if (data == 1) {
				this.productlist.splice(index, 1);
			}
		})
	}
	//开启服务人员加入订单弹窗
	staffAddToOrder(item, e) {
		e.stopPropagation();
		console.log(item)
		this.curStaff = item;
		this.staffAddToOrderModalVisible = true;
		this.service.getOrderDoingAndDone().then(data => {
			this.orderList = data;
		});
		this.service.getServicePersonQuote(item.id).then(data => {
			if (data.status == 1) {
				this.servicePersonQuoteList = data.list;
			} else {
				this.alertCtrl.create({
					title: '获取服务人员报价失败，请稍后重试！',
					buttons: ['OK']
				}).present();
			}
		});
	}
	//关闭服务人员加入订单弹窗
	cancelStaffAddToOrder() {
		this.staffAddToOrderModalVisible = false;
	}
	//服务人员加入订单确认
	staffAddToOrderConfirm(form) {
		form.service_product_id = this.curStaff.id;
		this.servicePersonQuoteList.forEach(element => {
			if (element.id == form.price_id) {
				form.price = element.price;
			}
		});
		form.amount = 1;
		form.remark = '';
		this.service.staffAddToOrder(form).then(data => {
			if (data.result == 1) {
				this.staffAddToOrderModalVisible = false;
				let alert = this.alertCtrl.create({
					title: '加入订单成功！',
					buttons: ['OK']
				});
				alert.present();
			} else {
				this.alertCtrl.create({
					title: '程序处理失败，请稍后重试！',
					buttons: ['OK']
				}).present();
			}
		})
	}

	addTaocan() {
		this.modalAddVisible = true;
		this.selectValue = 1;
		this.showTaocanName = false;
		this.taocanlist = [
			{
				id: 1,
				title: '方案库'
			},
			{
				id: 2,
				title: '本地上传'
			}
		];
	}
	hideAddModal() {
		this.modalAddVisible = false;
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
			});
		} else if (name == 'room') {
			this.navCtrl.push(RoomPage).then(() => {
				this.navCtrl.removeView(this.navCtrl.getPrevious());
			});
		} else if (name == 'wedding') {
			// this.navCtrl.push(WeddingPage).then(() => {
			// 	this.navCtrl.removeView(this.navCtrl.getPrevious());
			// });;
		} else {
			console.log("找不到此页面");
		}
	}

	gotoFrame(name) {
		if (name == '色彩定位') {
			this.navCtrl.push(WeddingDetailPage, { name: name });
		} else if (name == '风格定位') {
			this.navCtrl.push(WeddingDetailPage, { name: name });
		} else if (name == '婚礼统筹') {
			this.navCtrl.push(WeddingDetailPage, { name: name });
		} else if (name == '场布DIY') {
			this.navCtrl.push(WeddingDetailPage, { name: name });
		}
	}
	gotoDetail(name, id) {
		this.navCtrl.push(WeddingDetailPage, { name: name, id: id });
	}

	checkSecond(num, item) {
		this.second = item.id;
		this.secondname = item.name;
		console.log(num, item);
		this.showedit = false;
		if (item.id == 2) { this.getSetList() }
		if (item.id == 3) { this.getBrightLight(0) }
		if (item.id == 4) { this.getServicePerson(3) }
		if (item.id == 5) { this.GetHunshaList() }
		if (item.id == 6) { this.GetHunpinList() }
		if (item.id == 7) { this.GetBuzhiList() }
	}

	chooseType(num) {
		this.chooseTypeValue = num;

		this.getBrightLight(num);
	}

	checkPersonType(type) {
		this.chooseTypeValue = type;
		this.getServicePerson(type)

	}

	gotoIframe(title, url) {
		this.navCtrl.push(ViewsPage, { title: title, url: url });
	}

	//更多按钮点击事件
	showMoreNav() {

		if (this.showMoreBtn == false) {
			$('.person-toptitle').css('height', 'auto');
			var a = $('.person-toptitle').height();
			$('.person-div-item').css('height', '50vh');
			$('.person-div-item').css('overflow-y', 'scroll');
			console.log(a);
		} else {
			$('.person-toptitle').css('height', '6vh');

			// $('.person-div').css('height','calc(100vh - 44px - 8vh - 3rem)')
		}
		this.showMoreBtn = !this.showMoreBtn;
	}
}
