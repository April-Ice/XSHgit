import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, ToastController, LoadingController } from 'ionic-angular';

import * as echarts from 'echarts';
import * as $ from 'jquery';
import { ChartService } from '../../providers/chart';

//import { FileChooser } from '@ionic-native/file-chooser';


@Component({
	selector: 'page-finance',
	templateUrl: 'finance.html',
	providers: [ChartService]
})

export class financeChartPage {
	public pricelists = [];
	public goalslists = [];
	public paymentEditlists = [];
	public agginAllData = {
		payment_money: 0
	};

	//执行成本
	public proCurrentId;
	public proAllData = {};
	public proCostlist = [];
	public proCommon = [];

	public pop_cost_name = '';
	public pop_cost_money = '';
	public pop_cost_remark = '';
	public pop_cost_id = '';
	public pop_cost_idx;



	public companyAchievementDistributionList = [];//默认业绩分配
	public renderList = [];

	public curOrder = null;

	public modalVisible = false;   // 业绩分配Modal
	public setboxVisible = false;  // 设置业绩分配Modal
	public costVisible = false;    // 执行成本Modal
	public setCostVisible = false; // 设置新增执行成本Modal
	public editCostVisible = false; // 设置编辑执行成本Modal
	public isShowPrice = false; // 显示价格
	public ifAddGoals = false;     // 是否进入新增分配模式
	public ifAddPayment = false;   // 是否进入新增付款模式
	public setRebateVisible = false; //是否开启返点弹窗

	//返点
	public channel_id = 0;
	public channel_cost = 0;
	public channel_name = '';
	public channel_rate = 0;
	public channelModalVisibel = false;
	public channelList = [];
	public add_channel_name = '';

	public addItem = {
		name: 'null',
		percent: 0,
		account: 0,
		staff: 0,
		order_id: 0
	};
	public addItemname;
	public addItempercent;
	public addItemaccount;
	public addItemstaff;
	public addItempercentPrice;



	public isAddCompanyAchievementDistribution = false;

	public totalA = {
		profit: 0,
		receive: 0,
		money: 0,
	};

	public allStaff = [];
	public allPercent = [];
	public selectStaff = [];

	public curGoalsId; //当前业绩分配弹窗id

	public allRenderAmont;     //网络返点订单总价
	public rendersPercent = [];

	//添加默认业绩分配
	public addDefaultName;
	public addDefaultPercent;

	public pageNub = 1;
	public loadMore;
	public monthList = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
	public yearList = ['2016年', '2017年', '2018年', '2019年', '2020年', '2021年', '2022年', '2023年', '2024年'];
	public month = '';
	public year = '';
	public searchText = '';
	public monthNum;
	public yearNum;

