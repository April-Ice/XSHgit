import {
	query
} from '@angular/core/src/animation/dsl';
import {
	Injectable,
	Injector
} from '@angular/core';

import {
	BaseService
} from './base';

import * as $ from 'jquery';

@Injectable()
export class ProductService extends BaseService {

	constructor(injector: Injector) {
		super(injector);
	}

	// 通用
	// 删除产品
	public DeleteProduct(query) {
		let url = 'portal/index.php?r=product/DeleteProduct';
		return this.post(url, query);
	}
	// 删除产品图片
	public DeleteProductImg(query) {
		let url = 'portal/index.php?r=product/DeleteProductImg';
		return this.post(url, query);
	}

	/************************************************************************************/
	/********************************客房 && 会议 公共部分**********************************/
	/************************************************************************************/
	public getProductByType(data) {
		let url = 'portal/index.php?r=product/GetProductByType';
		return this.get(url, data);
	}

	public addProduct(account_id, typeId, name, price, cost, unit, description, imgs) {
		let query = {
			account_id: account_id,
			typeId: typeId,
			name: name,
			price: price,
			cost: cost,
			unit: unit,
			description: description,
			imgs: imgs
		};

		let url = 'portal/index.php?r=product/AddProduct';
		// console.log(query,url);
		return this.post(url, query);

	}

	public deleteProduct(id){
		let query = {
			id : id
		};
		let url = 'portal/index.php?r=product/DeleteProduct';
		return this.post(url, query);
	}


	/************************************************************************************/
	/**************************************餐饮部分***************************************/
	/************************************************************************************/

	/**
	 * 获取菜单列表及全部菜品分类列表
	 *
	 * @returns
	 * @memberof ProductService
	 */
	public GetMealMemu() {
		let data = {
			account_id: this.general.account_id
		}
		let url = 'portal/index.php?r=product/GetDishesMenu';
		return this.get(url, data);
	}

