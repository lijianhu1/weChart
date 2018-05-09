//index.js
//获取应用实例
var app = getApp()
var info = require('../../utils/js/info.js').info;
var tool = require('../../utils/js/tool.js').tool;
const ajaxResume = require('../../utils/service/ajaxResume.js').ajaxResume;
var util = require('../../utils/js/util.js');
var jobYear = [];
var mydate = new Date().getFullYear();
var month = new Date().getMonth();
var day = new Date().getDate();
Page({
	data: {
		title: '项目经历',
		startTime: (mydate-50 + '-' + (month + 1) + '-' + day),
		endTime:(mydate + '-' + (month + 1) + '-' + day),
		startTimes:(mydate-50 + '-' + (month + 1) + '-' + day),
		endTimes: (mydate + '-' + (month + 1) + '-' + day),
		num:0,
		formInfo: {
			projectName: '',
			startTime: '',
			endTime: '',
			projectDesc:'',
			projectUrl :'',
		},
		formStartTime:(mydate + '-' + (month + 1) + '-' + day),
		formEndTime:(mydate + '-' + (month + 1) + '-' + day),
	  isStep:''
	},
	//页面显示时执行
	onLoad(e) {
		this.setData({
		  isStep:e.isStep
		});
		if(e.id) {
			const config = {
				id: e.id,
				type: 1
			}
			ajaxResume.getExperience(config, res => {
				this.setData({
					formInfo: res.resultMap[0],
					formStartTime:res.resultMap[0].startTime,
					formEndTime:res.resultMap[0].endTime,
					num:res.resultMap[0].projectDesc?res.resultMap[0].projectDesc.length:0,
					itemId: e.id
				})
			})
		}
	},
	/*开始时间选中后执行*/
	bindStartChange(e) {
		let key = 'formInfo.startTime';
		this.setData({
			[key]: e.detail.value,
			startTime:e.detail.value,
			formStartTime:e.detail.value
		})
	},
	/*结束时间选中后执行*/
	bindEndChange(e) {
		let key = 'formInfo.endTime';
		this.setData({
			[key]: e.detail.value,
			endTime:e.detail.value,
			formEndTime:e.detail.value
		})
	},
	//项目内容输入时执行
	projectDescInput(e){
		this.setData({
			num:e.detail.value.length
		})
	},
	//表单信息提交
	formSubmit(e) {
		if(!this._checkForm(e.detail.value)) return
		const data = e.detail.value
		const config = {
			projectName: data.projectName,
			startTime: this.data.formInfo.startTime,
			endTime: this.data.formInfo.endTime,
			projectDesc: data.projectDesc,
			projectUrl: data.projectUrl,
		  	isStep:this.data.isStep
		}
		if(this.data.itemId) {
			config.id = this.data.itemId;
		}
		//职位信息变更接口
		ajaxResume.addProjects(config, res => {
			if(res.code == 200) {
				setTimeout(function() {
					wx.navigateBack()
				}, 1000)
			}
			tool.showToastText(res.message, res.code == 200)
		})
	},
	//经历信息删除
	formDelete(e) {
		wx.showModal({
			content: "是否确认删除该项目经历",
			confirmText: "确定",
			cancelText: "取消",
			success: (e) => {
				const config = {
					id: this.data.itemId,
					type: 1
				}
				ajaxResume.experienceDelete(config, res => {
					if(res.code == 200) {
						setTimeout(function() {
							wx.navigateBack()
						}, 1000)
					}
					tool.showToastText(res.message, res.code == 200)
				})
			}
		})
	},
	//提交信息验证
	_checkForm(data) {
		if(!data.projectName) {
			tool.showToastText('请填写项目名称');
			return false
		} else if(!this.data.formInfo.startTime) {
			tool.showToastText('请选择开始时间');
			return false
		} else if(!this.data.formInfo.endTime) {
			tool.showToastText('请选择结束时间');
			return false
		} else if(!data.projectDesc) {
			tool.showToastText('请填写项目内容');
			return false
		}
		if(data.projectUrl){
			if(!tool.verifyWebsite(data.projectUrl).flag){
				tool.showToastText(tool.verifyWebsite(data.projectUrl).message);
				return false
			}
		}
		return true
	},
})