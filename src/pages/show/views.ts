import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { HomePage } from "../home/home";

import { HallService } from '../../providers/hall';

import { AddOrderPage } from '../home/addorder';

@Component({
	selector: 'page-views',
	templateUrl: 'views.html',
	providers: [HallService]
})
export class ViewsPage {
	public title = '';
	public url;
	public orderId;
	public priceUrl;
	public showDef = true;
	public showButton = true;

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		private sanitizer: DomSanitizer,
		private toastCtrl: ToastController,
		public service: HallService,
		// private alertCtrl:AlertController
	) {
		this.title = this.navParams.get('title');
		this.url = this.sanitizer.bypassSecurityTrustResourceUrl(this.navParams.get('url'));


		this.orderId = this.navParams.get('order_id');
		console.log(this.url.changingThisBreaksApplicationSecurity, this.title);
		if (this.url.changingThisBreaksApplicationSecurity) {
			if (this.url.changingThisBreaksApplicationSecurity.indexOf('company') != -1) {
				this.showButton = false;

			}
			if (this.url.changingThisBreaksApplicationSecurity.indexOf('720yun') !== -1) {
				this.showButton = false;
			}
		}


		if (this.title.indexOf('720度') !== -1 || this.title.indexOf('服务体系') !== -1 || this.title.indexOf('服务人员') !== -1) {
			this.showButton = false;
		}

		console.log(this.showDef, this.title);



	}
	goDoing() {
		let toast = this.toastCtrl.create({
			message: '开发中，即将上线！',
			duration: 1500,
			position: 'middle',

		});
		toast.present();
	}

	goBack() {
		this.navCtrl.push(HomePage);
	}

	goPrice() {
		// let iframe = document.getElementsByClassName('view-iframe');
		// this.url =
		this.showDef = false;
		const token = localStorage.getItem('token');
		let src = 'http://www.cike360.com/PHP_BackGround/portal/index.php?r=background/bill1&order_id=' + this.orderId + '&token=' + token + '&outFrom=weddingHotel&from=ipad';
		this.priceUrl = this.sanitizer.bypassSecurityTrustResourceUrl(src);
		alert(1);
		console.log(src);
	}

	gotoEditOrder() {
		// 获取订单数据
		let query = {
			order_id: this.orderId
		}
		this.service.getOrderInfo(query).then(data => {
			if (data) {
				console.log('跳转时传值--', data);
				this.navCtrl.push(AddOrderPage, {
					order_id: this.orderId,
					list: data
				});
			}
		});
	}
}
