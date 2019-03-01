import { query } from '@angular/core/src/animation/dsl';
import { Component } from '@angular/core';
import { ViewChild } from '@angular/core';
import { NavController, NavParams, AlertController,Slides,Platform  } from 'ionic-angular';
import { HallService } from '../../providers/hall';
import * as $ from 'jquery';
//对swiper进行声明
declare let Swiper:any;
declare let Base64:any;
declare let Crypto:any;
declare let mOxie:any;
declare let plupload:any;

@Component({
	selector: 'page-piscs',
	templateUrl: 'pics.html',
	providers: [HallService]
})
export class PicsPage {
	@ViewChild(Slides) slides: Slides;

	public initialSlide;

	// goToSlide(i) {
	// 	this.slides.slideTo(i, 100);
	// }

	slideChanged() {
		let currentIndex = this.slides.getActiveIndex();
		console.log('Current index is', currentIndex);
	}

	public spaceId=null;
	public hallId=null;
	public hallname = '';
	public piclist = [];
	public piclistTwo = [];
	public showSlide = true;
	public nowImg = '';
	public showBig = false;
	public showPic = true;
	public index;
	public isIpad;
	public swiper;
	public isEdit = false;
	public ShowBlack = true;
	public showInput = false;
	public isIndex = true;

	// login:any = [{"username": "username" + this.id,"password": "pwd" + this.id}];

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public alertCtrl: AlertController,
		public service: HallService,
		public plt: Platform
	) {
		this.spaceId = this.navParams.get('spaceId');
		this.hallId = this.navParams.get('hallId');
		this.hallname = this.navParams.get('hallname');
		// this.getPics();
		if (this.plt.is('ipad')) {
			// This will only print when on iOS
			// console.log('I am an ipad device!');
			this.isIpad = true;
			console.log('1111',$('.list-img'))
		}else {
			this.isIpad = false;

		}

	}

	initSwiper(i){
		this.swiper = new Swiper('.swiper-container',{
			initialSlide:i,
			// freeMode : true,
			// freeModeMomentum : false,
			direction :'horizontal',
			autoplay: false,
			observer:true,
			observeParents:true,
			autoplayDisableOnInteraction:false,
			navigation: {
				nextEl: '.swiper-button-next',
				prevEl: '.swiper-button-prev',
			},
		})
	}

	ionViewDidLoad(){
		this.initSwiper(0);

	}

	public ionViewWillEnter() {
        this.getPics();
		// this.slides.startAutoplay();

		var accessid = 'LTAIjPXqmetaG8iO';
		var accesskey = 'yHaKQMZBQCmA4TyUdNLY3roAo5fRtZ';
		var host = 'http://inspitation-img-store.oss-cn-beijing.aliyuncs.com';

		var g_dirname = '';//设置存储目录，为空则为根目录
		var g_object_name = '';
		var g_object_name_type = '';

		var policyText = {
			"expiration": "2020-01-01T12:00:00.000Z", //设置该Policy的失效时间，超过这个失效时间之后，就没有办法通过这个policy上传文件了
			"conditions": [
				["content-length-range", 0, 1048576000] // 设置上传文件的大小限制
			]
		};

		var policyBase64 = Base64.encode(JSON.stringify(policyText));
		var bytes = Crypto.HMAC(Crypto.SHA1, policyBase64, accesskey, { asBytes: true });
		var signature = Crypto.util.bytesToBase64(bytes);

		function random_string(len) {
			len = len || 32;
			var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
			var maxPos = chars.length;
			var pwd = '';
			for (var i = 0; i < len; i++) {
				pwd += chars.charAt(Math.floor(Math.random() * maxPos));
			}
			return pwd;
		}

		function get_suffix(filename) {
			var pos = filename.lastIndexOf('.');
			var suffix = '';
			if (pos != -1) {
				suffix = filename.substring(pos);
			}
			return suffix;
		}

		function calculate_object_name(filename) {
			if (g_object_name_type == 'local_name') {
				g_object_name += "${filename}";
			}
			else if (g_object_name_type == 'random_name') {
				var suffix = get_suffix(filename);
				g_object_name = g_dirname + random_string(10) + suffix;
			}
			return '';
		}

		function get_uploaded_object_name(filename) {
			if (g_object_name_type == 'local_name') {
				var tmp_name = g_object_name;
				tmp_name = tmp_name.replace("${filename}", filename);
				return tmp_name;
			}
			else if (g_object_name_type == 'random_name') {
				return g_object_name;
			}
		}

		function set_upload_param(up, filename, ret) {
			g_object_name = g_dirname;
			if (filename != '') {
				var suffix = get_suffix(filename);
				calculate_object_name(filename);
			}
			var new_multipart_params = {
				'key': g_object_name,
				'policy': policyBase64,
				'OSSAccessKeyId': accessid,
				'success_action_status': '200', //让服务端返回200,不然，默认会返回204
				'signature': signature
			};

			up.setOption({
				'url': host,
				'multipart_params': new_multipart_params
			});

			up.start();
		}
		var service = this.service;
		var space_id = this.spaceId;
		var hall_id = this.hallId;
		var e = this;

		var uploader = new plupload.Uploader({
			runtimes: 'html5,flash,silverlight,html4',
			browse_button: 'uploadFile',
			multi_selection: true,
			flash_swf_url: 'assets/oss-h5-upload-js-direct/lib/plupload-2.1.2/js/Moxie.swf',
			silverlight_xap_url: 'assets/oss-h5-upload-js-direct/lib/plupload-2.1.2/js/Moxie.xap',
			url: "http://inspitation-img-store.oss-cn-beijing.aliyuncs.com",

			init: {
				PostInit: function () {
					//document.getElementById('addNewGoods').onclick = function () {
					//    set_upload_param1(uploader, '', false);
					//    // return false;
					//};
				},
				FilesAdded: function (up, files) {
					//for (var i = 0, len = files.length; i < len; i++) {
					//    !function (i) {
					//        previewImage(files[i],
					//            function (imgsrc) {
					//                //var html =
					//                //    '<div style="height: 4rem;width: 4rem;">' +
					//                //        '<img src="' +
					//                //        imgsrc +
					//                //        '" style="width: 4rem;height: 4rem;margin-left: .1rem;border-radius: .5rem;" />' +
					//                //        '<i class="img-del img-del' + files[i].id + ' glyphicon glyphicon-remove" data-val="' +
					//                //        files[i].id +
					//                //        '"><img src="style/images/close.jpg" alt=""></i>' +
					//                //        '</div>';
					//                //$('#image-list').append(html);
					//                $("#addImg img").attr("src", imgsrc);
					//            })
					//    }(i);
					//}
					////plupload.each(files, function(file) {
					////	document.getElementById('ossfile').innerHTML += '<div id="' + file.id + '">' + file.name + ' (' + plupload.formatSize(file.size) + ')<b></b>'
					////	+'<div class="progress"><div class="progress-bar" style="width: 0%"></div></div>'
					////	+'</div>';
					////});
					g_object_name_type='random_name';
					g_dirname='';
					set_upload_param(up, files[0].name, true);
				},
				BeforeUpload: function (up, file) {

				},
				UploadProgress: function (up, file) {
					//var d = document.getElementById(file.id);
					//d.getElementsByTagName('b')[0].innerHTML = '<span>' + file.percent + "%</span>";
					//var prog = d.getElementsByTagName('div')[0];
					//var progBar = prog.getElementsByTagName('div')[0]
					//progBar.style.width= 2*file.percent+'px';
					//progBar.setAttribute('aria-valuenow', file.percent);
				},
				FileUploaded: function (up, file, info) {
					if (info.status == 200) {
						var fileUrl = "http://inspitation-img-store.oss-cn-beijing.aliyuncs.com/" + get_uploaded_object_name(file.name);
						var type = file.type.substring(0,file.type.indexOf("/"));
						var t = 1;
						if(type == 'image'){
							var data = {
								space_id:space_id,
								hall_id:hall_id,
								url : fileUrl,
							}
							service.addImgVideo(data).then(data => {
								e.piclist.push({
									'id':data.id,
									'img_url':fileUrl+'?x-oss-process=image/resize,m_lfit,h_500,w_500',
									'img_url_lg':fileUrl+'?x-oss-process=image/resize,m_lfit,h_1080,w_1080',
								});
							});
						}
					} else {
						console.log("upload failed：" + info.response);
					}
				},
				Error: function (up, err) {
					console.log("system error：" + err.response);
				}
			}
		});
		uploader.init();
    }

	getPics() {

		let query={
			space_id:this.spaceId,
			hall_id:this.hallId
		};
		this.service.getHallImgs(query).then(data => {
			console.log(data);
		   if(data.status==1){
				this.piclist=data.imgs;
				console.log(this.piclist);
				for (var i=0;i<this.piclist.length;i++){
					this.piclistTwo.push({'name':this.piclist[i].name,'id':this.piclist[i].id});
				}

		   }
	   });
		console.log(this.piclistTwo);
	}

	stopE(event){
		console.log('2123')
		event.stopPropagation();

	}

	showBigImg(img,i) {
		this.initialSlide = i;

		this.showBig = true;
		this.showPic = false;

		console.log(this.initialSlide,'@@@');
		if (this.isIpad){
			$('.list-img').addClass('ipad-img');
			console.log('@!@#!@#!')
		}

		const that = this;
		setTimeout(function () {
			that.swiper.slideTo(i, 1000, false);
			// that.initSwiper(i);
		},500);
		console.log(this.swiper);

	}
	editPhoto(){
		console.log();
		let height = $('.piscs-con').find('img').css('height');
		console.log(height);
		$('.img-black').css('height',height);
		console.log(height+'px');
		// $('.img-black').clientHeight =
		if (this.isEdit == false){
			this.isEdit = true;
			this.ShowBlack = false;
			// console.log($('.img-black').height());
		} else {
			this.isEdit = false;
			this.ShowBlack = true;
		}
	}
	editName(item,i){
		// this.showInput = true;
		$('.piscs-con').find('.card-title-span').eq(i).css('display','none');
		$('.piscs-con').find('.card-title-input').eq(i).css('display','block');
		$('.piscs-con').find('.pic-edit').eq(i).css('display','none');
		$('.piscs-con').find('.pic-save').eq(i).css('display','block');

	}
	saveName(item,i){

		$('.piscs-con').find('.card-title-input').eq(i).css('display','none');
		$('.piscs-con').find('.card-title-span').eq(i).css('display','block');
		$('.piscs-con').find('.pic-save').eq(i).css('display','none');
		$('.piscs-con').find('.pic-edit').eq(i).css('display','block');

		let query = {
			'img_id':item.id,
			'name':this.piclist[i].name
		};
		console.log(query);
		this.service.editImg(query).then(data=>{
			console.log(data);
		})
			.catch(err=>{
				console.log(err);
			})

	}

	savePhoto(){
		this.isEdit = false;
		this.ShowBlack = true;

		for (var i=0;i<this.piclist.length;i++){
			$('.piscs-con').find('.card-title-input').eq(i).css('display','none');
			$('.piscs-con').find('.card-title-span').eq(i).css('display','block');
			$('.piscs-con').find('.pic-save').eq(i).css('display','none');
		}

		let query = [];

		// this.service.editImg(query).then(data=>{
		// 	console.log(data);
		//
		//
		// })
		// 	.catch(err=>{
		// 		console.log(err);
		// 	})

		// console.log(this.piclist);
		// let number = this.piclist.length + 1;
		// this.piclist.push({"username": "username" + number, "password": "pwd" + number});

	}

	deleteImg(img,i){
		// confirm()
		console.log(img);
		let confirm = this.alertCtrl.create({
			title: '确认删除吗?',
			buttons:[
				{
					text:'确定',
					handler:()=>{
						console.log('Agree clicked');
						let query = {
							'img_id':img.id
						}

						this.service.deleteImg(query).then(data => {
							console.log(data);
							this.piclist.splice(i,1);
						})
							.catch(err=>{
								console.log(err);
							});
					}
				},{
					text:'取消',
					handler:()=>{
						console.log('Agree clicked');
					}
				}
			]
		})

		confirm.present();
	}

	uploadImg(){
		$("#uploadFile").click();
	}

	hideBigImg() {
		this.showBig = false;
		this.showPic = true;
		// this.showSlide = true;

	}
}
