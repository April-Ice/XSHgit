import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';

import { MemberService } from '../../providers/member';
import { HomePage } from '../home/home';
import * as $ from 'jquery';


@Component({
	selector: 'page-login',
	templateUrl: 'login.html',
	providers: [MemberService]
})
export class LoginPage {
	login: any;

	public ifRember = true;
	public localUser = window.localStorage.getItem('local_user');
	public localPassword = window.localStorage.getItem('local_password');

	public imgSrc = 'assets/imgs/index/login_bg.jpg';

	constructor(
		public nav: NavController,
		public toastCtrl: ToastController,
		public service: MemberService,
	) {

	}

	formSubmit(form) {
		let query = {
			phone: form.phone,
			password: form.password
		}
		// console.log(form);

		if (this.ifRember) {
			console.log("记住密码");
			window.localStorage.setItem('local_user', form.phone);
			window.localStorage.setItem('local_password', form.password);
		} else {
			window.localStorage.setItem('local_user', '');
			window.localStorage.setItem('local_password', '');
		}

		this.service.login(query).then(data => {
			console.log(data);
			if (data) {
				if (data == "failed") {
					alert('您输入的手机号或密码错误！');
					return;
				} else if (data.unfinished == "selectcity" || data.unfinished == "hotel") {
					alert("您的账号尚未激活，请联系管理员：15101140405 小斯");
					return;
				} else {
					window.localStorage.setItem('account_id', data.account_id);
					document.cookie="account_id="+data.account_id;
					window.localStorage.setItem('account_id',data.account_id);
					window.localStorage.setItem('avatar', data.avatar);
					window.localStorage.setItem('name', data.name);
					window.localStorage.setItem('token', data.token);
					window.localStorage.setItem('company_type', data.company_type);
					window.localStorage.setItem('min_discount',data.min_discount);
					window.localStorage.setItem('department_list ',data.department_list );
					window.localStorage.setItem('manage ',data.manage);

					this.nav.push(HomePage);
				}
			}
		})
			.catch(err=>{
				console.log(err,form.phone,form.password,'!!!!! ');
				// if (err.responseText == 'failed'){
					alert('您输入的手机号或密码错误！');
				// }
			});

	}

	// 忘记密码
	forget() {
		let toast = this.toastCtrl.create({
			message: '密码已发送到您的手机  请查收',
			showCloseButton: true,
			position: 'middle',
			cssClass: 'my'
		});

		let query = {
			mobile: window.localStorage.getItem('name')
		}
		this.service.lostpw(query).then(data => {
			toast.present();
		});
	}
}
