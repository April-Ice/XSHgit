import { Injectable, Injector } from '@angular/core';

import { BaseService } from './base';

import * as $ from 'jquery';


@Injectable()
export class UploadService extends BaseService {

    constructor(injector: Injector) {
        super(injector);
    }

    public uploadImg(path, ready) {
		console.log();
		let url = 'zzzz';
        return this.uploadFile(url);
    }

}
