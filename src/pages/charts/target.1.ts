import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import * as echarts from 'echarts';


@Component({
	selector: 'page-target',
	templateUrl: 'target.html',
})

export class targetChartPage {

	public modalVisible = false;
	public staffTargetchart;

	public staffTergetlists = [];

	public curYear = new Date().getFullYear();

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
	) {
		this.getStaffTargets();
		setTimeout(() => {
			this.initchart2();
			console.log("为空，暂时进行延时处理，后期解决");
		}, 300);
	}


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



	editGoals() {
		this.modalVisible = true;
		// this.getGoals();
	}

	hideModal() {
		this.modalVisible = false;
	}

	formSubmit(form) {
		console.log(form);
	}

	getPreYear() {
		this.curYear = this.curYear - 1;
		console.log(this.curYear);
	}

	getNextYear() {
		this.curYear = this.curYear + 1;
		console.log(this.curYear);
	}
}
