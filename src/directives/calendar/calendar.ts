import { Component, Input } from '@angular/core';
import { NavController } from 'ionic-angular';


@Component({
    selector: '.xmb-calendar',
    templateUrl: 'calendar.html',
})
export class CalendarDire {
    public year;
    public month;
    public active_day = new Date().getDate();

    public dealDate = [];
    public noDealDate = [];
    public curDeal = [];
    public curNoDeal = []

    public days = [];
    public runNum = 0;

    constructor(
        public nav: NavController,
    ) {
    }

    @Input()
    set preload(args) {
        this.year = args.year;
        this.month = args.month;
        this.dealDate = args.dealDate;
        this.noDealDate = args.nodealDate;

        this.showCalendarData();
    }

    showCalendarData() {
        this.days = [];
        if (this.year > 0 && this.month > 0) {
            //展示指定的年和月的所有日期
            this.showDays(this.year, this.month);
        } else {
            if (this.runNum < 5) {
                setTimeout(() => {
                    this.showCalendarData();
                }, 1000);
                this.runNum++;
            }
        }
    }

    //初始化显示 当前年和月
    show_now() {
        var now = new Date();
        this.active_day = now.getDate();
        let curyear = now.getFullYear();
        let curmonth = now.getMonth() + 1;
        this.showDays(curyear, curmonth)
    }

    showDays(year, month) {
        //得到表示指定年和月的1日的那个时间对象
        let date = new Date(year, month - 1, 1);

        this.getOrderDays();

        //本月1号是星期几，添加空白
        let dayOfWeek = date.getDay();
        for (let i = 0; i < dayOfWeek; i++) {
            let item = {
                day: null,
                classname: ''
            }
            this.days.push(item);
        }

        //计算一个月有多少天
        let daysOfMonth = this.calDays(year, month);

        for (let i = 1; i <= daysOfMonth; i++) {
            let classname = null;
            if (this.curDeal.length > 0) {
                this.curDeal.map((item) => {
                    let deal = parseInt(item);
                    if (deal == i) {
                        // console.log("已付");
                        classname = "paid";
                    }
                });
            }
            if (this.curNoDeal.length > 0) {
                this.curNoDeal.map((item) => {
                    let noday = parseInt(item);
                    if (noday == i) {
                        classname = "plan";
                    }
                });
            }
            let item = {
                day: i,
                classname: classname
            };
            this.days.push(item);
        }
        // console.log(this.days);

    }

    calDays(year, month) {
        return new Date(year, month, 0).getDate();
    }

    //分割订单天数
    getOrderDays() {
        this.curDeal = [];
        this.curNoDeal = [];
        // console.log(this.dealDate);
        this.dealDate.map((item) => {
            let dateStr = item;
            let reg = /^(\d{4})-(\d{1,2})-(\d{1,2})$/;
            dateStr.match(reg);
            let regYear = RegExp.$1;
            let regMonth = RegExp.$2;
            let regDay = RegExp.$3;
            if (regYear == this.year && regMonth == this.month) {
                this.curDeal.push(regDay);
            }
        });

        this.noDealDate.map((item) => {
            let dateStr = item;
            let reg = /^(\d{4})-(\d{1,2})-(\d{1,2})$/;
            dateStr.match(reg);
            let regYear = RegExp.$1;
            let regMonth = RegExp.$2;
            let regDay = RegExp.$3;
            if (regYear == this.year && regMonth == this.month) {
                this.curNoDeal.push(regDay);
            }
        });
    }

}
