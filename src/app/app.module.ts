import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicStorageModule } from '@ionic/storage';
// import { IonicApp, IonicModule } from 'ionic-angular';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { FileUploadModule } from 'ng2-file-upload';

import { HttpModule } from '@angular/http';

// 新的http请求
import { HttpClientModule } from "@angular/common/http";

import { Dires } from '../directives/index';

import { MyApp } from './app.component';

import { Pages } from '../pages/index';
import { RouteConfig } from '../pages/route';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';


// import * as $ from 'jquery';

let AppConfig = {
	backButtonText: '',
	iconMode: 'ios',//安卓icon强制使用ios的icon以及样式
	mode: 'ios',//样式强制使用ios样式
	monthShortNames: ['1月', '2月', '3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'], //时间插件月份显示
};

@NgModule({
	declarations: [
		MyApp,
		Pages,
		Dires
	],
	imports: [
		BrowserModule,
		FileUploadModule,
		HttpModule,
		IonicStorageModule.forRoot(),
		IonicModule.forRoot(MyApp,AppConfig,RouteConfig),
		HttpClientModule,
	],
	bootstrap: [IonicApp],
	entryComponents: [
		MyApp,
		Pages
	],
	providers: [
		StatusBar,
		SplashScreen,
		// BridgeHelper,
		{ provide: ErrorHandler, useClass: IonicErrorHandler }
		// { provide: ErrorHandler, useClass: ErrorHelper },
	]
})
export class AppModule { }
