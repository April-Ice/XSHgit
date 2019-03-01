import { AppVersion as _AppVersion } from '@ionic-native/app-version';
export let AppVersion = new _AppVersion();

import { Badge as _Badge } from '@ionic-native/badge';
export let Badge = new _Badge();

import { BarcodeScanner as _BarcodeScanner } from '@ionic-native/barcode-scanner';
export let BarcodeScanner = new _BarcodeScanner();

import { Device as _Device } from '@ionic-native/device';
export let Device = new _Device();

import { LocalNotifications as _LocalNotifications } from '@ionic-native/local-notifications';
export { ILocalNotification } from '@ionic-native/local-notifications';
export let LocalNotifications = new _LocalNotifications();

import { SplashScreen as _SplashScreen } from '@ionic-native/splash-screen';
export let SplashScreen = new _SplashScreen();

import { StatusBar as _StatusBar } from '@ionic-native/status-bar';
export let StatusBar = new _StatusBar();

export let BackgroundService = window['BackgroundService'] || null;
export let Notify = window['Notify'] || null;

export let CacheClear = window['CacheClear'] || null;

export let Social = window['Social'] || null;
export let Wechat = window['Wechat'] || null;
export let YCWeibo = window['YCWeibo'] || null;
export let YCQQ = window['YCQQ'] || null;

export let Piwik = window['Piwik'] || null;
