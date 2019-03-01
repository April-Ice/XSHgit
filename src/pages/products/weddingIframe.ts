
import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';


@Component({
	selector: 'page-weddingdetail',
	templateUrl: 'weddingIframe.html',
})
export class WeddingDetailPage {

	public name;
	public id;
	public token;
	public account_id;
	public url: any;

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		private sanitizer: DomSanitizer
	) {
		// console.log(this.navParams.get('id'));
		this.name = this.navParams.get('name');
		this.token = localStorage.getItem('token');
		this.account_id = localStorage.getItem('account_id');
		if (this.navParams.get('id')) {
			this.id = this.navParams.get('id');
		}

		// if (this.navParams.get('token')){
		// 	this.token = this.navParams.get('token');
		// }
		this.getUrl();
	}

	public getUrl() {
		var url = 'http://test.cike360.com/';
		url="http://localhost:8101/";
		switch (this.name) {
			case '色彩定位':
				this.url = this.sanitizer.bypassSecurityTrustResourceUrl(url+"/portal/index.php?r=background/color_fix_list&order_id=&from=ipad&token="+this.token);
				break;
			case '风格定位':
				this.url = this.sanitizer.bypassSecurityTrustResourceUrl(url+"/portal/index.php?r=background/style_fix_list&order_id=&from=ipad&token="+this.token+"&account_id"+this.account_id);
				break;
			case '婚礼统筹':
				this.url = this.sanitizer.bypassSecurityTrustResourceUrl(url+"/portal/index.php?r=background/tongchou&order_id=5027&from=ipad");
				break;
			case '场布DIY':
				this.url = this.sanitizer.bypassSecurityTrustResourceUrl(url+"/portal/index.php?r=background/scene_diy&from=ipad&order_id="+this.id+"&token="+this.token);
				break;
			case '整案详情':
				this.url = this.sanitizer.bypassSecurityTrustResourceUrl(url+"/portal/index.php?r=background/style_fix&from=ipad&hole_case_id="+this.id+"&type=show&source=hotel"+"&token="+this.token);
				break;
			case '编辑套餐':
				this.url = this.sanitizer.bypassSecurityTrustResourceUrl(url+"/portal/index.php?r=background/style_fix&from=ipad&hole_case_id="+this.id+"&type=edit");
				break;
			case '新增套餐方案':
				this.url = this.sanitizer.bypassSecurityTrustResourceUrl(url+"/portal/index.php?r=background/style_fix&from=ipad&hole_case_id="+this.id+"&type=edit");
				break;
			case '新增套餐本地':
				this.url = this.sanitizer.bypassSecurityTrustResourceUrl(url+"/portal/index.php?r=background/style_fix&from=ipad&hole_case_id="+this.id+"&type=edit");
				break;
			case '方案库':
				this.url = this.sanitizer.bypassSecurityTrustResourceUrl(url+"/portal/index.php?r=background/style_fix&from=ipad&hole_case_id="+this.id+"&type=edit");
				break;
			case '本地上传':
				this.url = this.sanitizer.bypassSecurityTrustResourceUrl(url+"/portal/index.php?r=background/style_fix&from=ipad&hole_case_id="+this.id+"&type=edit");
				break;
			case '服务人员':
				this.url = this.sanitizer.bypassSecurityTrustResourceUrl(url+"/portal/index.php?r=background/service_person_detail&from=ipad&tid=&pid=1&service_person_id="+this.id+"&type=service_person&source=hotel&token="+this.token);
				// this.url = this.sanitizer.bypassSecurityTrustResourceUrl(url+"/portal/index.php?r=background/service_person_detail&tid=&pid=1&service_person_id=2345&token=2223340&pre_page=sales_list&pre_page_type=4&page=1&type=service_person"+this.token);
				break;
			case '婚礼亮点':
				this.url = this.sanitizer.bypassSecurityTrustResourceUrl(url+"/portal/index.php?r=background/upload_case_detail&from=ipad&ci_id="+this.id+"&type=bright_point&source=hotel&token="+this.token);
				break;
			default:
				break;
		}
	}

}