	/**
	 * 获取订单名称和数量
	 *
	 * @returns
	 * @memberof ProductService
	 */
	public GetMealOrderInfo(query) {
		let url = 'portal/index.php?r=sale/get_order_data';
		return this.get(url, query);
	}

	
	/**
	 * 获取菜单菜品
	 *
	 * @param {any} menu_id 菜单id
	 * @param {any} dish_type_id 菜品分类id，0全部
	 * @returns
	 * @memberof ProductService
	 */
	public GetMenuDetail(menu_id, dish_type_id) {
		let query = {
			menuId: menu_id,
			dishTypeId: dish_type_id
		};
		let url = 'portal/index.php?r=product/GetDishesMenuDetail';
		return this.get(url, query);
	}
	/**
	 * 获取指定菜单下菜品分类及其包含的菜品数量(不一定是全部菜品分类)
	 *
	 * @param {any} menu_id 菜单id
	 * @returns
	 * @memberof ProductService
	 */
	public GetDishTypesDishNum(menu_id) {
		let query = {
			menuId: menu_id
		};
		let url = 'portal/index.php?r=product/GetDishTypesDishNum';
		return this.get(url, query);
	}
	/**
	 *获取当前账户菜品
	 *
	 * @param {*} dishTypeId 菜品类型id
	 * @param {*} menuId 菜单id，用于检测菜品在该菜单下状态。不检查，用0
	 * @returns
	 * @memberof ProductService
	 */
	public GetAccountDishes(dishTypeId,menuId) {
		let query = {
			accountId: this.general.account_id,
			dishTypeId: dishTypeId,
			menuId:menuId
		};
		let url = 'portal/index.php?r=product/GetDishes';
		return this.get(url, query);
	}
	/**
	 * 添加菜单
	 *
	 * @param {any} menu_name 菜单名称
	 * @returns
	 * @memberof ProductService
	 */
	public AddDishesMenu( menu_name) {
		let form = {
			account_id: this.general.account_id,
			name: menu_name
		}
		let url = 'portal/index.php?r=product/AddDishesMenu';
		return this.post(url, form);
	}
	/**
	 * 删除菜单
	 *
	 * @param {any} id 菜单id
	 * @returns
	 * @memberof ProductService
	 */
	public DelDishesMenu(id) {
		let form = {
			id: id
		}
		let url = 'portal/index.php?r=product/DelDishesMenu';
		return this.post(url, form);
	}
	/**
	 * 新增菜品分类
	 *
	 * @param {any} name 菜品分类名称
	 * @memberof ProductService
	 */
	public AddDishType(name) {
		let form = {
			accountId: this.general.account_id,
			name: name
		}
		let url = 'portal/index.php?r=product/AddDishType';
		return this.post(url, form);
	}
	/**
	 * 编辑菜品分类
	 *
	 * @param {any} id 菜品分类id
	 * @param {any} name 菜品分类名称
	 * @memberof ProductService
	 */
	public EditDishType(id, name) {
		let form = {
			id: id,
			name: name
		}
		let url = 'portal/index.php?r=product/EditDishType';
		return this.post(url, form);
	}
	/**
	 * 删除菜品分类
	 *
	 * @param {any} id 菜品分类id
	 * @memberof ProductService
	 */
	public DelDishType(id) {
		let form = {
			id: id
		}
		let url = 'portal/index.php?r=product/DelDishType';
		return this.post(url, form);
	}
	/**
	 *新增菜单菜品
	 *
	 * @param {*} menuId 菜单id
	 * @param {*} dishId 菜品id
	 * @param {*} price 菜品价格
	 * @param {*} count 菜品数量
	 * @returns
	 * @memberof ProductService
	 */
	public AddMenuDish(menuId,dishId,price,count){
		let form = {
			menuId: menuId,
			dishId: dishId,
			price:price,
			count: count
		}
		let url = 'portal/index.php?r=product/AddMenuDish';
		return this.post(url, form);
	}
	/**
	 * 编辑菜单菜品
	 *
	 * @param {any} id 菜单菜品id
	 * @param {any} price 菜单菜品价格
	 * @param {any} count 菜单菜品数量
	 * @memberof ProductService
	 */
	public EditMenuDish(id, price, count) {
		let form = {
			id: id,
			price: price,
			count: count
		}
		let url = 'portal/index.php?r=product/EditMenuDish';
		return this.post(url, form);
	}
	/**
	 * 删除菜单菜品
	 *
	 * @param {any} id 菜单菜品id
	 * @memberof ProductService
	 */
	public DelMenuDish(id) {
		let form = {
			id: id
		}
		let url = 'portal/index.php?r=product/DelMenuDish';
		return this.post(url, form);
	}

	/**
	 * 新增菜品
	 *
	 * @param {any} dishType 菜品分类
	 * @param {any} name 菜品名称
	 * @param {any} price 菜品价格
	 * @param {any} cost 菜品成本
	 * @param {any} unit 菜品单位
	 * @param {any} description 描述
	 * @param {any} img 图片，base64
	 * @returns
	 * @memberof ProductService
	 */
	public AddDish(dishType, name, price, cost, unit, description, img) {
		let query = {
			accountId: this.general.account_id,
			dishType: dishType,
			name: name,
			price: price,
			cost: cost,
			unit: unit,
			description: description,
			img: img
		};
		let url = 'portal/index.php?r=product/AddDish';
		return this.post(url, query);
	}
	/**
	 * 编辑菜品
	 *
	 * @param {any} id 菜品id
	 * @param {any} dishType 菜品分类
	 * @param {any} name 菜品名称
	 * @param {any} price 菜品价格
	 * @param {any} cost 菜品成本
	 * @param {any} unit 菜品单位
	 * @param {any} description 描述
	 * @param {any} img 图片，base64
	 * @returns
	 * @memberof ProductService
	 */
	public EditDish(id, dishType, name, price, cost, unit, description, img) {
		let query = {
			accountId: this.general.account_id,
			id: id,
			dishType: dishType,
			name: name,
			price: price,
			cost: cost,
			unit: unit,
			description: description,
			img: img
		};
		let url = 'portal/index.php?r=product/EditDish';
		return this.post(url, query);
	}

