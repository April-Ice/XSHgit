import { query } from '@angular/core/src/animation/dsl';
import { Injectable, Injector } from '@angular/core';

import { BaseService } from './base';

import * as $ from 'jquery';


@Injectable()
export class HomeService extends BaseService {

	constructor(injector: Injector) {
		super(injector);
	}

	public getBgImgs() {
		let url = 'portal/index.php?r=background/GetXIshiIndexImgs';
		return this.get(url, {});
	}

	public getIndexInfo(){
		let query={
			userid: this.general.token
		}
		let url = 'portal/index.php?r=background/GetWhsIndexInfo';
		return this.get(url, query);
	}

	public getYearData(query) {
		query.token = this.general.token;
		let url = 'portal/index.php?r=dailyReport/GetYearOrderCalendar';
		return this.get(url, query);
	}

	public getmouthOrders(query) {
		query.account_id = this.general.account_id;
		let url = 'portal/index.php?r=dailyReport/GetCalendar';
		return this.post(url, query);
	}

	//订单部分
	//1、渲染接口
	public getData(token){
		let query={
			token:token
		};
		let url = 'portal/index.php?r=sale/New_order_data';
		return this.get(url, query);
	}

	public addOrder(query) {
		let url;
		if (query.ordertype==1){
			url = 'portal/index.php?r=sale/New_meeting_order_pro';  //会议
		}
		else{
			url = 'portal/index.php?r=sale/New_wedding_order_pro';
		}
		return this.post(url, query);
	}

	public editOrder(query) {
		let url= 'portal/index.php?r=sale/Edit_order_data';
		return this.post(url, query);
	}

	public addContactOne(query){

		let url = 'portal/index.php?r=sale/Add_meeting_linkman';
		return this.post(url,query);
	}

	public delContactOne(query){
		let url = 'portal/index.php?r=sale/Del_meeting_linkman';
		return this.post(url,query);
	}

	public addCompany(query){
		let url = 'portal/index.php?r=sale/Add_meeting_company';
		return this.post(url,query);
	}

	public delCompanyOne(query){
		let url = 'portal/index.php?r=sale/Del_meeting_company';
		return this.post(url,query);
	}

	public delOrderOne(query){
		let que={
			order_id:query
		};
		let url = 'portal/index.php?r=resource/delOrder';
		// console.log(que);
		return this.post(url,que);
	}

	public getOrders(query){
		query.account_id = this.general.account_id;
		let url = 'portal/index.php?r=sale/Search_schedule';
		return this.post(url,query);
	}

	public getIndexOderInfo(){
		let query={
			token: this.general.token
		}
		let url = 'portal/index.php?r=sale/Get_hall_by_space';
		return this.get(url, query);
	}
}
