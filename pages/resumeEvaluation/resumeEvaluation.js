//index.js
//获取应用实例
var app = getApp()
var tool = require('../../utils/js/tool.js').tool;
var util = require('../../utils/js/util.js');
const ajaxResume = require('../../utils/service/ajaxResume.js').ajaxResume;
Page({
	data: {
		title: '自我评价',
		num:0,
		formInfo: {
			selfEvaluate:''
		},
	  isStep:''
	},
	//页面显示时执行
	onLoad(e){
      this.setData({
        isStep:e.isStep
      });
		ajaxResume.getResumeDeatil({},res => {
			if(res.code == 200) {
				let key = 'formInfo.selfEvaluate'
				this.setData({
					num:res.resume.selfEvaluate?res.resume.selfEvaluate.length:0,
					[key]:res.resume.selfEvaluate||''
				})
			}
		})
	},
	//自我评价输入时执行
	selfEvaluateInput(e){
		this.setData({
			num:e.detail.value.length
		})
	},
	//表单信息提交
	formSubmit(e) {
		if(!this._checkForm(e.detail.value)) return
		const data = e.detail.value
		const config = {
			selfEvaluate: data.selfEvaluate,
			type:1,
		  	isStep:this.data.isStep
		}
		//职位信息变更接口
		ajaxResume.updateSelfEvaluate(config, res => {
			if(res.code == 200) {
				setTimeout(function() {
					wx.navigateBack()
				}, 1000)
			}
		})
	},
	//提交信息验证
	_checkForm(data) {
		if(!data.selfEvaluate) {
			tool.showToastText('请填写自我评价');
			return false
		}
		return true
	},
})