	/**
	 * 菜单加入订单
	 *
	 * @param {any} menu_id 菜单id
	 * @param {any} order_id 订单id
	 * @returns
	 * @memberof ProductService
	 */
	public MenuAdd2Order(menu_id,order_id,menuPrice,menuCount) {
		let form = {
			menuId: menu_id,
			orderId: order_id,
			token: this.general.token,
			menuPrice:menuPrice,
			menuCount:menuCount
		}
		let url = 'portal/index.php?r=product/MenuAddToOrder';
		return this.post(url, form);
	}
	/************************************************************************************/
	/***********************************会议/客房***********************************/
	/************************************************************************************/
	//会议/客房加入订单
	public roomAddToOrder(form) {
		form.token = this.general.token;
		let url = 'portal/index.php?r=product/RoomAddToOrder';
		return this.post(url, form);
	}
	//场布套餐加入订单
	public sceneAddToOrder(form) {
		form.token = this.general.token;
		let url = 'portal/index.php?r=dailyReport/copy_order';
		return this.post(url, form);
	}
	/************************************************************************************/
	/***********************************婚礼亮点***********************************/
	/************************************************************************************/
	//获取婚礼亮点分类、区域
	public GetBrightPointTypeAndArea() {
		let query = {};
		let url = 'portal/index.php?r=content/Get_area';
		return this.get(url, query);
	}
	//新增婚礼亮点
	public AddBrightPoint(poster, name, type, subarea, price, cost, unit, description) {
		let form = {
			account_id: this.general.account_id,
			poster_url: poster,
			name: name,
			type: type,
			subarea: subarea,
			price: price,
			cost: cost,
			unit: unit,
			description: description,
			img_list: '',
			video_list: ''
		}
		let url = 'portal/index.php?r=content/Insert_account_bright_point';
		return this.post(url, form);
	}
	//编辑婚礼亮点
	public EditBrightPoint(BrightPointId, poster, name, type, subarea, price, cost, unit, description) {
		let form = {
			bright_point_id: BrightPointId,
			account_id: this.general.account_id,
			poster_url: poster,
			name: name,
			type: type,
			subarea: subarea,
			price: price,
			cost: cost,
			unit: unit,
			description: description,
		}
		let url = 'portal/index.php?r=content/EditBrightPoint';
		return this.post(url, form);
	}
	//隐藏婚礼亮点
	public HideBrightPoint(BrightPointId) {
		let form = {
			account_id: this.general.account_id,
			wedding_bright_point_id: BrightPointId
		}
		let url = 'portal/index.php?r=content/Hide_bright_point';
		return this.post(url, form);
	}
	//显示婚礼亮点
	public ShowBrightPoint(BrightPointId) {
		let form = {
			account_id: this.general.account_id,
			wedding_bright_point_id: BrightPointId
		}
		let url = 'portal/index.php?r=content/Show_bright_point';
		return this.post(url, form);
	}
	//婚礼亮点加入订单
	public brightAddToOrder(form) {
		form.account_id = this.general.account_id;
		let url = 'portal/index.php?r=content/Add_bright_point_to_order';
		return this.post(url, form);
	}
	/************************************************************************************/
	/***********************************服务人员***********************************/
	/************************************************************************************/
	//获取服务人员类型
	public GetServicePersonType() {
		let query = {
			account_id: this.general.account_id,
			role: 2
		}
		let url = 'portal/index.php?r=sale/Get_service_type';
		return this.get(url, query);
	}
	//隐藏服务人员类型
	public HideServicePersonType(hiddenServicePersonTypeList) {
		let form = {
			account_id: this.general.account_id,
			role: 2,
			hid_service_type_list: hiddenServicePersonTypeList
		}
		let url = 'portal/index.php?r=sale/Account_hid_service_type';
		return this.post(url, form);
	}
	//置顶服务人员
	public SetTopServicePerson(servicePersonId) {
		let form = {
			account_id: this.general.account_id,
			service_person_id: servicePersonId
		}
		let url = 'portal/index.php?r=sale/Set_person_top';
		return this.post(url, form);
	}
	//取消置顶服务人员
	public SetNoTopServicePerson(servicePersonId) {
		let form = {
			service_person_id: servicePersonId
		}
		let url = 'portal/index.php?r=sale/Set_person_notop';
		return this.post(url, form);
	}
	//删除服务人员
	public DelServicePerson(servicePersonId) {
		let form = {
			service_person_id: servicePersonId
		}
		let url = 'portal/index.php?r=background/del_service_person';
		return this.postObject(url, form);
	}
	//服务人员加入订单
	public staffAddToOrder(form) {
		form.token = this.general.token;
		let url = 'portal/index.php?r=sale/Insert_product_to_order';
		return this.post(url, form);
	}
	//获取服务人员报价
	public getServicePersonQuote(service_person_id) {
		let query = {
			service_person_id: service_person_id
		};
		let url = 'portal/index.php?r=background/GetServicePersonQuote';
		return this.get(url, query);
	}

