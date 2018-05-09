//index.js
//获取应用实例
var app = getApp()
var info = require('../../utils/js/info.js').info;
var tool = require('../../utils/js/tool.js').tool;
const ajaxResume = require('../../utils/service/ajaxResume.js').ajaxResume;
var util = require('../../utils/js/util.js');
var getGender = info.getGender();
getGender.shift();
var jobYear = [];
var mydate = new Date().getFullYear();
var month = new Date().getMonth();
var day = new Date().getDate();
for(var i = 0; i <= 50; i++) {
	jobYear.push({
		value: i ? (i + '年') : '应届毕业生',
		id: i
	});
}
const getCityList = info.getCityList();
Page({
	data: {
		title: '模版页',
		sexAll: getGender,
		yearAll: jobYear,
		eduAll: info.getEducation(),
		birthdayStart: ((mydate - 70) + '-' + (month + 1) + '-' + day),
		birthdayEnd: ((mydate - 18) + '-' + (month + 1) + '-' + day),
		cityArray: [getCityList, getCityList[0].childList],
		cityIndex: [0, 0],
		basicInfo: {
			name: '',
			sex: '',
			birthday: '',
			myJobYear: '',
			edu: '',
			cityIndex: ['', ''],
			email: '',
			telephone: '',
		}
	},
	nameChange(e) {
		let key = 'basicInfo.name';
		this.setData({
			[key]: e.detail.value
		})
	},
	bindSexChange(e) {
		let key = 'basicInfo.sex';
		this.setData({
			[key]: e.detail.value
		})
	},
	bindBirthdayChange(e) {
		if(e.detail.value.split('-')[0] < mydate) {
			let key = 'basicInfo.birthday';
			this.setData({
				[key]: e.detail.value
			})
		}
	},
	bindJobYearChange(e) {
		let key = 'basicInfo.myJobYear';
		this.setData({
			[key]: e.detail.value
		})
	},
	bindEduChange(e) {
		let key = 'basicInfo.edu';
		this.setData({
			[key]: e.detail.value
		})
	},
	bindMultiPickerChange(e) {
		//		console.log('picker发送选择改变，携带值为', e.detail.value)
		let key = 'basicInfo.cityIndex';
		this.setData({
			[key]: e.detail.value
		})
	},
	bindMultiPickerColumnChange(e) {
		//		console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
		var data = {
			cityArray: this.data.cityArray,
			cityIndex: this.data.basicInfo.cityIndex
		};
		data.cityIndex[e.detail.column] = e.detail.value;
		switch(e.detail.column) {
			case 0:
				data.cityArray[1] = data.cityArray[e.detail.column][e.detail.value].childList;
				//				data.cityArray[2] = data.cityArray[e.detail.column][e.detail.value].childList[0].childList;
				data.cityIndex[1] = 0;
				//				data.cityIndex[2] = 0;
				//			console.log(data.cityIndex);
				break;
		}
		this.setData(data);
	},
	emailChange(e) {
		let key = 'basicInfo.email';
		this.setData({
			[key]: e.detail.value
		})
	},
	telephoneChange(e) {
		let key = 'basicInfo.telephone';
		this.setData({
			[key]: e.detail.value
		})
	},
	basicSubmit(e) {
		if(!this._checkBasi(e.detail.value)) return
		const data = e.detail.value
		const config = {
			name: data.name,
			sex: this.data.sexAll[data.sex].id,
			birthYear: data.birthday,
			participate_year: this.data.yearAll[data.myJobYear].id,
			education: this.data.eduAll[data.edu].id,
			province: this.data.cityArray[0][data.cityIndex[0]].id,
			city: this.data.cityArray[1][data.cityIndex[1]].id,
			telephone: data.telephone,
			email: data.email
		}
		
		//职位信息变更接口
		ajaxResume.addBaseInfo(config,res=>{
			if(res.code!=200){
				tool.showToastText(res.message,res.code==200)
			}else{
				tool.showToastText(res.message,res.code==200)
			}
			console.log(res);
		})
	},
	_checkBasi(data) {
		if(!data.name) {
			tool.showToastText('请填写姓名');
			return false
		} else if(!data.sex) {
			tool.showToastText('请选择性别');
			return false
		} else if(!data.birthday||data.birthday.split('-')[0] == mydate) {
			tool.showToastText('请选择出生日期');
			return false
		} else if(!data.myJobYear) {
			tool.showToastText('请选择工作年限');
			return false
		} else if(!data.edu) {
			tool.showToastText('请选择学历');
			return false
		} else if(data.cityIndex[0]==='') {
			tool.showToastText('请选择现居地');
			return false
		} else if(!tool.verifyEmail(data.email).flag) {
			tool.showToastText(tool.verifyEmail(data.email).message);
			return false
		} else if(!tool.verifyMobile(data.telephone).flag) {
			tool.showToastText(tool.verifyMobile(data.telephone).message);
			return false
		}
		return true
	},
})