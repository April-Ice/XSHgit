import { Component, Input, Output, EventEmitter, ElementRef, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser'

import { UploadService } from '../../providers/upload';


@Component({
	selector: '.xmb-misc-uploader',
	templateUrl: 'upload.html',
	providers: [UploadService],
})
export class UploaderDire implements OnInit{

	public hide = false;

	public type = '';
	public myavatar = 'assets/imgs/system/upload.jpg';
	public imgUrl;

	public uploader: any;

	public nophoto = 'assets/imgs/system/nophoto.jpg';

	constructor(
		public ref: ElementRef,
		public service: UploadService,
		private sanitizer: DomSanitizer
	) {
		this.avatar();
	}

	@Output()
	public onloaded = new EventEmitter();

	@Output()
	public ondelete = new EventEmitter();

	@Input()
	set scene(type) {
		type = type || 'album';
		console.log(type);
		if (typeof this[type] == 'function') {
			// this[type]();
		}
	}
	@Input() imgSrc:string;

	selectedFileOnChanged(event: any) {
		console.log(event.target.value);
		// this.myavatar = event.target.files[0];

		var file: File = event.target.files[0];
		var myReader: FileReader = new FileReader();

		if (myReader) {
			myReader.onloadend = (e) => {
				// 向父页面传输图片base64
				this.onloaded.emit(myReader.result);
			}
			myReader.readAsDataURL(file);
			// 页面展示图片
			let imgUrla = window.URL.createObjectURL(event.target.files[0]);
			let sanitizerUrl = this.sanitizer.bypassSecurityTrustUrl(imgUrla);
			this.imgUrl = sanitizerUrl;
		}

	}

	public avatar() {
		this.type = 'avatar';

	}
	ngOnInit(){
		this.imgUrl=this.imgSrc;
	}
}
