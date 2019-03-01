import { Component, Input } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
	selector: '.xmb-commonCss',
	templateUrl: 'common.html',
})
export class commonCssDire {
	constructor(
	) {
	}

	@Input()
	set preload(args) {
		// this.active = args.active;
	}

}
