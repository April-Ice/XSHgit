import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { HomeService } from '../../providers/home';
import * as $ from 'jquery';


@Component({
	selector: 'page-floatMenu',
	templateUrl: 'floatMenu.html',
})
export class FloatMenuPage {
	public item;
	public url: any;

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		private sanitizer: DomSanitizer
	) {
		this.item = this.navParams.get('item');
		// this.url = this.navParams.get('item.href');
		this.getUrl();
	}

	public getUrl() {
		switch (this.item.name) {
			case '灵感图库':
				this.url = this.sanitizer.bypassSecurityTrustResourceUrl("http://localhost/Ms/portal/index.php?r=background/price_list&order_id=5149&token=2223009"); break;
			case '我的收藏':
				this.url = this.sanitizer.bypassSecurityTrustResourceUrl("http://localhost/Ms/portal/index.php?r=background/price_list&order_id=5149&token=2223009"); break;
			case '效果图库':
				this.url = this.sanitizer.bypassSecurityTrustResourceUrl("http://localhost/Ms/portal/index.php?r=background/price_list&order_id=5149&token=2223009"); break;
			case '矢量图库':
				this.url = this.sanitizer.bypassSecurityTrustResourceUrl("http://localhost/Ms/portal/index.php?r=background/price_list&order_id=5149&token=2223009"); break;
			case '视频素材':
				this.url = this.sanitizer.bypassSecurityTrustResourceUrl("http://localhost/Ms/portal/index.php?r=background/price_list&order_id=5149&token=2223009"); break;
			case '婚礼音乐':
				this.url = this.sanitizer.bypassSecurityTrustResourceUrl("http://localhost/Ms/portal/index.php?r=background/price_list&order_id=5149&token=2223009"); break;
			case '主持词':
				this.url = this.sanitizer.bypassSecurityTrustResourceUrl("http://localhost/Ms/portal/index.php?r=background/price_list&order_id=5149&token=2223009"); break;
			case '口袋学堂':
				this.url = this.sanitizer.bypassSecurityTrustResourceUrl("http://localhost/Ms/portal/index.php?r=background/price_list&order_id=5149&token=2223009"); break;
			default:
				break;
		}
	}
}
