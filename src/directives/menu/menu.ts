import { Component, Input } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { MeetingPage } from '../../pages/products/meeting';
import { RoomPage } from '../../pages/products/room';
import { FoodPage } from '../../pages/products/food';
import { WeddingPage } from '../../pages/products/wedding';


@Component({
	selector: '.xmb-menu',
	templateUrl: 'menu.html',
})
export class MenuDire {

    public active = '';
    public orderId = '';
    public ifHotel = false; //是否为酒店版,true为酒店版

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams
	) {
        this.ifHotel = localStorage.getItem('company_type') == '1' ? true : false; //是否为酒店版,true为酒店版
	}

	@Input()
	set preload(args) {
		this.active = args.active;
		this.orderId = args.orderId;
	}

	setactive() {
		console.log('this.orderId',this.orderId);
		switch (this.active) {
			case 'meeeting':
				console.log('meeting');
				break;
			case 'food':
				console.log('food');
				break;
			case 'room':
				console.log('room');
				break;
			case 'wedding':
				console.log('wedding');
				break;
			default:
				break;
		}
	}

	gotoMenu(name) {
		console.log(name);
		if(name == this.active){
			return;
		}else{
			this.active = name;
		}

		if (name == 'meeting') {
			this.navCtrl.push(MeetingPage,{order_id:this.orderId},{animate:false}).then(() => {
				this.navCtrl.removeView(this.navCtrl.getPrevious());
			});
		} else if (name == 'food') {
			this.navCtrl.push(FoodPage,{order_id:this.orderId},{animate:false}).then(() => {
				this.navCtrl.removeView(this.navCtrl.getPrevious());
			});;
		} else if (name == 'room') {
			this.navCtrl.push(RoomPage,{order_id:this.orderId},{animate:false}).then(() => {
				this.navCtrl.removeView(this.navCtrl.getPrevious());
			});;
		}else if (name == 'wedding') {
			this.navCtrl.push(WeddingPage,{order_id:this.orderId},{animate:false}).then(() => {
				this.navCtrl.removeView(this.navCtrl.getPrevious());
			});;
		} else {
			console.log("找不到此页面");
		}
	}



}
