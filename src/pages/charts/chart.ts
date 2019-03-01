import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import * as echarts from 'echarts';
import { ChartService } from '../../providers/chart';


@Component({
	selector: 'page-chart',
	templateUrl: 'chart.html',
	providers: [ChartService]
})
export class ChartPage {

	public chatmemu = "sales";

	public targetschart;
	public achievementschart;
	public staffchart;
	public staffTargetchart;

	public chartYear = '2018';
	public staff = 0;
	public client = 0;

	public clientlists = [];
	public staffTergetlists = [];

	public curYear = new Date().getFullYear();

	public modalVisible = false;
	public placeForm = {};
	public orderlist = [];

	public pricelists = [];


	public proList = [
		{
			progress: 80,
			name: '奚小鱼'
		},
		{
			progress: 70,
			name: '奚小鱼'
		},
		{
			progress: 60,
			name: '奚小鱼'
		},
		{
			progress: 50,
			name: '奚小鱼'
		},
		{
			progress: 40,
			name: '奚小鱼'
		},
	]


	public ifAssign = false;  // 业绩分配Modal

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public service: ChartService,
	) {
		// console.log(this.chart);

	}

	ionViewDidEnter() {
		this.initchart();

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

	initchart() {
		let ec = echarts as any;

		// 目标达成率图表
		let targets = document.getElementById('target1');
		this.targetschart = ec.init(targets);
		var percent = 0.7;
		let targetoption = {
			backgroundColor: 'transparent',
			title: {
				// text: (percent * 100) + '%',
				text: (percent * 100),
				x: 'center',
				y: '35%',
				textStyle: {
					color: '#f17324',
					fontWeight: 'bolder',
					fontSize: 18,
				},
				subtext: 'out of 14',
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
		this.staffchart.setOption(stafftoption);
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

	setmemu(name) {
		this.chatmemu = name;
		console.log(this.chatmemu);
		if (name == 'sales') {
			setTimeout(() => {
				this.initchart();
				console.log("为空，暂时进行延时处理，后期解决");
			}, 300);
		} else if (name == 'clients') {
			console.log();
			this.getClients();
		} else if (name == 'goals') {
			this.getStaffTargets();
			setTimeout(() => {
				this.initchart2();
				console.log("为空，暂时进行延时处理，后期解决");
			}, 300);
		} else if(name == 'finance'){
			this.getPricelists();
			console.log(this.pricelists);

		}
	}

	//客户信息
	getClients() {
		this.clientlists = [
			{
				name: '北京浩瀚一方网络科技有限责任公司',
				price: 1998,
				orders: 10
			},
			{
				name: '北京浩瀚一方网络科技有限责任公司',
				price: 1998,
				orders: 10
			},
			{
				name: '北京浩瀚一方网络科技有限责任公司',
				price: 1998,
				orders: 10
			},
			{
				name: '北京浩瀚一方网络科技有限责任公司',
				price: 1998,
				orders: 10
			},
			{
				name: '北京浩瀚一方网络科技有限责任公司',
				price: 1998,
				orders: 10
			},
			{
				name: '北京浩瀚一方网络科技有限责任公司',
				price: 1998,
				orders: 10
			},
			{
				name: '北京浩瀚一方网络科技有限责任公司',
				price: 1998,
				orders: 10
			}
		]
	}
	//客户信息
	getStaffTargets() {
		this.staffTergetlists = [
			{
				name: '北京浩瀚一方',
				target: 1998,
				achieve: 1000,
				rate: 60
			},
			{
				name: '北京浩瀚一方',
				target: 1998,
				achieve: 1000,
				rate: 60
			},
			{
				name: '北京浩瀚一方',
				target: 1998,
				achieve: 1000,
				rate: 60
			},
			{
				name: '北京浩瀚一方',
				target: 1998,
				achieve: 1000,
				rate: 60
			},
			{
				name: '北京浩瀚一方',
				target: 1998,
				achieve: 1000,
				rate: 60
			},
			{
				name: '北京浩瀚一方',
				target: 1998,
				achieve: 1000,
				rate: 60
			},
		]
	}

	getPreYear() {
		this.curYear = this.curYear - 1;
		console.log(this.curYear);
	}

	getNextYear() {
		this.curYear = this.curYear + 1;
		console.log(this.curYear);
	}


	getPricelists() {
		alert(1);
		this.pricelists = [
			{
				name: "2018-9-10王小红",
				cost: "889495",
				back: "889495",
				first: "889495",
				middle: "889495",
				final: "889495",
				total: "889495",
				profit: "889495",
			},
			{
				name: "2018-9-10王小红",
				cost: "889495",
				back: "889495",
				first: "889495",
				middle: "889495",
				final: "889495",
				total: "889495",
				profit: "889495",
			},
			{
				name: "2018-9-10王小红",
				cost: "889495",
				back: "889495",
				first: "889495",
				middle: "889495",
				final: "889495",
				total: "889495",
				profit: "889495",
			},
			{
				name: "2018-9-10王小红",
				cost: "889495",
				back: "889495",
				first: "889495",
				middle: "889495",
				final: "889495",
				total: "889495",
				profit: "889495",
			},
		];
	}

	editGoals() {
		this.modalVisible = true;
		// this.getGoals();
	}

	hideModal() {
		this.modalVisible = false;
		console.log('!!!')
	}

	formSubmit(form) {
		console.log(form);
	}
	showAssign(id){
		this.ifAssign = true;
	}

}
