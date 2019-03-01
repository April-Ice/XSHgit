import { query } from '@angular/core/src/animation/dsl';
import { Injectable, Injector } from '@angular/core';

import { BaseService } from './base';

import * as $ from 'jquery';


@Injectable()
export class ChartService extends BaseService {

	constructor(injector: Injector) {
		super(injector);
	}

	// 察看销售数据报表
	public getSaleData(query) {
		let url = 'portal/index.php?r=content/FormatData';
		return this.get(url, query);
	}

	// 查看当年财务报表
	public getPricelist(pageIndex = 1, pageSize = 15) {
		let query = {
			token: this.general.token,
			pageIndex: pageIndex,
			pageSize: pageSize
		}
		let url = 'portal/index.php?r=background/GetThisYearFinance';
		return this.get(url, query);
	}

	// 查看当年财务报表
	public seachPricelist(pageIndex = 1, pageSize = 15, year, month) {
		let query = {
			token: this.general.token,
			pageIndex: pageIndex,
			pageSize: pageSize,
			year: year,
			month: month
		}
		let url = 'portal/index.php?r=background/GetThisYearFinance';
		return this.get(url, query);
	}

	public searchOrder(key) {
		let query = {
			token: this.general.token,
			key_words: key
		}
		let url = 'portal/index.php?r=background/Search_year_finance';
		return this.get(url, query);
	}

	// 查看执行成本
	public getProCost(id) {
		let query = {
			order_id: id
		}
		let url = 'portal/index.php?r=background/GetOrderCost';
		return this.get(url, query);
	}

	/**
	 * 新增执行成本
	 * @param form
	 * @returns {JQuery.jqXHR}
	 */
	public formCost(form) {
		let url = 'portal/index.php?r=background/AddOrderSupplierPayment';
		return this.post(url, form);
	}

	/**
	 * 编辑执行成本
	 * @param id
	 * @param supplierName
	 * @param payTime
	 * @param money
	 * @param remark
	 * @returns {JQuery.jqXHR}
	 * @constructor
	 */
	public EditOrderSupplierPayment(id, supplierName, payTime, money, remark) {
		let url = 'portal/index.php?r=background/EditOrderSupplierPayment';
		let form = {
			id: id,
			supplier_name: supplierName,
			pay_time: payTime,
			money: money,
			remark: remark
		};
		return this.post(url, form);
	}

	/**
	 * 删除执行成本
	 * @param id
	 * @returns {JQuery.jqXHR}
	 * @constructor
	 */
	public DelOrderSupplierPayment(id) {
		let url = 'portal/index.php?r=background/DelOrderSupplierPayment';
		let form = {
			id: id
		};
		return this.post(url, form);
	}

	//获取公司业绩分配
	public getCompanyAchievementDistribution() {
		let query = {
			account_id: this.general.account_id
		}
		let url = 'portal/index.php?r=background/GetCompanyAchievementDistributionList';
		return this.get(url, query);
	}
	//添加公司业绩分配
	public addCompanyAchievementDistribution(query) {
		query.account_id = this.general.account_id;
		let url = 'portal/index.php?r=background/AddCompanyAchievementDistributionList';
		return this.post(url, query);
	}
	//修改公司业绩分配
	public editCompanyAchievementDistribution(query) {
		let url = 'portal/index.php?r=background/EditCompanyAchievementDistributionList';
		return this.post(url, query);
	}
	//删除公司业绩分配
	public delCompanyAchievementDistribution(query) {
		let url = 'portal/index.php?r=background/DelCompanyAchievementDistributionList';
		return this.post(url, query);
	}

	//获取业绩分配
	public getGoallist(id) {
		let query = {
			account_id: this.general.account_id,
			order_id: id
		}
		let url = 'portal/index.php?r=background/GetAchievementDistributionList';
		return this.get(url, query);
	}

	//获取已有付款
	public getPaymentlist(id) {
		let query = {
			account_id: this.general.account_id,
			order_id: id
		}
		let url = 'portal/index.php?r=content/studio_order_shoukuan';
		return this.get(url, query);
	}