	/************************************************************************************/
	/***********************************会议 && 客房部分***********************************/
	/************************************************************************************/
	// 获取会议分类 && 第一个分类的全部产品
	public getMeetingMemu(account_id) {
		let query = {
			account_id: account_id
		};
		let url = 'portal/index.php?r=product/GetMeetingType';
		return this.get(url, query);
	}

	public AddMeetingType(query) {
		query.account_id = this.general.account_id;
		let url = 'portal/index.php?r=product/AddMeetingType';
		return this.post(url, query);
	}

	/**
	 * 编辑会议/客房分类
	 *
	 * @param {*} id
	 * @param {*} name
	 * @returns
	 * @memberof ProductService
	 */
	public EditSupplierType(id,name) {
		let query={
			id:id,
			name:name
		}
		let url = 'portal/index.php?r=product/EditSupplierType';
		return this.post(url, query);
	}

	/**
	 * 删除会议/客房分类
	 *
	 * @param {*} id
	 * @returns
	 * @memberof ProductService
	 */
	public DeleteSupplierType(id) {
		let query={
			id:id
		}
		let url = 'portal/index.php?r=product/DeleteSupplierType';
		return this.post(url, query);
	}

	public getMeetingType() {
		let query = {
			account_id: this.general.account_id
		}
		let url = 'portal/index.php?r=product/GetMeetingType';
		return this.get(url, query);
	}

	// 客房
	public getRoomMemu(account_id) {
		let query = {
			account_id: account_id
		};
		let url = 'portal/index.php?r=product/GetGuestRoomType';
		return this.get(url, query);
	}

	public AddRoomType(query) {
		query.account_id = this.general.account_id;
		let url = 'portal/index.php?r=product/AddGuestRoomType';
		return this.post(url, query);
	}

	public getRoomType() {
		let query = {
			account_id: this.general.account_id
		}
		let url = 'portal/index.php?r=product/GetGuestRoomType';
		return this.get(url, query);
	}

	/************************************************************************************/
	/***************************************婚礼部分**************************************/
	/************************************************************************************/
	// 获取场布套餐
	public getSetList(token) {
		let query = {
			uid: token,
		}
		let url = 'portal/index.php?r=background/GetFavoriteSets';
		return this.get(url, query);
	}
	//获取婚礼亮点
	public getBrightPoint(token, type) {
		let query = {
			token: token,
			type: type
		}
		let url = 'portal/index.php?r=content/Get_bright_point_one_page';
		return this.get(url, query);
	}

