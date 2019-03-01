import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import * as echarts from 'echarts';


@Component({
	selector: 'page-client',
	templateUrl: 'client.html',
})

export class clientChartPage {

	public clientlists = [];
	public client = 0;

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
	) {
		this.getClients();
	}

	//客户信息
	getClients() {
		this.clientlists = [
			{
				name: '北京浩瀚一方网络科技有限责任公司',
				price: 1998,
				orders: 10
			},
			{
				name: '北京浩瀚一方网络科技有限责任公司',
				price: 1998,
				orders: 10
			},
			{
				name: '北京浩瀚一方网络科技有限责任公司',
				price: 1998,
				orders: 10
			},
			{
				name: '北京浩瀚一方网络科技有限责任公司',
				price: 1998,
				orders: 10
			},
			{
				name: '北京浩瀚一方网络科技有限责任公司',
				price: 1998,
				orders: 10
			},
			{
				name: '北京浩瀚一方网络科技有限责任公司',
				price: 1998,
				orders: 10
			},
			{
				name: '北京浩瀚一方网络科技有限责任公司',
				price: 1998,
				orders: 10
			}
		]
	}
}