	//修改业绩分配
	public editDistribution(query) {
		let url = 'portal/index.php?r=background/EditAchievementDistribution';
		return this.post(url, query);
	}

	//添加业绩分配
	public addDistribution(query) {
		let url = 'portal/index.php?r=background/AddAchievementDistribution';
		return this.post(url, query);
	}

	//删除业绩分配
	public delDistribution(query) {
		let url = 'portal/index.php?r=background/DelAchievementDistribution';
		return this.post(url, query);
	}

	//获取渠道
	public getChannelList() {
		let query = {
			account_id: this.general.account_id
		}
		let url = 'portal/index.php?r=background/GetCustomerChannels';
		return this.get(url, query);
	}
	//添加渠道
	public addChannel(channel_name) {
		let query = {
			account_id: this.general.account_id,
			channel_name: channel_name
		}
		let url = 'portal/index.php?r=background/AddCustomerChannel';
		return this.post(url, query);
	}
	//删除渠道
	public delChannel(channel_id) {
		let query = {
			channel_id: channel_id
		};
		let url = 'portal/index.php?r=background/DeleteCustomerChannel';
		return this.post(url, query);
	}
	//修改订单渠道返点
	public editOrderChannelRebate(order_id, channel_id, channel_cost) {
		let query = {
			account_id: this.general.account_id,
			order_id: order_id,
			channel_id: channel_id,
			channel_cost: channel_cost
		}
		let url = 'portal/index.php?r=background/EditOrderChannelRebate';
		return this.post(url, query);
	}

	//获取销售目标
	public getSaleGoals(year) {
		let query = {
			account_id: this.general.account_id,
			year: year
		}
		let url = 'portal/index.php?r=background/GetSaleGoals';
		return this.get(url, query);
	}
	//获取阶梯比例
	public getStaffLevals() {
		let query = {
			token: this.general.token,
		}
		let url = 'portal/index.php?r=staff/GetStaffLevelList';
		return this.get(url, query);
	}

	public submitStaffLevals(list, ladderList) {
		let query = {
			token: this.general.token,
			commissionLadderList: list,
			commissionList: ladderList,
		}
		let url = 'portal/index.php?r=staff/EditStaffLevelCommissionInfo';
		return this.postObject(url, query);
	}

	public editStaffLevel(form) {
		form.token = this.general.token;
		let url = 'portal/index.php?r=staff/EditStaffLevel';
		return this.post(url, form);
	}

	//添加渠道
	public modifySaleGoals(form) {
		form.account_id = this.general.account_id;
		let url = 'portal/index.php?r=background/ModifySaleGoals';
		return this.post(url, form);
	}

	// 获取订购单数据
	public getOrderData(form) {
		form.account_id = this.general.account_id;
		let url = 'portal/index.php?r=sale/Search_order_data';
		return this.post(url, form);
	}


	// 获取订购单数据--staff下拉框数据
	public getOrderOptions() {
		let query = {
			token: this.general.token
		};
		let url = 'portal/index.php?r=sale/New_order_data';
		return this.get(url, query);
	}
	// 获取订购单数据--类型下拉框数据
	public getTyperOptions() {
		let query = {
			account_id: this.general.account_id
		};
		let url = 'portal/index.php?r=sale/Get_search_type';
		return this.get(url, query);
	}

	// 新增定金-中期款-尾款
	public paymentAdd(query) {
		query.token = this.general.token;
		let url = 'portal/index.php?r=resource/cashInsert';
		return this.post(url, query);
	}
	// 删除定金-中期款-尾款
	public paymentDel(query) {
		let url = 'portal/index.php?r=resource/delCashier';
		return this.post(url, query);
	}
	// 编辑定金-中期款-尾款
	public paymentEdit(query) {
		let url = 'portal/index.php?r=resource/sk_update';
		return this.post(url, query);
	}
}
