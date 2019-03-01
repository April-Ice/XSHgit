import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, ToastController, LoadingController } from 'ionic-angular';

import * as echarts from 'echarts';
import * as $ from 'jquery';
import { ChartService } from '../../providers/chart';
import { ViewsPage } from '../show/views';
import { AddOrderPage } from '../home/addorder';

//import { FileChooser } from '@ionic-native/file-chooser';


@Component({
    selector: 'page-orders',
    templateUrl: 'orders.html',
    providers: [ChartService]
})

export class ordersDataPage {
    public lastday = this.getLastDay();
    public searchOptions = {
        area_id: '0',
        start_date: new Date(new Date(new Date().setDate(1)).setHours(8, 0, 0)).toISOString(),
        end_date: new Date(new Date(new Date().setDate(this.lastday)).setHours(31, 59, 59)).toISOString(),
        saler: '0',
        key_words: '',
        page_size: 8,
        page_index: 1
    }
    public staffList = [];
    public typelist = [
        // { id: 9, title: '婚宴' },
        // { id: 5, title: '出阁宴' },
        // { id: 6, title: '乔迁宴' },
        // { id: 3, title: '宝宝宴' },
        // { id: 7, title: '升学宴' },
        // { id: 8, title: '开业宴' },
        // { id: 4, title: '寿宴' },
        // { id: 1, title: '会议' },
        // { id: 10, title: '其他' },
    ];

    public orderList = [];
    public oringnOrderList = [];

    public pageNumArr = [];
    public pagCurren = 1;

    public order_num;
    public total_price;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public toastCtrl: ToastController,
        public service: ChartService,
    ) {
        this.getSelectOptions();
        this.getTypeOptions();
        this.getTableInfo();
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

    public getSelectOptions() {
        this.service.getOrderOptions().then(data => {
            console.log(data);
            if (data) {
                this.staffList = data.staff;
            }
        });
    }

    public getTypeOptions() {
        this.service.getTyperOptions().then(data => {
            console.log(data);
            if (data) {
                this.typelist = data;
                this.searchOptions.area_id = data[0].id;
            }
        });
    }

    public getTableInfo() {
        let query = this.searchOptions;
        this.service.getOrderData(query).then(data => {
            this.orderList = data.order_data;
            this.order_num = data.order_num;
            this.total_price = data.total_price;
            // this.orderList =  this.orderList.concat(data.order_data);
            this.oringnOrderList = data.order_data;
            this.pageNumArr = [];
            // for (let i = 1; i <= data.total_page; i++) {
            for (let i = 1; i <= data.total_page; i++) {
                this.pageNumArr.push(i);
            }
        })
    }

    public searchOrder() {
        this.searchOptions.page_index = 1;
        this.getTableInfo();
    }

    public setPagination(num) {
        this.searchOptions.page_index = num;
        this.pagCurren = num;
        this.getTableInfo();
    }

    public onInput(e) {
        const val = e.target.value;
        this.orderList = this.oringnOrderList;
        if (val && val.trim() != '') {
            this.orderList = this.orderList.filter((item) => {
                return (item.order_name.toLowerCase().indexOf(val.toLowerCase()) > -1);
            })
        }

        console.log(" this.orderList", this.orderList);
        if (e.keyCode === 13) {
            this.getTableInfo();
        }
    }

    public gotoDetail(id) {
        let url = this.service.baseApi + '/portal/index.php?r=background/bill&order_id=' + id + '&token=' + this.service.general.token + '&from=ipad';
        console.log(url);
        this.navCtrl.push(ViewsPage, { title: '订单详情', url: url, order_id: id });
    }

    public gotoAddOrder() {
        this.navCtrl.push(AddOrderPage);
    }

}