//index.js
//获取应用实例
var app = getApp()
var info = require('../../utils/js/info.js').info;
var tool = require('../../utils/js/tool.js').tool;
const ajaxResume = require('../../utils/service/ajaxResume.js').ajaxResume;
var util = require('../../utils/js/util.js');
Page({
	data: {
		title: '掌握技能',
		num: 0,
		getProficiency: info.getProficiency(),
		formInfo: {
			skillName: '',
			masterDegree: ''
		},
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
				type: 3
			}
			ajaxResume.getExperience(config, res => {
				res.resultMap[0].masterDegree = tool._match('master', res.resultMap[0].masterDegree, true) + ''
				this.setData({
					formInfo: res.resultMap[0],
					itemId: e.id
				})
			})
		}
	},
	//熟练度选中后执行
	masterDegreeChange(e) {
		let key = 'formInfo.masterDegree';
		this.setData({
			[key]: e.detail.value,
		})
	},
	//表单信息提交
	formSubmit(e) {
		if(!this._checkForm(e.detail.value)) return
		const data = e.detail.value
		const config = {
			skillName: data.skillName,
			masterDegree: this.data.getProficiency[data.masterDegree].id,
          	isStep:this.data.isStep
		}
		if(this.data.itemId) {
			config.id = this.data.itemId;
		}
		//职位信息变更接口
		ajaxResume.addProfeskills(config, res => {
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
			content: "是否确认删除该掌握技能",
			confirmText: "确定",
			cancelText: "取消",
			success: (e) => {
				if(e.confirm) {
					const config = {
						id: this.data.itemId,
						type: 3
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
		if(!data.skillName) {
			tool.showToastText('请填写技能名称');
			return false
		} else if(!data.masterDegree) {
			tool.showToastText('请选择熟练程度');
			return false
		}
		return true
	},
})