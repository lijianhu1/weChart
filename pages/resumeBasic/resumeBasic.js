//index.js
//获取应用实例
var app = getApp()
var info = require('../../utils/js/info.js').info;
var tool = require('../../utils/js/tool.js').tool;
const ajaxResume = require('../../utils/service/ajaxResume.js').ajaxResume;
var util = require('../../utils/js/util.js');
var getGender = info.getGender();
getGender.shift();
let getEducation = info.getEducation()
getEducation.shift();
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
		title: '基本信息',
		sexAll: getGender,
		yearAll: jobYear,
		eduAll: getEducation,
		birthdayStart: ((mydate - 70) + '-' + (month + 1) + '-' + day),
		birthdayEnd: ((mydate - 18) + '-' + (month + 1) + '-' + day),
		formBirthday: ((mydate - 18) + '-' + (month + 1) + '-' + day),
		cityArray: [getCityList, getCityList[0].childList, getCityList[0].childList[0].childList],
		cityIndex: [0, 0, 0],
		basicInfo: {
			name: '',
			sex: '',
			birthday: '',
			myJobYear: '',
			edu: '',
			cityIndex: ['', '', ''],
			email: '',
			telephone: '',
		},
		cityName:'',
		sexPickerModel:false,
		sexModalIndex:0,
      	isStep:''
	},
	//页面加载时执行
	onLoad(e) {
		//职位信息变更接口
	  this.setData({
        isStep:e.isStep
	  });
		ajaxResume.getResumeDeatil({},res => {
			if(res.code == 200) {
				let cityIndex = ['', '', ''];
				const cityArray = [
					[],
					[],
					[]
				];
				const cityArr = [];
				cityArray[0] = getCityList;
				for(let i in getCityList) {
					if(!parseInt(res.resume.province) || res.resume.province == getCityList[i].id) {
						cityIndex[0] = i
						cityArr.push(cityArray[0][cityIndex[0]].value)
						cityArray[1] = getCityList[i].childList;
						for(let j in getCityList[i].childList) {
							if(!parseInt(res.resume.citySuperId) || res.resume.city == getCityList[i].childList[j].id || res.resume.citySuperId == getCityList[i].childList[j].id) {
								cityIndex[1] = j;
								cityArr.push(cityArray[1][cityIndex[1]].value)
								cityArray[2] = getCityList[i].childList[j].childList;
								for(let c in getCityList[i].childList[j].childList) {
									if(res.resume.city == getCityList[i].childList[j].childList[c].id) {
										cityIndex[2] = c;
										cityArr.push(cityArray[2][cityIndex[2]].value)
										break
									}
								}
								break
							}
						}
						break
					}
				}
				let cityName = [];
				if(parseInt(res.resume.province)) {
					for(let i in cityArr) {
						if(!cityName.length || cityName[cityName.length - 1] != cityArr[i]) {
							cityName.push(cityArr[i])
						}
					}
				}
				let name = 'basicInfo.name';
				let sex = 'basicInfo.sex';
				let birthday = 'basicInfo.birthday';
				let edu = 'basicInfo.edu';
				let myJobYear = 'basicInfo.myJobYear';
				let province = 'basicInfo.province';
				let cityIndexKey = ['basicInfo.cityIndex'];
				let email = 'basicInfo.email';
				let telephone = 'basicInfo.telephone';
				this.setData({
					[name]: res.resume.name,
					[sex]: tool._match('sex', res.resume.sex, true) - 1 + '',
					[birthday]: res.resume.birthYear || '' + '',
					[myJobYear]: res.resume.jobYear + '',
					[edu]: res.resume.education ? tool._match('edu', res.resume.education, true) - 1 + '' : '',
					[email]: res.resume.email,
					[telephone]: res.resume.telephone,
					[cityIndexKey]: cityIndex,
					cityArray: cityArray,
					cityName: cityName.join('，'),
					paytyper: res.paytyper
				})
			} else {
				tool.showToastText(res.message, res.code == 200)
			}
		})
	},
	//	sexModelToggle(){
	//		this.setData({
	//			sexPickerModel:!this.data.sexPickerModel
	//		})
	//	},
	//	bindSexModalChange(e){
	//		this.setData({
	//			sexModalIndex:e.detail.value[0]
	//		})
	//	},
	//	bindSexChange(e) {
	//		this.sexModelToggle()
	//		setTimeout(() => {
	//			let key = 'basicInfo.sex';
	//			this.setData({
	//				[key]: this.data.sexModalIndex
	//			})
	//		},500)
	//	},
	//性别选中后执行
	bindSexChange(e) {
		let key = 'basicInfo.sex';
		this.setData({
			[key]: e.detail.value
		})
	},
	//出生日期选中后执行
	bindBirthdayChange(e) {
		if(e.detail.value.split('-')[0] < mydate) {
			let key = 'basicInfo.birthday';
			this.setData({
				[key]: e.detail.value,
				formStartTime: e.detail.value
			})
		}
	},
	//工作经验选中后执行
	bindJobYearChange(e) {
		let key = 'basicInfo.myJobYear';
		this.setData({
			[key]: e.detail.value
		})
	},
	//学历选中后执行
	bindEduChange(e) {
		let key = 'basicInfo.edu';
		this.setData({
			[key]: e.detail.value
		})
	},
	//现居地选中后执行
	bindMultiPickerChange(e) {
		//		console.log('picker发送选择改变，携带值为', e.detail.value)
		const cityArr = [
			this.data.cityArray[0][e.detail.value[0]].value,
			this.data.cityArray[1][e.detail.value[1]].value,
			this.data.cityArray[2][e.detail.value[2]].value
		];
		let cityName = [];
		for(let i in cityArr) {
			if(!cityName.length || cityName[cityName.length - 1] != cityArr[i]) {
				cityName.push(cityArr[i])
			}
		}
		let key = 'basicInfo.cityIndex';
		this.setData({
			[key]: e.detail.value,
			cityName: cityName.join('，')
		})
	},
	//现居地一二级选中后执行
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
				data.cityArray[2] = data.cityArray[e.detail.column][e.detail.value].childList[0].childList;
				data.cityIndex[1] = 0;
				data.cityIndex[2] = 0;
				break;
			case 1:
				data.cityArray[2] = data.cityArray[e.detail.column][e.detail.value].childList;
				data.cityIndex[2] = 0;
				break;
			default:
				break;
		}
		this.setData(data);
	},
	//基本信息提交
	basicSubmit(e) {
		if(!this._checkForm(e.detail.value)) return
		const data = e.detail.value
		const config = {
			name: data.name,
			sex: this.data.sexAll[data.sex].id,
			birthYear: this.data.basicInfo.birthday,
			jobYear: this.data.yearAll[data.myJobYear].id,
			education: this.data.eduAll[data.edu].id,
			province: this.data.cityArray[0][data.cityIndex[0]].id,
			citySuperId: this.data.cityArray[1][data.cityIndex[1]].id,
			city: this.data.cityArray[2][data.cityIndex[2]].id,
			//			telephone: data.telephone,
			email: data.email,
			paytyper: this.data.paytyper,
          	isStep:this.data.isStep
		}
		//职位信息变更接口
		ajaxResume.addBaseInfo(config, res => {
			if(res.code == 200) {
				setTimeout(function() {
					wx.navigateBack()
				}, 1000)
			}
			tool.showToastText(res.message, res.code == 200)
		})
	},
	/*基本信息验证*/
	_checkForm(data) {
		if(!data.name) {
			tool.showToastText('请输入姓名');
			return false
		} else if(!data.sex) {
			tool.showToastText('请选择性别');
			return false
		} else if(!this.data.basicInfo.birthday || this.data.basicInfo.birthday.split('-')[0] == mydate) {
			tool.showToastText('请选择出生日期');
			return false
		} else if(!data.myJobYear) {
			tool.showToastText('请选择工作年限');
			return false
		} else if(!data.edu) {
			tool.showToastText('请选择学历');
			return false
		} else if(data.cityIndex[0] === '') {
			tool.showToastText('请选择现居地');
			return false
		} else if(!tool.verifyEmail(data.email).flag) {
			tool.showToastText(tool.verifyEmail(data.email).message);
			return false
		}
		/* else if(!tool.verifyMobile(data.telephone).flag) {
					tool.showToastText(tool.verifyMobile(data.telephone).message);
					return false
				}*/
		return true
	},
	//手机号码修改
	modifyTelphone() {
		let paytyper = this.data.paytyper;
		if(paytyper != 1) {
			wx.navigateTo({
				url: '/pages/modifyTelphone/modifyTelphone?telephone=' + this.data.basicInfo.telephone
			})
		}

	}
})