	//获取共享库房数据
	public GetProductList(areaId, subAreaId,page=1,orderId='',keyword='',servicePersonList='',lowPrice='',highPrice='') {
		let query = {
			token:this.general.token,
			area_id: areaId,
			subarea_id: subAreaId,
			order_id:orderId,
			keyword:keyword,
			service_person_list:servicePersonList,
			low_price:lowPrice,
			high_price:highPrice,
			page:page
		}
		let url = '/portal/index.php?r=background/Share_store';
		return this.get(url, query);
	}
	//添加共享库房数据
	public AddProduct(subAreaId,poster, name, price, cost, unit,amount, description,remark) {
		let form = {
			token:this.general.token,
			subarea_id: subAreaId,
			img_list: poster,
			name: name,
			price: price,
			cost: cost,
			unit: unit,
			amount: amount,
			description: description,
			remark: remark
		}
		let url = '/portal/index.php?r=background/Local_upload_product';
		return this.post(url, form);
	}
	//编辑共享库房数据
	public EditProduct(id,poster, name, price, unit,cost, amount,inventory, description) {
		let form = {
			service_product_id: id,
			img_url: poster,
			name: name,
			price: price,
			unit: unit,
			cost: cost,
			inventory: inventory,
			description: description
		}
		let url = '/portal/index.php?r=background/edit_service_product';
		return this.post(url, form);
	}
	//删除共享库房数据
	public DelProduct(id) {
		let form = {
			service_product_id: id
		}
		let url = '/portal/index.php?r=background/Service_product_del';
		return this.post(url, form);
	}
	//共享库房数据加入订单
	public ProductAdd2Order(orderId,productList){
		let form = {
			token: this.general.token,
			order_id: orderId,
			product_list: productList
		}
		let url = '/portal/index.php?r=background/Share_store_batch_product_insert';
		return this.post(url, form);
	}

	//获取婚纱数据
	public GetHunshaList(page=1,orderId='',keyword='',servicePersonList='',lowPrice='',highPrice=''){
		return this.GetProductList(9,59,page,orderId,keyword,servicePersonList,lowPrice,highPrice);
	}
	//添加婚纱
	public AddHunsha(poster, name, price, cost, unit,amount,remark, description) {
		return this.AddProduct(59,poster,name,price,cost,unit,amount,description,remark);
	}

	//获取婚品数据
	public GetHunpinList(page=1,orderId='',keyword='',servicePersonList='',lowPrice='',highPrice=''){
		return this.GetProductList(9,62,page,orderId,keyword,servicePersonList,lowPrice,highPrice);
	}
	//添加婚品
	public AddHunpin(poster, name, price, cost, unit,amount,remark, description) {
		return this.AddProduct(62,poster,name,price,cost,unit,amount,description,remark);
	}

	//获取布置信息
	public GetBuzhi(){
		let query = {
			token:this.general.token
		}
		let url = '/portal/index.php?r=Sale/GetBuzhi';
		return this.get(url, query);
	}
	//获取布置数据
	public GetBuzhiList(subAreaId,page=1,orderId='',keyword='',servicePersonList='',lowPrice='',highPrice=''){
		return this.GetProductList(9,subAreaId,page,orderId,keyword,servicePersonList,lowPrice,highPrice);
	}
	//添加布置
	public AddBuzhi(subAreaId,poster, name, price, cost, unit,amount,remark, description) {
		return this.AddProduct(subAreaId,poster,name,price,cost,unit,amount,description,remark);
	}

	//获取婚礼人员
	public getServicePerson(token, type) {
		let query = {
			token: token,
			service_type: type
		}
		let url = 'portal/index.php?r=content/Get_service_person';
		return this.get(url, query);
	}
	//新增婚礼人员
	public insertSp(token, account_id, name, avatar, telephone, supplier_type) {
		let query = {
			token: token,
			account_id: account_id,
			supplier_type: supplier_type,
			telephone: telephone,
			avatar: avatar,
			name: name
		}
		let url = 'portal/index.php?r=content/Insert_sp';
		return this.post(url, query);
	}

	public getOrderDoingAndDone() {
		let query = {
			token: this.general.token
		};
		let url = 'portal/index.php?r=content/Get_order_doing_and_done';
		return this.get(url, query);
	}
	public getOrderDoing() {
		let query = {
			token: this.general.token
		};
		let url = 'portal/index.php?r=content/Get_order_doing';
		return this.get(url, query);
	}
	//上传图片
	public UploadBase64Img(base64Img) {
		let form = {
			base64Img: base64Img
		}
		let url = 'portal/index.php?r=product/UploadBase64ImgToOss';
		return this.post(url, form);
	}
}
