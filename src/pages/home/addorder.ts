import { Component, ViewChild } from '@angular/core';
import { AlertController, NavController, NavParams } from 'ionic-angular';
import { FoodPage } from '../products/food';
import { HomeService } from '../../providers/home';
import moment from '../../../node_modules/moment';
import * as $ from 'jquery';

@Component({
	selector: 'page-addorder',
	templateUrl: 'addorder.html',
	providers: [HomeService]
})
export class AddOrderPage {

	public token = localStorage.getItem('token');
	public account_id = localStorage.getItem('account_id');
	public id;
	public hotelList;
	public companyList;
	public contactList;
	public linkManList;
	public typelist = [
		{ id: 9, title: '婚宴' },
		{ id: 5, title: '出阁宴' },
		{ id: 6, title: '乔迁宴' },
		{ id: 3, title: '宝宝宴' },
		{ id: 7, title: '升学宴' },
		{ id: 8, title: '开业宴' },
		{ id: 4, title: '寿宴' },
		{ id: 1, title: '会议' },
		{ id: 10, title: '其他' },
	]

	public chooseType = 1;
	public selectHotel = 0;
	public selectCompany = 0;
	public selectLinkman = 0;
	public channelModalVisibel = false;
	public contact_name;
	public company_name;
	public setCompanyVisible = true;  //是否开启公司弹窗
	public setContactVisible = true; //是否开启联系人弹窗
	public setDropVisible = false; //是否开启透明遮盖层
	// public contactList = [{name:'1',telephone:'1111',linkman_id:'1'},{name:'2',telephone:'2232',linkman_id:'2'}];
	// public companyList = [{name:'北京浩瀚一方',id:'1111'},{name:'北京XXXX',id:'222'}];
	public add_contact_name;
	public add_contact_phone;
	public add_company_name;
	public a;
	public b;
	public c;

	public staffList = [];
	public hallList = [];
	public schedule_type = [];
	public datelists = [];
	public datelistsItemNum = 0;

	public orderdate;

	public orderId; //编辑订单id
	public toptitle = '新增订单';

	public salesman;
	public company_id;
	public linkman_id;
	public remark;
	public groom_name;
	public groom_phone;
	public bride_name;
	public bride_phone;
	public contact_phone;
	public mark;
	public thirdContactName;
	public thirdContactPhone;

