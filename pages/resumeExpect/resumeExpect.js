//index.js
//获取应用实例
var app = getApp()
var info = require('../../utils/js/info.js').info;
var tool = require('../../utils/js/tool.js').tool;
const ajaxResume = require('../../utils/service/ajaxResume.js').ajaxResume;
var util = require('../../utils/js/util.js');
const getCityList = info.getCityList();
const getPosition = info.getPosition();
const getIndustry = info.getIndustry();
let getSalary = info.getSalary();
getSalary.shift();
let getWorkType = info.getWorkType();
Page({
	data: {
		title: '求职意向',
		workTypeArr: getWorkType,
		salaryArr: getSalary,
		cityArray: [getCityList, getCityList[0].childList],
		cityIndex: [0, 0],
		jobTitle:{},
		expectIndustry:{},
		cityName:'',
		formInfo: {
			jobTitle: '',
			expectCity: ['', ''],
			expectIndustry: '',
			expectWorkType: '',
			expectSalary: '',
		},
      	isStep:''
	},
	  onLoad(options){
		this.setData({
		  isStep:options.isStep
		})
	  },
	onShow() {
		let config = wx.getStorageSync('expect');
		if(config){
			let storageJobTitle =  wx.getStorageSync('jobTitle', 'value');
			let storageExpectIndustry =  wx.getStorageSync('expectIndustry', 'value');
			if(storageJobTitle || storageExpectIndustry) {
				if(storageJobTitle){
					let jobTitle = {}
					jobTitle = {
						str:storageJobTitle,
						item: storageJobTitle.split(','),
						id: [],
						value: []
					}
					if(jobTitle.item.length) {
						for(let i in jobTitle.item) {
							let data = jobTitle.item[i].split('-')
							jobTitle.id.push(data[0]);
							jobTitle.value.push(data[1]);
						}
						jobTitle.id = jobTitle.id.join();
						jobTitle.value = jobTitle.value.join();
						wx.setStorage({
							key: "jobTitle",
							data: jobTitle.item.join()
						})
						let jobTitleKey = 'formInfo.jobTitle';
						this.setData({
							[jobTitleKey]: jobTitle.value,
							'jobTitle':jobTitle
						})
					}
				}
				if(storageExpectIndustry){
					let expectIndustry = {}
					expectIndustry = {
						str:storageExpectIndustry,
						item: storageExpectIndustry.split(','),
						id: [],
						value: []
					}
				
					if(expectIndustry.item.length) {
						for(let i in expectIndustry.item) {
							let data = expectIndustry.item[i].split('-')
							expectIndustry.id.push(data[0]);
							expectIndustry.value.push(data[1]);
						}
						expectIndustry.id = expectIndustry.id.join();
						expectIndustry.value = expectIndustry.value.join();
						wx.setStorage({
							key: "expectIndustry",
							data: expectIndustry.item.join()
						})
						let expectIndustryKey = 'formInfo.expectIndustry';
						this.setData({
							[expectIndustryKey]: expectIndustry.value,
							'expectIndustry':expectIndustry
						})
					}
	
				}
			}
			this.setData({
				logs: (wx.getStorageSync('logs') || []).map(function(log) {
					return util.formatTime(new Date(log))
				}),
			})
			
			let cityArray=[getCityList,getCityList[config.expectCity[0]].childList];
			
			const cityArr = [
				cityArray[0][config.expectCity[0]].value,
				cityArray[1][config.expectCity[1]].value
			];
			
			let cityName = [];
			for(let i in cityArr){
				if(!cityName.length||cityName[cityName.length-1] != cityArr[i]){
					cityName.push(cityArr[i])
				}
			}
			
			if(Object.keys(config).length){
				let expectCity='formInfo.expectCity';
				let expectWorkType = 'formInfo.expectWorkType';
				let expectSalary = 'formInfo.expectSalary';
				this.setData({
					[expectCity]:config.expectCity,
					[expectWorkType]:config.expectWorkType,
					[expectSalary]:config.expectSalary,
					cityArray:cityArray,
					cityName:cityName.join('，')
				})
			}
			wx.removeStorageSync('expect')
		}else {
			//职位信息变更接口
			ajaxResume.getResumeDeatil({},res => {
				if(res.code == 200) {
					let cityIndex = ['', ''];
					const cityArray = [[],[]];
					const cityArr = [];
					cityArray[0] = getCityList;
					for (let i in getCityList) {
						if(!parseInt(res.resume.expectCitySuperId)||res.resume.expectCitySuperId == getCityList[i].id){
							cityIndex[0] = i
							cityArr.push(cityArray[0][cityIndex[0]].value)
							cityArray[1] = getCityList[i].childList;
							for (let j in getCityList[i].childList) {
								if(res.resume.expectCity == getCityList[i].childList[j].id){
									cityIndex[1] = j;
									cityArr.push(cityArray[1][cityIndex[1]].value)
									break
								}
							}
							break
						}
					}
					
					let cityName = [];
					if(parseInt(res.resume.expectCitySuperId)){
						for(let i in cityArr){
							if(!cityName.length||cityName[cityName.length-1] != cityArr[i]){
								cityName.push(cityArr[i])
							}
						}
					}
					
					const jobTitle = {
						id:0,
						value:'',
						index1:0,
						index2:0,
						str:''
					}
					for (let i in getPosition) {
						if(res.resume.jobTitleSuperId == getPosition[i].id){
							jobTitle.index1 = i;
							for (let j in getPosition[i].childList) {
								if(res.resume.jobTitle == getPosition[i].childList[j].id){
									jobTitle.id = getPosition[i].childList[j].id;
									jobTitle.value = getPosition[i].childList[j].value;
									jobTitle.index2 = j;
									jobTitle.str = jobTitle.id+'-'+jobTitle.value+'-'+jobTitle.index1+'-'+jobTitle.index2
									break
								}
							}
							break
						}
					}
					
					let jobTitleCookie = jobTitle.id?(jobTitle.id+'-'+jobTitle.value+'-'+jobTitle.index1+'-'+jobTitle.index2):'';
					wx.setStorageSync('jobTitle',jobTitleCookie);
					let jobTitleKey = 'formInfo.jobTitle';
					this.setData({
						[jobTitleKey]: jobTitle.value,
						'jobTitle':jobTitle
					})
					
					const expectIndustry = {
						id:0,
						value:'',
						index1:0,
						index2:0,
						str:''
					}
					for (let i in getIndustry) {
						if(res.resume.industrySuperId == getIndustry[i].id){
							expectIndustry.index1 = i;
							for (let j in getIndustry[i].childList) {
								if(res.resume.expectIndustry == getIndustry[i].childList[j].id){
									expectIndustry.id = getIndustry[i].childList[j].id;
									expectIndustry.value = getIndustry[i].childList[j].value;
									expectIndustry.index2 = j;
									expectIndustry.str = expectIndustry.id+'-'+expectIndustry.value+'-'+expectIndustry.index1+'-'+expectIndustry.index2
									break
								}
							}
							break
						}
					}
					
					let expectIndustryCookie = expectIndustry.id?(expectIndustry.id+'-'+expectIndustry.value+'-'+expectIndustry.index1+'-'+expectIndustry.index2):'';
					wx.setStorageSync('expectIndustry',expectIndustryCookie);
					let expectIndustryKey = 'formInfo.expectIndustry';
					this.setData({
						[expectIndustryKey]: expectIndustry.value,
						'expectIndustry':expectIndustry
					})
					
					
					let expectCity='formInfo.expectCity';
					let expectWorkType = 'formInfo.expectWorkType';
					let expectSalary = 'formInfo.expectSalary';
					
					this.setData({
						[expectCity]:cityIndex,
						[expectWorkType]:tool._match('workType',res.resume.expectWorkType,true)+'',
						[expectSalary]:tool._match('salary',res.resume.expectSalary,true)-1+'',
						cityArray:cityArray,
						cityName:cityName.join('，')
					})
				} else {
					tool.showToastText(res.message, res.code == 200)
				}
			})
		}
	},
	//期望职位选择前执行
	jobTitleChange(){
		const config = {
			jobTitle: this.data.jobTitle.id,
			expectCity: this.data.formInfo.expectCity,
			expectIndustry: this.data.expectIndustry.id,
			expectWorkType: this.data.formInfo.expectWorkType,
			expectSalary: this.data.formInfo.expectSalary,
		}
		wx.setStorageSync('expect', config);
//		wx.redirectTo({
//			url: '../check/check?pageForm=resumeExpect&dataStatus=job&formKey=jobTitle'+(this.data.jobTitle.str?('&formData='+this.data.jobTitle.str):'')
//		})
	},
	//期望行业选择前执行
	expectIndustryChange(e){
		const config = {
			jobTitle: this.data.jobTitle.id,
			expectCity: this.data.formInfo.expectCity,
			expectIndustry: this.data.expectIndustry.id,
			expectWorkType: this.data.formInfo.expectWorkType,
			expectSalary: this.data.formInfo.expectSalary,
		}
		wx.setStorageSync('expect', config);
//		wx.redirectTo({
//			url: '../check/check?pageForm=resumeExpect&dataStatus=industry&formKey=expectIndustry'+(this.data.expectIndustry.str?('&formData='+this.data.expectIndustry.str):'')
//		})
	},
	//工作性质选中后执行
	bindWorkTypeChange(e) {
		let key = 'formInfo.expectWorkType';
		this.setData({
			[key]: e.detail.value
		})
	},
	//薪资选中后执行
	bindSalaryChange(e) {
		let key = 'formInfo.expectSalary';
		this.setData({
			[key]: e.detail.value
		})
	},
	//期望城市选中后执行
	bindMultiPickerChange(e) {
		//		console.log('picker发送选择改变，携带值为', e.detail.value)
		const cityArr = [
			this.data.cityArray[0][e.detail.value[0]].value,
			this.data.cityArray[1][e.detail.value[1]].value
		];
		let cityName = [];
		for(let i in cityArr){
			if(!cityName.length||cityName[cityName.length-1] != cityArr[i]){
				cityName.push(cityArr[i])
			}
		}
		let key = 'formInfo.expectCity';
		this.setData({
			[key]: e.detail.value,
			cityName:cityName.join('，')
		})
	},
	//期望城市一二级选中后执行
	bindMultiPickerColumnChange(e) {
		//		console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
		var data = {
			cityArray: this.data.cityArray,
			expectCity: this.data.formInfo.expectCity
		};
		data.expectCity[e.detail.column] = e.detail.value;
		switch(e.detail.column) {
			case 0:
				data.cityArray[1] = data.cityArray[e.detail.column][e.detail.value].childList;
				//				data.cityArray[2] = data.cityArray[e.detail.column][e.detail.value].childList[0].childList;
				data.expectCity[1] = 0;
				//				data.expectCity[2] = 0;
				//			console.log(data.expectCity);
				break;
		}
		this.setData(data);
	},
	/*表单信息提交*/
	formSubmit(e) {
		const data = e.detail.value
		
		const config = {
			jobTitle: this.data.jobTitle.id,
			expectProvince: data.expectCity[0]!==''?this.data.cityArray[0][data.expectCity[0]].id:'',
			expectCity: data.expectCity[1]!==''?this.data.cityArray[1][data.expectCity[1]].id:'',
			expectIndustry: this.data.expectIndustry.id,
			expectWorkType: data.expectWorkType && this.data.workTypeArr[data.expectWorkType].id,
			expectSalary: data.expectSalary && this.data.salaryArr[data.expectSalary].id,
          	isStep:this.data.isStep
		}
		console.log(config)
		if(!this._checkForm(config)) return
		//职位信息变更接口
		ajaxResume.addJobIntention(config, res => {
			if(res.code == 200) {
				
				setTimeout(function(){
					wx.navigateBack();
				},1000)
			}
			tool.showToastText(res.message, res.code == 200)
		})
	},
	//表单信息验证
	_checkForm(data) {
		if(!data.jobTitle) {
			tool.showToastText('请选择职位');
			return false
		} else if(!data.expectCity) {
			tool.showToastText('请选择城市');
			return false
		} else if(!data.expectIndustry) {
			tool.showToastText('请选择行业');
			return false
		} else if(!data.expectWorkType) {
			tool.showToastText('请选择工作性质');
			return false
		} else if(!data.expectSalary) {
			tool.showToastText('请选择期望月薪');
			return false
		}
		return true
	},
})