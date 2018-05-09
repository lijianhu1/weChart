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
let getSalary = info.getSalary();
getSalary[0].value = "保密";
getSalary.pop();
Page({
	data: {
		title: '工作经历',
		salaryArr: getSalary,
		startTime: (mydate-50 + '-' + (month + 1) + '-' + day),
		endTime:(mydate + '-' + (month + 1) + '-' + day),
		// startTimes:(mydate-50 + '-' + (month + 1) + '-' + day),
		// endTimes: (mydate + '-' + (month + 1) + '-' + day),
		num: 0,
		itemId: 0,
		formInfo: {
			compName: '',
			jobTitle: '',
			salary: '',
			startTime: '',
			endTime: '',
			workDesc: ''
		},
		formStartTime:(mydate + '-' + (month + 1) + '-' + day),
		formEndTime:(mydate + '-' + (month + 1) + '-' + day),
	  	isStep:'',
      	jobYear:''
	},
	//页面显示时执行
	onLoad(e) {
		this.setData({
          isStep:e.isStep,
		  jobYear:e.jobYear?e.jobYear:''
		});
		console.log(this.data.jobYear)
		if(e.id) {
			const config = {
				id: e.id,
				type: 0
			}
			ajaxResume.getExperience(config, res => {
				res.resultMap[0].salary = tool._match('salary', res.resultMap[0].salary, true) + '';
				this.setData({
					formInfo: res.resultMap[0],
					formStartTime:res.resultMap[0].startTime,
					formEndTime:res.resultMap[0].endTime,
					num:res.resultMap[0].workDesc?res.resultMap[0].workDesc.length:0,
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
	//薪资选中后执行
	bindSalaryChange(e) {
		let key = 'formInfo.salary';
		this.setData({
			[key]: e.detail.value
		})
	},
	/*开始时间选中后执行*/
	bindStartChange(e) {
		let key = 'formInfo.startTime';
		this.setData({
			[key]: e.detail.value,
			startTime: e.detail.value,
			formStartTime:e.detail.value
		})
	},
	/*结束时间选中后执行*/
	bindEndChange(e) {
		let key = 'formInfo.endTime';
		this.setData({
			[key]: e.detail.value,
			endTime: e.detail.value,
			formEndTime:e.detail.value
		})
	},
	//工作内容输入时执行
	workDescInput(e) {
		this.setData({
			num: e.detail.value.length
		})
	},
	//表单信息提交
	formSubmit(e) {
		if(!this._checkForm(e.detail.value)) return
		const data = e.detail.value
		const config = {
			compName: data.compName,
			jobTitle: data.jobTitle,
			salary: this.data.salaryArr[data.salary].id,
			startTime: this.data.formInfo.startTime,
			endTime: this.data.formInfo.endTime,
			workDesc: data.workDesc,
          	isStep:this.data.isStep
		}
		if(this.data.itemId) {
			config.id = this.data.itemId;
		}
		//职位信息变更接口
		ajaxResume.addWorkExperiences(config, res => {
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
		let message = '是否确认删除该工作经历';
		if(this.data.perfect>=80&&this.data.listlength==1&&this.data.jobYear!='应届毕业生'){
			message = '删除该工作经历后您的简历完善度将低于80%，我们将自动下线您的简历，是否确认？';
		}
//		let Listlength,perfect
		wx.showModal({
			content: message,
			confirmText: "确定",
			cancelText: "取消",
			success: (e) => {
				if(e.confirm){
					const config = {
						id: this.data.itemId,
						type: 0
					};
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
		if(!data.compName) {
			tool.showToastText('请填写公司名称');
			return false
		} else if(!data.jobTitle) {
			tool.showToastText('请填写担任职位');
			return false
		} else if(!data.salary) {
			tool.showToastText('请选择工作薪资');
			return false
		} else if(!this.data.formInfo.startTime) {
			tool.showToastText('请选择入职时间');
			return false
		} else if(!this.data.formInfo.endTime) {
			tool.showToastText('请选择离职时间');
			return false
		} else if(!data.workDesc) {
			tool.showToastText('请填写工作描述');
			return false
		}
		return true
	},
})