	public AAA = new Date('2018-10-2')

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public service: HomeService,
		public alertCtrl: AlertController,
	) {
		console.log("constructor");
		this.getDetailInfo();
		let propsID = this.navParams.get('order_id');

		if (propsID) {
			console.log("接收订单参数--", propsID);
			this.toptitle = '编辑订单';
			this.orderId = propsID;
		}

	}

	//初始渲染
	public getDetailInfo() {
		this.service.getData(this.token).then(data => {
			console.log(data);
			if (data) {
				this.hotelList = data.hotel;
				this.companyList = data.company;
				this.staffList = data.staff;
				this.hallList = data.hall;
				this.schedule_type = data.schedule_type;
				// this.companyList = [{name:'北京浩瀚一方',company_id:'1111'},{name:'北京XXXX',company_id:'222'}];

				let editList = this.navParams.get('list');
				let baseInfo = editList.basic;
				if (editList) {
					this.chooseType = baseInfo.order_type ? baseInfo.order_type : null;
					this.salesman = baseInfo.designer_id ? baseInfo.designer_id : null;
					this.company_id = baseInfo.company_id ? baseInfo.company_id : null;
					this.company_name = baseInfo.company_name ? baseInfo.company_name : null;
					this.contact_name = baseInfo.linkman_name ? baseInfo.linkman_name : null;
					this.linkman_id = baseInfo.company_linkman_id ? baseInfo.company_linkman_id : null;
					this.remark = baseInfo.remark ? baseInfo.remark : null;
					this.mark = baseInfo.meeting_remark ? baseInfo.meeting_remark : null;
					this.groom_name = baseInfo.groom_name ? baseInfo.groom_name : null;
					this.groom_phone = baseInfo.groom_phone ? baseInfo.groom_phone : null;
					this.bride_name = baseInfo.bride_name ? baseInfo.bride_name : null;
					this.bride_phone = baseInfo.bride_phone ? baseInfo.bride_phone : null;
					this.thirdContactName = baseInfo.contact_name?baseInfo.contact_name:null;
					this.thirdContactPhone = baseInfo.contact_phone ? baseInfo.contact_phone : null;
					editList.schedule_list.map((item, index) => {
						editList.schedule_list[index].start_time = new Date(new Date(item.start_time).getTime() + 8 * 60 * 60 * 1000).toISOString();
						editList.schedule_list[index].end_time = new Date(new Date(item.end_time).getTime() + 8 * 60 * 60 * 1000).toISOString();
					});
					this.datelists = editList.schedule_list ? editList.schedule_list : [];
				}
			}
		});

	}

	public ionViewWillEnter() {
		console.log(this.datelists);
		this.c = $('.addOrder-row').css('height');
		this.a = $('.addOrder-input').css('width');
		this.b = $('.addOrder-label').css('width');
		this.b = this.b.split('p');

		this.b = Number(this.b[0]) + Number(31) + 'px';
		const itemWidth = this.a;
		const itemleft = this.b;
		console.log(this.a);
		if (this.a !== '0px') {
			localStorage.setItem('itemWidth', itemWidth);
			localStorage.setItem('itemleft', itemleft);
		}
		else {
			console.log('222')
		}


	}

	//展示公司弹窗
	showCompany() {
		console.log(this.companyList);

		if (this.setCompanyVisible == true) {
			this.setCompanyVisible = false;
			this.setDropVisible = true;
			const itemWidth = localStorage.getItem('itemWidth')
			const itemleft = localStorage.getItem('itemleft')

			$('.newItemBoxTwo').css('width', itemWidth)
			$('.newItemBoxTwo').css('left', itemleft);

			console.log('111', $('.newItemBoxTwo').css('min-width'), this.a)
		}
		else {
			this.setCompanyVisible = true;
			this.setDropVisible = false;
		}
	}

	//选择公司
	selectCompanyFun(item) {
		console.log(item)
		this.company_name = item.name;
		this.contactList = item.linkman
		this.selectCompany = item.id;
		this.setCompanyVisible = true;
		this.setDropVisible = false;
		this.id = item.id;

		this.contact_name = item.linkman[0].name;
		this.selectLinkman = item.linkman[0].id;
	}

	//新增公司
	addCompany() {
		this.add_company_name = $.trim(this.add_company_name);
		if (this.add_company_name == '') {
			this.alertCtrl.create({
				title: '公司名称不能为空！',
				buttons: ['OK']
			}).present();
		}
		else {
			let query = {
				account_id: this.account_id,
				name: this.add_company_name,
			}

			this.service.addCompany(query).then(data => {
				this.companyList.push({
					name: this.add_company_name,
					id: data.company_id
				});

				this.id = data.company_id;
				this.company_name = this.add_company_name;
				this.contactList = [];
				this.selectCompany = data.company_id;
				this.setCompanyVisible = true;
				this.setDropVisible = false;

				this.add_company_name = '';
				console.log(this.companyList);

			})
				.catch(err => function () {
					this.alertCtrl.create({
						title: '程序处理失败，请稍后重试！',
						buttons: ['OK']
					}).present();
				})
		}
	}

	//删除公司
	delCompany(id, i) {
		let query = { company_id: id };
		this.service.delCompanyOne(query).then(data => {
			this.companyList.splice(i, 1)
		})
			.catch(err => {
				this.alertCtrl.create({
					title: '程序处理失败，请稍后重试！',
					buttons: ['OK']
				}).present();
			})
	}

	//展示联系人弹窗
	showContact() {
		if (this.setContactVisible == true) {
			this.setContactVisible = false;
			this.setDropVisible = true;

			$('.newItemBox').css('width', this.a)
		}
		else {
			this.setContactVisible = true;
			this.setDropVisible = false;

		}
	}

	//删除联系人
	delContact(id, i) {
		let query = { linkman_id: id };
		this.service.delContactOne(query).then(data => {
			this.contactList.splice(i, 1)
		})
			.catch(err => {
				this.alertCtrl.create({
					title: '程序处理失败，请稍后重试！',
					buttons: ['OK']
				}).present();
			})
	}

	//遮挡层点击事件
	backdropclick(e) {
		//判断点击的是否为遮罩层，是的话隐藏遮罩层
		if (e.srcElement.className != 'itemClass') {
			//隐藏遮盖
			this.setDropVisible = false;
			if (this.setCompanyVisible == false) {
				this.setCompanyVisible = true;
			}
			if (this.setContactVisible == false) {
				this.setContactVisible = true;
			}
		}
		//隐藏滚动条
		this.hiddenscroll();
		e.stopPropagation();
	}

	hiddenscroll() {
		//获取当前组件的ID
		let aboutContent = document.querySelector("#aboutContent");
		//获取当前组件下的scroll-content元素
		let scroll: any = aboutContent.querySelector(".scroll-content");
		if (this.setDropVisible) {
			scroll.style.overflow = 'hidden';
		}
		else {
			scroll.style.overflow = '';
		}
	}

	//选择联系人
	selectContact(item) {
		this.contact_name = item.name;
		this.setContactVisible = true;
		this.setDropVisible = false;
		this.selectLinkman = item.id;
	}

	//新增联系人
	addContactFun() {
		this.add_contact_name = $.trim(this.add_contact_name);
		if (this.add_contact_name == '' && this.add_contact_phone == '') {
			this.alertCtrl.create({
				title: '姓名或电话不能为空！',
				buttons: ['OK']
			}).present();
		}
		else {
			let query = {
				account_id: this.account_id,
				company_id: this.id,
				name: this.add_contact_name,
				telephone: this.add_contact_phone
			}

			this.service.addContactOne(query).then(data => {
				this.contactList.push({
					telephone: this.add_contact_phone,
					name: this.add_contact_name,
					linkman_id: data.linkman_id,
					company_id: this.id,
				});

				this.contact_name = this.add_contact_name;
				this.setContactVisible = true;
				this.setDropVisible = false;
				this.selectLinkman = data.linkman_id;

				this.add_contact_name = '';
				this.add_contact_phone = '';

			})
				.catch(err => function () {
					this.alertCtrl.create({
						title: '程序处理失败，请稍后重试！',
						buttons: ['OK']
					}).present();
				})
		}
	}

	//改变公司联系人
	changeLinkMan() {
		var select = this.selectCompany;
		var link = [];
		this.companyList.forEach(function (e) {
			if (e.id == select) {
				link = e.linkman;
			}
		});
		this.contactList = link;
	}

	formSubmit(form) {
		let query;
		if (this.chooseType == 1) {
			query = {
				token: localStorage.getItem('token'),
				ordertype: this.chooseType,
				designer_id: this.salesman,
				company_id: this.selectCompany,
				linkman_id: this.selectLinkman,
				// start_date: form.start_date,
				// end_date: form.end_date,
				hotel_id: this.selectHotel,
				datelists: this.datelists,
				mark: this.mark
			}
		}
		else {
			query = {
				token: localStorage.getItem('token'),
				ordertype: this.chooseType,
				designer_id: this.salesman,
				// orderdate: this.datelists[0]?this.datelists[0].start_time : '',
				// orderdate: form.start_date,
				end_date: '',
				hotel_id: this.selectHotel,
				remark: form.remark,
				groomname: form.groomeName,
				bridename: form.brideName,
				groomtelephone: form.groomePhone,
				bridetelephone: form.bridePhone,
				linkmanname: form.linkManName,
				linkmantelephone: form.linkManPhone,
				datelists: this.datelists
			}
		}
		query.datelists.map((value) => {
			if (this.orderdate == null) {
				this.orderdate = value.start_time;
			} else {
				if (value.start_time < this.orderdate) {
					this.orderdate = value.start_time;
				}
			}
		});
		query.orderdate = this.orderdate;

		if (this.toptitle == '编辑订单') {
			query.order_id = this.orderId;
			this.service.editOrder(query).then(data => {
				if (data) {
					this.navCtrl.push(FoodPage, {
						order_id: data.order_id
					})
				}
			});
		} else {
			this.service.addOrder(query).then(data => {
				if (data) {
					this.navCtrl.push(FoodPage, {
						order_id: data.order_id
					})
				}
			});
		}

	}

	//开启联系人弹窗  和finance中一样
	showRebateModal(item) {
		this.setContactVisible = true;
		this.setDropVisible = false;
	}
	//关闭返点弹窗
	hideRebateModal() {
		this.setContactVisible = false;
	}

	//新增档期
	addTableItem() {
		this.datelistsItemNum++;
		let id = this.datelistsItemNum;
		this.datelists.push({
			type: '',
			hall_id: '',
			start_time: '',
			end_time: ''
		});
		console.log('datelists', this.datelists);
	}

	// 清空档期
	clearTableItem(id) {
		console.log('清空id', id)
		this.datelists[id].type = '';
		this.datelists[id].hall_id = '';
		this.datelists[id].start_time = '';
		this.datelists[id].end_time = '';
	}

	// 删除档期
	delTableItem(id) {
		this.datelists.splice(id, 1);
	}
}
