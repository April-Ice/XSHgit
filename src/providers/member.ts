import { Injectable, Injector } from '@angular/core';

import { BaseService } from './base';

import * as $ from 'jquery';


@Injectable()
export class MemberService extends BaseService {

	constructor(injector: Injector) {
		super(injector);
	}


	public login(query) {
		let url = 'portal/index.php?r=dailyReport/login';
		return this.post(url, query);

	}


	public lostpw(query) {

	    return this.post('portal/index.php?r=dailyReport/GetPasswordByMobile', query);
	}


	// public logout() {
	//     let query = {
	//         mod: 'logging',
	//         action: 'logout',
	//         formhash: this.bridge.general.formhash
	//     };
	//     return this.bridge.get('member', query);
	// }


}
