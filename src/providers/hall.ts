import { query } from '@angular/core/src/animation/dsl';
import { Injectable, Injector } from '@angular/core';

import { BaseService } from './base';

import * as $ from 'jquery';


@Injectable()
export class HallService extends BaseService {

	constructor(injector: Injector) {
		super(injector);
	}

	public getHallImgs(query) {
		let url = '/portal/index.php?r=background/GetHallImgs';
		return this.get(url,query);
	}

	public deleteImg(query){
		let url = '/portal/index.php?r=background/HideHallImgs';
		return this.post(url,query);
	}

	public editImg(query){
		let url = '/portal/index.php?r=background/EditHallImgName';
		return this.post(url,query);
	}

	public addImgVideo(data){
		let url = 'portal/index.php?r=Background/AddHallImgVideo';
		return this.post(url,data);
	}

	public getOrderInfo(data){
		let url = 'portal/index.php?r=sale/Get_order_edit_data';
		return this.get(url,data);
	}

}
