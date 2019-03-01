import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import * as echarts from 'echarts';
import { ChartService } from '../../providers/chart';


@Component({
	selector: 'page-salechart',
	templateUrl: 'salechart.html',
	providers: [ChartService]
})

export class saleChartPage {

	public targetschart;
	public staffchart;

	public staff = 0;
	public curYear = new Date().getFullYear();
	public curMonth = new Date().getMonth();
	public total_sale;
	public x_Data;
	public month_data;
	public max_y;
	public cur_month_sale;
	public account_target;
	public rate;
	public rate_text;

	public pet = 'sales';

	public proList = []

	public modalVisible = false;

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public service: ChartService,
	) {
		var account_id=this.getQueryString("account_id");
		var token=this.getQueryString("token");
		if(account_id!=null){
			window.localStorage.setItem("account_id",account_id);
		}
		if(token!=null){
			window.localStorage.setItem("token",token);
		}
		this.init();
	}

	//初始渲染
	init(){
		let query = {
			account_id : localStorage.getItem('account_id'),
			staff_id : 0,
			type : 'sales',
			year : this.curYear,
		}
		this.service.getSaleData(query).then(data => {
			if (data.status == 1) {
				this.proList = data.arr_staff_sales;
				this.total_sale = data.hotel_total_sales;
				this.x_Data = data.x_Data;
				this.month_data = data.month_data;
				this.max_y = data.max_y;
				this.cur_month_sale = data.cur_month_sale;
				this.account_target = data.account_target;
				this.rate = data.rate;
				this.rate_text = data.rate_text;
				this.initchart();
			}
		});
	}
	 getQueryString(name) {
		var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
		var r = window.location.href.substr(1).match(reg);
		if (r != null) {
			// return unescape(r[2]);
		}
		return null;
	  }

	//渲染销售表格
	getXY(){
		let query = {
			account_id : localStorage.getItem('account_id'),
			staff_id : this.staff,
			type : this.pet,
			year : this.curYear,
		}
		this.service.getSaleData(query).then(data => {
			if (data.status == 1) {
				this.x_Data = data.x_Data;
				this.month_data = data.month_data;
				this.max_y = data.max_y;
				this.initchart();
			}
		});
	}

	// ionViewDidEnter() {
	// 	// this.initchart();
	// 	setTimeout(() => {
	// 		this.initchart();
	// 		console.log("为空，暂时进行延时处理，后期解决");
	// 	}, 300);
	// }


	initchart() {
		let ec = echarts as any;

		// 目标达成率图表
		let targets = document.getElementById('target1');
		this.targetschart = ec.init(targets);
		var percent = this.rate;
		let targetoption = {
			backgroundColor: 'transparent',
			title: {
				// text: (percent * 100) + '%',
				text: (this.rate_text) + "%",
				x: 'center',
				y: '35%',
				textStyle: {
					color: '#f17324',
					fontWeight: 'bolder',
					fontSize: 18,
				},
				subtext: '目标完成率',
				subtextStyle: {
					fontSize: 14,
					color: '#aaa'
				}
			},
			legend: {
				x: 'center',
				y: 'bottom',
				data: ['complete', 'cancel'],
				textStyle: {
					color: '#fff'
				},
				selectedMode: true,
				orient: "vertical",
			},
			series: [{
				type: 'pie',
				radius: ['80%', '90%'],
				silent: true,
				label: {
					normal: {
						show: false,
					}
				},
				data: [{
					value: 1,
					itemStyle: {
						normal: {
							color: '#e7e7e7',
							// shadowBlur: 10,
							// shadowColor: '#1b1e25',
						}
					}
				}],
				animation: false
			},
			{
				name: 'main',
				type: 'pie',
				radius: ['80%', '90%'],
				label: {
					normal: {
						// color: '#ff0000',
						show: false,
					}
				},
				data: this.getData(percent),

				animationEasingUpdate: 'cubicInOut',
				animationDurationUpdate: 500
			}
			]
		};
		this.targetschart.setOption(targetoption);


		//销售目标图表
		let staffs = document.getElementById('staff');
		this.staffchart = ec.init(staffs);
		let xAxisData = this.x_Data;
		let data = this.month_data;
		let max_y = this.max_y;
		// for (var i = 1; i < 13; i++) {
		// 	xAxisData.push(i+ '月');
		// 	data.push(this.month_data[i]);
		// }

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
					return prams[0].data
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
				max: max_y,
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
			series: [
				{
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
						return val;
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
		this.staffchart.setOption(stafftoption);
	}

	getData(percent) {
		return [{
			value: percent,
			itemStyle: {
				normal: {
					color: '#f17324',
					// shadowBlur: 10,
					// shadowColor: '#fb358a'
				}
			}
		}, {
			value: 1 - percent,
			itemStyle: {
				normal: {
					color: 'transparent'
				}
			}
		}];
	}

	getPreYear() {
		this.curYear = this.curYear - 1;
		this.getXY();
	}

	getNextYear() {
		this.curYear = this.curYear + 1;
		this.getXY();
	}

}
