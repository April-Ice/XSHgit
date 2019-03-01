import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { HomeService } from '../../providers/home';

import { AddOrderPage } from './addorder';
import { ViewsPage } from '../show/views';

@Component({
    selector: 'page-ordersearch',
    templateUrl: 'ordersearch.html',
    providers: [HomeService]
})
export class OrderSearchPage {

    public datelistsItemNum = 0;
    public lastday = this.getLastDay();
    public searchOptions = {
        start_time: new Date(new Date(new Date().setDate(1)).setHours(8, 0, 0)).toISOString(),
        end_time: new Date(new Date(new Date().setDate(this.lastday)).setHours(31, 59, 59)).toISOString(),
        hall_id: '0',
        page_size: 10,
        page_index: 1
    }
    public hallList = [];
    public orderList = [];

    public pageNumArr = [];
    public pagCurren = 1;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public service: HomeService,
        public loadingCtrl: LoadingController
    ) {
        console.log("最后一天", this.searchOptions.end_time);
        console.log('第一天', this.searchOptions.start_time);
        this.getIndexInfo();
        this.getOrderInfo();
    }

    public getLastDay() {
        var new_year = new Date().getFullYear();  //取当前的年份   
        var month = new Date().getMonth();
        var new_month = new Date().getMonth() + 1;//取下一个月的第一天，方便计算（最后一天不固定）   
        if (month > 12)      //如果当前大于12月，则年份转到下一年   
        {
            new_month -= 12;    //月份减   
            new_year++;      //年份增   
        }
        var new_date = new Date(new_year, new_month, 1);        //取当年当月中的第一天   
        return (new Date(new_date.getTime() - 1000 * 60 * 60 * 24)).getDate();//获取当月最后一天日期   
    }

    public getIndexInfo() {
        this.service.getIndexOderInfo().then(data => {
            this.hallList = data;
        });
    }

    public getOrderInfo() {
        let query = this.searchOptions;
        this.service.getOrders(query).then(data => {
            this.orderList = data.list;
            this.pageNumArr = [];
            for (let i = 1; i <= data.total_page; i++) {
                this.pageNumArr.push(i);
            }
        })
    }

    public searchOrder() {
        this.searchOptions.page_index = 1;
        this.getOrderInfo();
    }

    public setPagination(num) {
        this.searchOptions.page_index = num;
        this.pagCurren = num;
        this.getOrderInfo();
    }

    public gotoAddOrder() {
        this.navCtrl.push(AddOrderPage);
    }

    public gotoDetail(id) {
        let url = this.service.baseApi + '/portal/index.php?r=background/bill&order_id=' + id + '&token=' + this.service.general.token + '&from=ipad';
        console.log(url);
        this.navCtrl.push(ViewsPage, { title: '订单详情', url: url, order_id: id });
    }
}
