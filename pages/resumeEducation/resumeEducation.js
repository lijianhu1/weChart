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
		title: '教育经历',
		eduAll: info.getEducation(),
		startTime: (mydate-50 + '-' + (month + 1) + '-' + day),
		endTime:(mydate + '-' + (month + 1) + '-' + day),
		startTimes:(mydate-50 + '-' + (month + 1) + '-' + day),
		endTimes: (mydate + '-' + (month + 1) + '-' + day),
		formInfo: {
			schoolName: '',
			specialty: '',
			education: '',
			startTime: '',
			endTime: ''
		},
		formStartTime:(mydate + '-' + (month + 1) + '-' + day),
		formEndTime:(mydate + '-' + (month + 1) + '-' + day),
	  	isStep:''
	},
	//页面显示时执行
	onLoad(e) {
		this.setData({
		  isStep:e.isStep
		})
		if(e.id) {
			const config = {
				id: e.id,
				type: 2
			}
			ajaxResume.getExperience(config, res => {
				res.resultMap[0].education = tool._match('edu', res.resultMap[0].education, true) + ''
				this.setData({
					formInfo: res.resultMap[0],
					formStartTime:res.resultMap[0].startTime,
					formEndTime:res.resultMap[0].endTime,
					itemId: e.id
				})
			})
		}
		if(e.listlength){
			this.setData({
				listlength:e.listlength,
				perfect:e.perfect
			})
		}
	},
	//学历选中后执行
	bindEduChange(e) {
		let key = 'formInfo.education';
		this.setData({
			[key]: e.detail.value
		})
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
	//表单信息提交
	formSubmit(e) {
		if(!this._checkForm(e.detail.value)) return
		const data = e.detail.value
		const config = {
			schoolName: data.schoolName,
			specialty: data.specialty,
			education: this.data.eduAll[data.education].id,
			startTime: this.data.formInfo.startTime,
			endTime: this.data.formInfo.endTime,
          	isStep:this.data.isStep
		}
		if(this.data.itemId) {
			config.id = this.data.itemId;
		}
		//职位信息变更接口
		ajaxResume.addEducations(config, res => {
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
		let message = '是否确认删除该教育经历';
		if(this.data.perfect>=80&&this.data.listlength==1){
			message = '删除该教育经历后您的简历完善度将低于80%，我们将自动下线您的简历，是否确认？';
		}
		wx.showModal({
			content: message,
			confirmText: "确定",
			cancelText: "取消",
			success: (e) => {
				if(e.confirm){
					const config = {
						id: this.data.itemId,
						type: 2
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
			}
		})
	},
	//提交信息验证
	_checkForm(data) {
		if(!data.schoolName) {
			tool.showToastText('请填写学校名称');
			return false
		} else if(!data.specialty) {
			tool.showToastText('请填写所学专业');
			return false
		} else if(!data.education) {
			tool.showToastText('请选择学历');
			return false
		} else if(!this.data.formInfo.startTime) {
			tool.showToastText('请选择开始时间');
			return false
		} else if(!this.data.formInfo.endTime) {
			tool.showToastText('请选择结束时间');
			return false
		}
		return true
	},
})