	public paymentType = 0;
	public paymentTotal;
	public setPaymentVisible = false;
	public paymentLists = {
		payment_time: '',
		payment_amount: '',
		payment_way: '',
		remarks: ''
	};
	public paymentId;


	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public toastCtrl: ToastController,
		public service: ChartService,
		public alertCtrl: AlertController,
		public loadingCtrl: LoadingController
	) {
		this.getPricelists();
		// this.addItempercentPrice = this.addItempercent * 0.01 *this.agginAllData.payment_money;
		// this.addItempercentPrice = this.addItempercentPrice.toFixed(2) || 0;
	}
	//下拉刷型界面
	// doRefresh(refresher){
	//
	// 	console.log("下拉刷新");
	// 	//动态切换
	// 	//当用户数量为3
	// 	if(this.users.length ==3){
	// 		this.users = this.user2;
	// 	}else{
	// 		this.users = this.default_data;
	// 	}
	// 	setTimeout(() => {
	// 		console.log('加载完成后，关闭刷新');
	// 		refresher.complete();
	//
	// 		//toast提示
	// 		this.showInfo("加载成功");
	// 	}, 2000);
	// }

	//条数
	cnt: number = 0;
	// this.month = '一月'

	stopP($event) {
		$event.stopPropagation();
	}

	//加载动画
	presentLoading() {
		let loader = this.loadingCtrl.create({
			content: "加载中...",
		});
		loader.present();

		setTimeout(() => {
			loader.dismiss();
		}, 5000);
	}

	//修改价格
	changePrice() {
		this.addItempercentPrice = this.addItempercent * 0.01 * this.agginAllData.payment_money;
		this.addItempercentPrice = this.addItempercentPrice.toFixed(2) || 0;
		console.log(this.addItempercentPrice);
	}

	//切换月份
	switchMonth() {
		this.pageNub = 1
		this.monthList.indexOf(this.month);
		this.monthNum = this.monthList.indexOf(this.month) + 1;

		this.service.seachPricelist(this.pageNub, 15, this.yearNum, this.monthNum).then(data => {
			console.log(data);
			if (data.orders.length == 0) {
				this.showInfo("无对应订单");
			} else {
				this.pricelists = data.orders;
				for (var i = 0; i < this.pricelists.length; i++) {
					this.pricelists[i].showPri = false;
				}
			}
		})
	}

	//切换年份
	switchYear() {
		// this.yearList.indexOf(this.year);
		this.pageNub = 1
		this.yearNum = this.year.split('年');
		this.yearNum = this.yearNum[0];
		console.log(this.yearNum)

		this.service.seachPricelist(this.pageNub, 15, this.yearNum, this.monthNum).then(data => {
			console.log(data);
			if (data.orders.length == 0) {
				this.showInfo("无对应订单");
			} else {
				this.pricelists = data.orders;
			}
		})
	}

	//搜素订单
	searchOrders() {
		console.log(this.searchText);
		this.service.searchOrder(this.searchText).then(data => {
			console.log(data);
			if (data.status == 1) {

				if (data.orders.length == 0) {
					this.showInfo("无对应订单");
				} else {
					this.pricelists = data.orders;
				}

			}
		})
	}

	//下滑动加载数据
	doInfinite() {
		let loader = this.loadingCtrl.create({
			content: "加载中...",
		});
		loader.present();
		this.pageNub += 1;
		console.log(this.pageNub);

		if (this.yearNum || this.monthNum) {
			setTimeout(() => {
				console.log('加载完成后，关闭刷新');

				// var data1 = {order_name:'yellowcong'+this.cnt,order_date:'1994', executory_costs:'1', channel_rate:'10',early_payment:"10"};
				this.service.seachPricelist(this.pageNub, 15, this.yearNum, this.monthNum).then(data => {
					loader.dismiss();
					if (data.status == 1) {
						// this.totalA.profit = data.yearTotalGrossProfit;
						// this.totalA.receive = data.yearTotalActualReceivedMoney;
						// this.totalA.money = data.yearTotalOrderMoney;


						//toast提示

						//增加index
						this.cnt = data.orders.length;

						console.log(data.orders);
						if (data.orders.length > 0 && data.orders.length < 15) {
							this.pricelists = this.pricelists.concat(data.orders);
							// this.showInfo("加载成功");
						} else {
							// this.showInfo("加载成功");
							this.pricelists = this.pricelists.concat(data.orders);
						}
						// infiniteScroll.complete();

						if (this.cnt < 15) {
							//如果都加载完成的情况，就直接 disable ，移除下拉加载
							// infiniteScroll.enable(false);
							console.log('@@@!!!')
							//toast提示
							this.showInfo("已加载所有");
							$('.getMore').css('display', 'none');
						} else {
							console.log('@')
						}

						// this.loadMore = data.orders.length == 10;

					}
				})




			}, 1000);
		} else {
			setTimeout(() => {
				console.log('加载完成后，关闭刷新');

				// var data1 = {order_name:'yellowcong'+this.cnt,order_date:'1994', executory_costs:'1', channel_rate:'10',early_payment:"10"};
				this.service.getPricelist(this.pageNub, 15).then(data => {
					loader.dismiss();
					if (data.status == 1) {
						// this.totalA.profit = data.yearTotalGrossProfit;
						// this.totalA.receive = data.yearTotalActualReceivedMoney;
						// this.totalA.money = data.yearTotalOrderMoney;

						//toast提示

						//增加index
						this.cnt = data.orders.length;

						console.log(data.orders);
						if (data.orders.length > 0 && data.orders.length < 15) {
							this.pricelists = this.pricelists.concat(data.orders);
							// this.showInfo("加载成功");
						} else {
							// this.showInfo("加载成功");
							this.pricelists = this.pricelists.concat(data.orders);
						}
						// infiniteScroll.complete();

						if (this.cnt < 15) {
							//如果都加载完成的情况，就直接 disable ，移除下拉加载
							// infiniteScroll.enable(false);
							console.log('@@@!!!')
							//toast提示
							this.showInfo("已加载所有");
							$('.getMore').css('display', 'none');
						} else {
							console.log('@')
						}
						// this.loadMore = data.orders.length == 10;
					}
				})
			}, 1000);
		}


	}

	//显示toast消息
	showInfo(msg) {
		let toast = this.toastCtrl.create({
			message: msg, //提示消息
			duration: 1000,//3秒后自动消失
			position: 'middle',//位置top,bottom
			showCloseButton: false, //是否显示关闭按钮
			closeButtonText: "关闭" //关闭按钮字段
		});

		//关闭后执行的操作
		toast.onDidDismiss(() => { console.log('toast被关闭之后执行'); });

		//显示toast
		toast.present();//符合触发条件后立即执行显示。
	}

	getPricelists() {
		this.service.getPricelist(this.pageNub, 15).then(data => {
			if (data.status == 1) {
				this.totalA.profit = data.yearTotalGrossProfit;
				this.totalA.receive = data.yearTotalActualReceivedMoney;
				this.totalA.money = data.yearTotalOrderMoney;
				this.pricelists = data.orders;

				console.log(this.pricelists[0])
			}
		});

	}

	//鼠标移入 显示全部
	showPrice(i) {
		// $(".priceCell").css("background-color","yellow");
		this.pricelists[i].showPri = true;
	}

	hidePrice(i) {
		this.pricelists[i].showPri = false;
		// $(".priceCell").css("background-color","pink");
	}


	/* 业绩分配 */
	//编辑默认业绩分配
	editGoals() {
		this.service.getCompanyAchievementDistribution().then(data => {
			if (data.status == 1) {
				//console.log(data);
				this.companyAchievementDistributionList = data.acountProjectParticipant;
				this.setboxVisible = true;
			}
		})
	}
	//隐藏默认业绩分配
	hidesetModal() {
		this.setboxVisible = false;
	}
	//添加默认业绩分配
	addCompanyAchievementDistribution() {
		this.isAddCompanyAchievementDistribution = true;
	}
	//取消添加默认业绩分配
	cancelAddCompanyAchievementDistribution() {
		this.addDefaultName = "";
		this.addDefaultPercent = "";
		this.isAddCompanyAchievementDistribution = false;
	}
	//添加默认业绩分配确认
	addCompanyAchievementDistributionConfirm() {
		let query = {
			name: this.addDefaultName,
			commission: this.addDefaultPercent,
		};
		this.service.addCompanyAchievementDistribution(query).then(data => {
			if (data.status) {
				console.log(data);
				this.companyAchievementDistributionList.push({
					id: data.msg,
					name: this.addDefaultName,
					commission: this.addDefaultPercent,
				});
				console.log(this.companyAchievementDistributionList);
				this.cancelAddCompanyAchievementDistribution();
			}
		});
	}
	//编辑默认业绩分配
	editCompanyAchievementDistribution(item) {
		let query = {
			id: item.id,
			name: item.name,
			commission: item.commission
		}
		this.service.editCompanyAchievementDistribution(query).then(data => {
			if (data.status == 1) {
				console.log("修改成功");
			}
		});
	}
	//删除默认业绩分配
	delCompanyAchievementDistribution(item, index) {
		let alert = this.alertCtrl.create({
			title: '确认删除？',
			buttons: [
				{
					text: '确定',
					handler: () => {
						this.service.delCompanyAchievementDistribution({ id: item.id }).then(data => {
							if (data) {
								this.companyAchievementDistributionList.splice(index, 1);
							}
						});
					}
				},
				{
					text: '取消',
					role: 'cancel',
				}
			]
		});
		alert.present();
	}
	//获取业绩分配
	getGoalsList(id) {
		this.service.getGoallist(id).then(data => {
			if (data.status == 1) {
				this.agginAllData = data;
				this.goalslists = data.project_participant;
				this.goalslists.map((item, index) => {
					this.allPercent[index] = item.commission;
					this.selectStaff[index] = item.staff_id;
				});
				this.allStaff = data.staffs;
			}
		});

	}
	// 设置业绩分配百分比
	submitPercent(item) {
		let query = {
			id: item.id,
			name: item.participant_name,
			staff_id: item.staff_id,
			commission: item.commission
		}
		this.service.editDistribution(query).then(data => {
			if (data.status == 1) {
				item.money = this.agginAllData.payment_money * item.commission / 100;
				item.money = item.money.toFixed(2)
			}
		});
	}
	//设置业绩分配人员
	submitStaff(item) {
		let query = {
			id: item.id,
			name: item.participant_name,
			staff_id: item.staff_id,
			commission: item.commission
		}
		this.service.editDistribution(query).then(data => {
			if (data.status == 1) {
				console.log("提交员工成功");
			}
		});
	}
	//删除业绩分配
	delGoalItem(item, index) {
		let alert = this.alertCtrl.create({
			title: '确认删除？',
			buttons: [
				{
					text: '确定',
					handler: () => {
						this.service.delDistribution({ id: item.id }).then(data => {
							if (data) {
								this.goalslists.splice(index, 1);
							}
						});
					}
				},
				{
					text: '取消',
					role: 'cancel',
				}
			]
		});
		alert.present();
	}
	//添加业绩分配-开
	addGoalItem() {
		this.ifAddGoals = true;
	}
	//添加业绩分配-关
	hideAddGoals() {
		this.ifAddGoals = false;
		this.addItemname = null;
		this.addItempercent = null;
		this.addItemaccount = null;
		this.addItemstaff = null;
	}
	//添加业绩分配-提交
	submitaddGoals() {
		let query = {
			name: this.addItemname,
			commission: this.addItempercent,
			staff_id: this.addItemstaff,
			order_id: this.curGoalsId,
		};
		this.service.addDistribution(query).then(data => {
			if (data.status) {
				console.log(data);
				this.goalslists.push({
					id: data.msg,
					participant_name: this.addItemname,
					commission: this.addItempercent,
					money: this.agginAllData.payment_money * this.addItempercent / 100,
					staff_id: this.addItemstaff
				});
				this.hideAddGoals();
			}
		});
	}
	//开启业绩分配弹窗
	showAssign(id, data) {

		this.modalVisible = true;
		this.curGoalsId = id;


		this.getGoalsList(id);
	}
	//关闭业绩分配弹窗
	hideModal() {
		this.modalVisible = false;
	}
	//以及分配表单提交
	formSubmit(form) {
		let list = this.goalslists;

		let a = [];
		let b = [];

		let total = 0;
		for (var Key in form) {
			// console.log(Key,form[Key]);
			if (Key.indexOf('commission') !== -1) {
				// console.log(Key);
				a.push(form[Key]);
				total = total + parseFloat(form[Key]);

			} else {
				b.push(form[Key]);
			}
		}
		let all = []
		for (var i = 0; i < a.length; i++) {
			// all[i].commission = a[i];
			all.push({ commission: a[i], num: '', name: '', id: '' })
		}
		for (var c = 0; c < list.length; c++) {
			all[c].name = list[c].participant_name;
			all[c].id = list[c].id;
		}
		for (var j = 0; j < b.length; j++) {
			all[j].num = b[j];
		}
		console.log(all)

		if (total != 100) {
			let toast = this.toastCtrl.create({
				message: '分配总和不等于100,请重新分配',
				showCloseButton: true,
				position: 'middle',
				duration: 1000,
			});
			toast.present();
		} else {
			for (var i = 0; i < all.length; i++) {
				let query = {
					name: all[i].name,
					commission: all[i].commission,
					staff_id: all[i].num,
					id: all[i].id,
				};
				this.service.editDistribution(query).then(data => {

					if (data.status == 1) {
						this.modalVisible = false;
						let toast = this.toastCtrl.create({
							message: '提交员工分配成功',
							showCloseButton: true,
							position: 'middle',
							duration: 1000,
						});
						toast.present();
					} else {
						let toast = this.toastCtrl.create({
							message: '提交员工分配失败,请重试',
							showCloseButton: true,
							position: 'middle',
							duration: 1000,
						});
						toast.present();
					}
				});
			}






		}

	}

	/* 酒店/网络返点 */
	//开启返点弹窗
	showRebateModal(item) {
		this.setRebateVisible = true;
		this.curOrder = item;
		this.channel_id = item.channel_id;
		this.channel_cost = item.channel_cost;
		this.channel_name = item.channel_name;
		this.channel_rate = item.channel_rate;
	}
	//关闭返点弹窗
	hideRebateModal() {
		this.setRebateVisible = false;
	}
	//返点修改确认
	rebateConfirm() {
		if (this.channel_id == 0) {
			this.alertCtrl.create({
				title: '请选择返点渠道！',
				buttons: ['OK']
			}).present();
		} else {
			this.channel_cost = this.channel_rate * 0.01 * this.curOrder.actual_payment;
			this.service.editOrderChannelRebate(this.curOrder.id, this.channel_id, this.channel_cost).then(data => {
				if (data.status == 1) {
					this.totalA.profit += this.curOrder.channel_cost;
					this.totalA.profit -= this.channel_cost;
					this.curOrder.channel_id = this.channel_id;
					this.curOrder.channel_cost = this.channel_cost;
					this.curOrder.channel_name = this.channel_name;
					this.curOrder.channel_rate = this.channel_rate;
					if (this.curOrder.actual_payment != 0) {
						this.curOrder.gross_profit_rate = (this.curOrder.actual_payment - this.curOrder.executory_costs - this.curOrder.channel_cost) / this.curOrder.actual_payment * 100;
					}
					this.setRebateVisible = false;
				} else {
					this.alertCtrl.create({
						title: '程序处理失败，请稍后重试！',
						buttons: ['OK']
					}).present();
				}
			})
		}
	}


	//获取已有付款
	getPaymentList() {
		console.log('获取已有付款');
		this.service.getPaymentlist(this.paymentId).then(data => {
			if (data) {
				this.paymentTotal = data.paid_money;
				if (this.paymentType == 0) {
					this.paymentEditlists = data.payment_data.deposit;
				} else if (this.paymentType == 1) {
					this.paymentEditlists = data.payment_data.medium;
				} else if (this.paymentType == 2) {
					this.paymentEditlists = data.payment_data.final;
				}
			}
		});

	}

	// 显示定金-中期款-尾款弹窗
	showPaymentModal(number, totalValue, id) {
		this.paymentType = number;
		this.paymentTotal = totalValue;
		this.setPaymentVisible = true;
		this.paymentId = id;
		this.getPaymentList();
	}
	//关闭定金-中期款-尾款弹窗
	hidePaymentModal() {
		this.setPaymentVisible = false;
	}
	// 定金-中期款-尾款新增一条
	addPaymentItem() {
		this.ifAddPayment = true;
	}

	//添加定金-中期款-尾款
	paymentConfirm() {
		let query = {
			payment_time: this.paymentLists.payment_time,
			payment: this.paymentLists.payment_amount,
			payment_way: this.paymentLists.payment_way,
			remarks: this.paymentLists.remarks,
			order_id: this.paymentId,
			payment_type: this.paymentType
		};
		this.service.paymentAdd(query).then(data => {
			if (data) {
				console.log('-----添加成功---------',data);
				this.getPaymentList();
				// this.paymentEditlists.push({
				// 	id: data.msg,
				// 	payment_time: this.paymentLists.payment_time,
				// 	payment_amount: this.paymentLists.payment_amount,
				// 	payment_way: this.paymentLists.payment_way,
				// 	remarks: this.paymentLists.remarks,
				// });
				this.hidePaymentItem();
				// this.hidePaymentModal();
			}
		});
	}

	// 修改定金
	paymentEdit(item) {
		let query = {
			time: item.time,
			price: item.money,
			type: item.type,
			remarks: item.remarks,
			skId: item.id,
		};
		this.service.paymentEdit(query).then(data => {
			this.getPaymentList();
			if (data) {
				console.log(data);
				// this.getPaymentList();
			}
		});
	}

	//关闭操作选项
	hidePaymentItem() {
		this.ifAddPayment = false;
		this.paymentLists = {
			payment_time: '',
			payment_amount: '',
			payment_way: '',
			remarks: ''
		};
	}

	//删除
	delPaymentItem(item, index) {
		let alert = this.alertCtrl.create({
			title: '确认删除？',
			buttons: [
				{
					text: '确定',
					handler: () => {
						this.service.paymentDel({ payment_id: item.id }).then(data => {
							if (data) {
								// this.paymentEditlists.splice(index, 1);
								this.getPaymentList();
							}
						});
					}
				},
				{
					text: '取消',
					role: 'cancel',
				}
			]
		});
		alert.present();
	}





	//开启返点渠道弹窗
	showChannelModal() {
		console.log($('.finance-input').width());
		const width = $('.finance-input').width()

		if (!this.channelModalVisibel) {
			this.channelModalVisibel = true;

			this.add_channel_name = '';
			this.service.getChannelList().then(data => {
				if (data.status == 1) {
					this.channelList = data.customer_channels;
				} else {
					this.alertCtrl.create({
						title: '获取返点渠道失败，请稍后重试！',
						buttons: ['OK']
					}).present();
				}
			});
		} else {
			this.channelModalVisibel = false;
		}
	}
	//选择返点渠道
	seleteChannel(item) {
		this.channel_id = item.id;
		this.channel_name = item.name;
		this.channelModalVisibel = false;
	}
	//新增返点渠道
	addChannel() {
		this.add_channel_name = $.trim(this.add_channel_name);
		if (this.add_channel_name == '') {
			this.alertCtrl.create({
				title: '渠道名称不能为空！',
				buttons: ['OK']
			}).present();
		} else {
			this.service.addChannel(this.add_channel_name).then(data => {
				if (data.status == 1) {
					this.channelList.push({
						id: data.msg,
						name: this.add_channel_name
					});
					this.add_channel_name = '';
				} else {
					this.alertCtrl.create({
						title: '程序处理失败，请稍后重试！',
						buttons: ['OK']
					}).present();
				}
			})
		}
	}
	// 删除返点渠道
	delChannel(id, index) {
		this.service.delChannel(id).then(data => {
			if (data.status == 1) {
				this.channelList.splice(index, 1);
			} else {
				this.alertCtrl.create({
					title: '程序处理失败，请稍后重试！',
					buttons: ['OK']
				}).present();
			}
		})
	}

	/* 执行成本 */
	// 获取执行成本
	getProCostList(id) {
		this.service.getProCost(id).then(data => {
			if (data.status == 1) {
				this.proAllData = data;
				this.proCostlist = data.order_supplier_payment;
				this.proCommon = data.order;
			}
		});
	}
	//开启执行成本弹窗
	showCostMoal(id) {
		this.costVisible = true;
		this.proCurrentId = id;
		this.getProCostList(id);
	}
	//关闭执行成本弹窗
	hideCostMoal() {
		this.costVisible = false;
	}
	//开启执行成本添加弹窗
	showsetCostMoal(id) {
		this.setCostVisible = true;
	}
	//关闭执行成本添加弹窗
	hidesetcostModal() {
		this.setCostVisible = false;
		this.editCostVisible = false;
	}
	//新增执行成本
	formCostSubmit(form, id) {
		console.log(form);
		form.order_id = this.proCurrentId;
		form.pay_time = new Date();
		this.service.formCost(form).then(data => {
			console.log(data);
			if (data.status == 1) {
				this.hidesetcostModal();
				this.getProCostList(this.proCurrentId);
			}
		})
			.catch(data => {
				console.log(data)
			});
	}


	//开启编辑成本弹窗
	OpenEditCostModal(item, i) {
		this.editCostVisible = true;
		this.pop_cost_idx = i;
		this.pop_cost_id = item.id;
		this.pop_cost_name = item.supplier_name;
		this.pop_cost_money = item.money;
		this.pop_cost_remark = item.remark;
	}

	//编辑执行成本
	formCostEdit(form, i) {
		form.order_id = this.proCurrentId;
		form.pay_time = new Date();
		this.service.EditOrderSupplierPayment(this.pop_cost_id, this.pop_cost_name, '', this.pop_cost_money, this.pop_cost_remark).then(data => {
			if (data.status == 1) {
				this.hidesetcostModal();
				//更新当前条目数据
				this.proCostlist[this.pop_cost_idx].supplier_name = this.pop_cost_name;
				this.proCostlist[this.pop_cost_idx].money = this.pop_cost_money;
				this.proCostlist[this.pop_cost_idx].remark = this.pop_cost_remark;
			}
		});
	}

	//删除执行成本
	formCostDel() {
		this.service.DelOrderSupplierPayment(this.pop_cost_id).then(data => {
			if (data.status == 1) {
				this.hidesetcostModal();
				//删除当前条目数据
				this.proCostlist.splice(this.pop_cost_idx, 1);
			}

		});
	}

}
