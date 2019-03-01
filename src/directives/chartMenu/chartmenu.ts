import { Component, Input } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { clientChartPage } from '../../pages/charts/client';
import { financeChartPage } from '../../pages/charts/finance';
import { saleChartPage } from '../../pages/charts/salechart';
import { targetChartPage } from '../../pages/charts/target';
import { ordersDataPage } from '../../pages/charts/orders'

@Component({
	selector: '.xmb-chartmenu',
	templateUrl: 'chartmenu.html',
})
export class ChartMenuDire {

    public chatmemu = '';

    public ifHotel = false; //是否为酒店版,true为酒店版
	public accoutId;
	public token;

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams

	) {

		console.log(this.chatmemu,localStorage.getItem('company_type'));
		let href = location.href;
		// let href = 'http://www.cike360.com/data_sys/index.html#/chart?origin=bac&account_id=334&token=2223009';
		if (href.indexOf('account_id') !== -1){
			href = href.split('account_id')[1];
			console.log(href);
			let id = href.split('&')[0];
			let a = id.split('=');
			this.accoutId = a[1];
			console.log(this.accoutId );
			localStorage.setItem('account_id',this.accoutId)
		}
		if (href.indexOf('token') !== -1){
			href = href.split('token')[1];
			console.log(href);
			let token = href.split('&')[0];
			let a = token.split('=');
			this.token = a[1];
			console.log(this.token,'.21');
			localStorage.setItem('token',this.token)
		}

		this.ifHotel = localStorage.getItem('company_type') == '1' ? true : false; //是否为酒店版,true为酒店版

    }

	@Input()
	set preload(args) {
		this.chatmemu = args.active;
	}

	setmemu(name) {
		this.chatmemu = name;
		
		if (name == 'sales') {
			console.log("name----",name);
			this.navCtrl.push(saleChartPage,null,{animate:false}).then(() => {
				this.navCtrl.removeView(this.navCtrl.getPrevious());
			});
		} else if (name == 'clients') {
			console.log("name----",name);
			this.navCtrl.push(clientChartPage,null,{animate:false}).then(() => {
				this.navCtrl.removeView(this.navCtrl.getPrevious());
			});
		} else if (name == 'goals') {
			console.log("name----",name);
			this.navCtrl.push(targetChartPage,null,{animate:false}).then(() => {
				this.navCtrl.removeView(this.navCtrl.getPrevious());
			});
		} else if (name == 'finance') {
			console.log("name----",name);
			this.navCtrl.push(financeChartPage,null,{animate:false}).then(() => {
				this.navCtrl.removeView(this.navCtrl.getPrevious());
			});
		} else if (name == 'orders') {
			console.log("name----",name);
			this.navCtrl.push(ordersDataPage,null,{animate:false}).then(() => {
				this.navCtrl.removeView(this.navCtrl.getPrevious());
			});
		}
	}

}
