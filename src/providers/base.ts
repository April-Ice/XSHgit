import { Injectable, Injector } from '@angular/core';
import { Http, Headers, Request, Response, ResponseOptions } from '@angular/http';

import { Storage } from '@ionic/storage';
import { Agent, Sites } from '../helpers/adpter';

import { FileUploader } from 'ng2-file-upload';

import * as $ from 'jquery';


@Injectable()
export class BaseService {

	public baseApi = Sites.baseapi;

	public general = {
		token: window.localStorage.getItem('token'),
		account_id: window.localStorage.getItem('account_id'),
		staff_hotel_id: window.localStorage.getItem('staff_hotel_id'),
		staff_hotel_name: window.localStorage.getItem('staff_hotel_name'),
		manage: window.localStorage.getItem('manage'),
		name: window.localStorage.getItem('name'),
		unfinished: window.localStorage.getItem('unfinished'),
		vip: window.localStorage.getItem('vip'),
		is_supplier: window.localStorage.getItem('is_supplier'),
		is_city_partner: window.localStorage.getItem('is_city_partner'),
		avatar: window.localStorage.getItem('avatar'),
		vip_deadline: window.localStorage.getItem('vip_deadline'),
		ji_fen: window.localStorage.getItem('ji_fen'),
		gender: window.localStorage.getItem('gender'),
		exp: window.localStorage.getItem('exp'),
		exp_rank: window.localStorage.getItem('exp_rank'),
		exp_duanwei: window.localStorage.getItem('exp_duanwei'),
		exp_next_need: window.localStorage.getItem('exp_next_need'),
		gold_balance: window.localStorage.getItem('gold_balance')
	};


	public istoken = false;


	constructor(injector: Injector) {

	}

	post(url, query) {
		// let datas = '请求失败';
		return $.ajax({
			type: 'POST',
			url: this.baseApi + url,
			data: JSON.stringify(query),
			dataType: "JSON",
		});
	}
	postObject(url, query) {
		// let datas = '请求失败';
		return $.ajax({
			type: 'POST',
			url: this.baseApi + url,
			data: query,
			dataType: "JSON",
		});
	}

	get(url, query) {
		return $.ajax({
			type: 'GET',
			url: this.baseApi + url,
			data: query,
			dataType: "JSON",
		});
	}

	public uploader: FileUploader = new FileUploader({
		url: "",
		method: "POST",
		itemAlias: "uploadedfile"
	});

	// D: 定义事件，上传文件
	uploadFile(url) {
		this.uploader = new FileUploader({
			url: url,
			method: "POST",
			itemAlias: "uploadedfile"
		});
		// 上传
		this.uploader.queue[0].onSuccess = function (response, status, headers) {
			// 上传文件成功
			if (status == 200) {
				// 上传文件后获取服务器返回的数据
				let tempRes = JSON.parse(response);
			} else {
				// 上传文件后获取服务器返回的数据错误
				console.log("");
			}
		};
		this.uploader.queue[0].upload(); // 开始上传
	}
	uploadFileHandel() {
		this.uploader.queue[0].onSuccess = function (response, status, headers) {
			// 上传文件成功
			if (status == 200) {
				// 上传文件后获取服务器返回的数据
				let tempRes = JSON.parse(response);
			} else {
				// 上传文件后获取服务器返回的数据错误
			}
		};
		this.uploader.queue[0].upload(); // 开始上传
	}

}
