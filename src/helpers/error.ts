import { ErrorHandler } from '@angular/core';

import { Sites } from './adpter';
import { httpBuildQuery } from './util';


export class ErrorHelper implements ErrorHandler {

	public a(){

	}
    public handleError(err: any): void {
        if (!err) { return; }
        if (err.url || err.headers) { return; }

        let stack = err.stack ? err.stack.toString() : '';
        let message = err.message ? err.message.toString() : '';

        if (stack.indexOf('XMLHttpRequest.invoke') > -1) {
            return; //忽略XHR错误
        }

        this.xhrPost('logger', { message, stack });

        console && console.warn(stack || message || err);
    }

    public xhrPost(url: string, data: any, fn?) {
        let xhr = new XMLHttpRequest();

        xhr.open('POST', Sites.baseapi + url, true);
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xhr.onreadystatechange = () => {
            if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 304)) {
                fn && fn.call(this, xhr.responseText);
            }
        };

        try {
            xhr.send(httpBuildQuery(data));
        } catch (e) { }
    }

}
