import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';

import * as echarts from 'echarts';
import { ChartService } from '../../providers/chart';

@Component({
    selector: 'page-target',
    templateUrl: 'target.html',
    providers: [ChartService]
})

export class targetChartPage {

    public ifHotel = false; //是否为酒店版,true为酒店版

    public modalVisible = false;
    public staffTargetchart;
    public target = null;
    public staffTargetList = [];
    public modifyTarget = null;
    public modifyStaffTargetList = [];
    public totalTarget = 0;
    public totalStaffTargetRate = 0;
    public imgSrc = [
        'assets/imgs/chart/badge1.png',
        'assets/imgs/chart/badge2.png',
        'assets/imgs/chart/badge3.png',
        'assets/imgs/chart/badge4.png',
        'assets/imgs/chart/badge5.png',
    ];

    public curYear = new Date().getFullYear();
    public isCompanyTypeOne = true;
    public companyType;

    public levalmodalVisible = false;

    public percent = [];
    public ifdisabled = true;
    public staffLevalList = [];
    public commissionLadderList = [
        {
            lowerBoundary: null,
            upperBoundary: null
        },
        {
            lowerBoundary: null,
            upperBoundary: null
        },
        {
            lowerBoundary: null,
            upperBoundary: null
        },
        {
            lowerBoundary: null,
            upperBoundary: null
        },
        {
            lowerBoundary: null,
            upperBoundary: null
        },
        {
            lowerBoundary: null,
            upperBoundary: null
        }
    ];
    public staffLevel = {};

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public alertCtrl: AlertController,
        public service: ChartService
    ) {
        this.ifHotel = localStorage.getItem('company_type') == '1' ? true : false; //是否为酒店版,true为酒店版

        this.getStaffTargets();
        this.getStaffLevals();
        // setTimeout(() => {
        // 	this.initchart2();
        // 	console.log("为空，暂时进行延时处理，后期解决");
        // }, 300);

        this.companyType = localStorage.getItem('company_type');
        if (this.companyType == 1) {
            this.isCompanyTypeOne = false;
            // console.log(this.companyType);
        }
    }



    //获取销售目标
    getStaffTargets() {
        this.service.getSaleGoals(this.curYear).then(data => {
            if (data.status == 1) {
                this.target = data.target;
                this.staffTargetList = data.staff_target;
            } else {
                this.alertCtrl.create({
                    title: '程序处理出错，请稍后重试！',
                    buttons: ['OK']
                }).present();
            }
        })
    }

    //获取阶梯提成比例
    getStaffLevals() {
        this.service.getStaffLevals().then(data => {
            if (data.status == 1) {
                this.staffLevalList = data.staffLevelList;
                this.commissionLadderList = [];
                data.staffLevelCommissionLadder.map((value, index) => {
                    let tempObj = {
                        id: value.id,
                        lowerBoundary: parseFloat(value.lowerBoundary),
                        upperBoundary: parseFloat(value.upperBoundary),
                    }
                    this.commissionLadderList.push(tempObj);
                });
            } else {
                this.alertCtrl.create({
                    title: '程序处理出错，请稍后重试！',
                    buttons: ['OK']
                }).present();
            }
        })
    }


    //获取上一年数据
    getPreYear() {
        if (this.curYear >= 2019) {
            this.curYear = this.curYear - 1;
            this.getStaffTargets();
        }
    }
    //获取下一年数据
    getNextYear() {
        this.curYear = this.curYear + 1;
        this.getStaffTargets();
    }

    //开启目标设定弹窗
    editGoals() {
        this.modalVisible = true;
        this.modifyTarget = this.deepCopy(this.target);
        this.modifyStaffTargetList = [];
        this.staffTargetList.forEach(element => {
            this.modifyStaffTargetList.push(this.deepCopy(element));
        });
    }
    //隐藏目标设定弹窗
    hideModal() {
        this.modalVisible = false;
    }
    //提交目标设定
    formSubmit(form) {
        if (this.totalStaffTargetRate > 100 || this.totalStaffTargetRate < 0) {
            this.alertCtrl.create({
                title: '员工的目标分解率有误，请重新输入！',
                buttons: ['OK']
            }).present();
            return;
        } else if (this.totalStaffTargetRate != 100) {
            this.alertCtrl.create({
                title: '员工的目标分解和不为100！',
                buttons: ['OK']
            }).present();
            return;
        }
        form.total = this.totalTarget;
        form.year = this.curYear;
        this.modifyStaffTargetList.forEach(element => {
            element.target = this.totalTarget * element.target_rate / 100;
        });
        form.target_id = this.target.id;
        form.staffList = this.modifyStaffTargetList;
        this.service.modifySaleGoals(form).then(data => {
            if (data.status == 1) {
                this.target = this.modifyTarget;
                this.target.total = this.totalTarget;
                this.staffTargetList = this.modifyStaffTargetList;
                this.modalVisible = false;
                this.alertCtrl.create({
                    title: '目标设定修改成功！',
                    buttons: ['OK']
                }).present();
            } else {
                this.alertCtrl.create({
                    title: '程序处理出错，请稍后重试！',
                    buttons: ['OK']
                }).present();
            }
        })
    }

    initchart2() {
        let ec = echarts as any;

        let stafftargrts = document.getElementById('staffTarget');
        this.staffTargetchart = ec.init(stafftargrts);

        let xAxisData = [];
        let data = [];
        for (var i = 9; i < 16; i++) {
            xAxisData.push('5月' + i + '日');
            data.push(Math.round(Math.random() * 500) + 200);
        }

        let stafftoption = {
            backgroundColor: '#fff',
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'line',
                    lineStyle: {
                        opacity: 0
                    }
                },
                formatter: function (prams) {
                    return "额度:" + prams[0].data + "万元"
                }
            },
            xAxis: [{
                data: xAxisData,
                axisLabel: {
                    textStyle: {
                        color: '#444'
                    }
                },
                axisLine: {
                    show: false,
                },

                axisTick: {
                    show: false,
                    alignWithLabel: true
                },
                splitLine: {
                    show: false
                }
            }, {
                // 辅助 x 轴
                show: false,
                data: xAxisData
            }],
            yAxis: {
                max: 1000,
                axisTick: {
                    show: false
                },
                axisLine: {
                    show: false,
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: '#eee',
                    }
                },
            },
            series: [{
                // 辅助系列
                type: 'bar',
                silent: true,
                xAxisIndex: 1,
                itemStyle: {
                    normal: {
                        barBorderRadius: 20,
                        color: '#eee'
                    }
                },
                barWidth: 10,
                data: data.map(function (val) {
                    return 1000;
                })
            }, {
                type: 'bar',
                data: data,
                barWidth: 10,
                itemStyle: {
                    normal: {
                        barBorderRadius: 20,
                        color: '#f16f31',
                        shadowColor: 'rgba(0, 0, 0, 0.1)',
                        shadowBlur: 20
                    }
                }
            }]
        };
        this.staffTargetchart.setOption(stafftoption);

    }
    deepCopy(obj) {
        if (typeof obj != 'object') {
            return obj;
        }
        var newobj = {};
        for (var attr in obj) {
            newobj[attr] = this.deepCopy(obj[attr]);
        }
        return newobj;
    }
    parseInts(str) {
        return parseInt(str);
    }
    GetTotalTarget() {
        this.totalTarget = parseInt(this.modifyTarget.january) + parseInt(this.modifyTarget.february) + parseInt(this.modifyTarget.march) + parseInt(this.modifyTarget.april) + parseInt(this.modifyTarget.may) + parseInt(this.modifyTarget.june) + parseInt(this.modifyTarget.july) + parseInt(this.modifyTarget.august) + parseInt(this.modifyTarget.september) + parseInt(this.modifyTarget.october) + parseInt(this.modifyTarget.november) + parseInt(this.modifyTarget.december);
        if (this.totalTarget === NaN) {
            this.totalTarget = 0;
        }
        return this.totalTarget;
    }
    GetTotalStaffTargetRate() {
        this.totalStaffTargetRate = 0;
        this.modifyStaffTargetList.forEach(element => {
            this.totalStaffTargetRate += parseInt(element.target_rate);
        });
        return this.totalStaffTargetRate;
    }

    editLadder() {
        this.ifdisabled = false;
    }

    submiLadder() {
        let preValue = 0;
        let check = true;
        this.commissionLadderList.map((value) => {
            let upper = parseFloat(value.upperBoundary);
            let lower = parseFloat(value.lowerBoundary);
            if (upper < lower || lower < preValue || upper < 0 || lower < 0) {
                console.log("阶梯错误");
                check = false;
            } else {
                preValue = upper;
            }
        })

        if (check) {
            this.ifdisabled = true;
            let tempList = [];
            this.staffLevalList.map((value, index) => {
                for (let i = 0; i < value.commissionList.length; i++) {
                    tempList.push(
                        {
                            id: value.commissionList[i].id,
                            commission: value.commissionList[i].commission
                        }
                    );
                }
            });


            let query = {
                commissionLadderList: this.commissionLadderList,
                commissionList: tempList
            }
            this.service.submitStaffLevals(this.commissionLadderList, tempList).then(data => {
                if (data.status == 1) {
                    this.getStaffLevals();
                } else {
                    this.alertCtrl.create({
                        title: '程序处理出错，请稍后重试！',
                        buttons: ['OK']
                    }).present();
                }
            })
        } else {
            this.alertCtrl.create({
                title: '阶梯设置不合理！请重新设置',
                buttons: ['OK']
            }).present();
        }


    }

    setStaffRule(index) {
        this.levalmodalVisible = true;
        this.staffLevel = {
            id: this.staffLevalList[index].id,
            name: this.staffLevalList[index].name,
            salary: this.staffLevalList[index].salary,
            commission: this.staffLevalList[index].commission,
            upper: this.staffLevalList[index].upper,
            lower: this.staffLevalList[index].lower,
        }
    }

    hidelevelModal() {
        this.levalmodalVisible = false;
    }

    levelformSubmit(form) {
        this.service.editStaffLevel(this.staffLevel).then(data => {
            if (data.status == 1) {
                this.levalmodalVisible = false;
                this.getStaffLevals();
                this.alertCtrl.create({
                    title: '目标设定修改成功！',
                    buttons: ['OK']
                }).present();
            } else {
                this.alertCtrl.create({
                    title: '程序处理出错，请稍后重试！',
                    buttons: ['OK']
                }).present();
            }
        })
    }
}
