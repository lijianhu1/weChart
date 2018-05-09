//index.js
//获取应用实例

const ajaxResume = require('../../utils/service/ajaxResume.js').ajaxResume;
const info = require('../../utils/js/info.js').info;
const tool = require('../../utils/js/tool.js').tool;
const app = getApp();

Page({
	data: {
		title: '简历完整度：100%',
		getJobStatus: info.getJobStatus(),
		basic: {
			jobStatue: ''
		},
		detail: {
			work_experiences: []
		},
		perfect: 0,
		showMore:false,
		pickerModel:false,
		jobStatueModalIndex:'',
      	isStep:"",
	  	jobYear:""
	},
	onShow() {
		this.getResumeDeatil();
	},
	//获取简历详情
	getResumeDeatil() {   
		const config = {
			Type: 1
		}
		ajaxResume.getResumeDeatil(config, res => {
			if(res.code==200){
				let title = '简历完整度：' + (res.perfect||0) + '%';
				if(res.resume){
					res = this._fomartResume(res);//格式化简历信息
				}
				this.setData({
					title: '简历完整度：' + (res.perfect||0) + '%',
					perfect:res.perfect,
					detail: res,
                  	isStep:res.resume.isStep,
                  	jobYear:res.resume.jobYear
				})
				wx.setNavigationBarTitle({
					title:'简历完整度：' + (res.perfect||0) + '%'
				})
			}else{
				tool.showToastText(res.message, res.code == 200)
			}
		})
	},
	//格式化简历信息
	_fomartResume(data) {   
		if(data.resume.sex) {
			data.resume.sex = tool._match('sex', data.resume.sex);
		}
		if(data.resume.education) {
			data.resume.education = tool._match('edu', data.resume.education);
		}
		//		if(data.resume.jobYear) {
		data.resume.jobYear = !data.resume.jobYear ? '应届毕业生' : data.resume.jobYear + '年工作经验'
		//		}
		if(data.resume.expectWorkType) {
			data.resume.expectWorkType = tool._match('workType', data.resume.expectWorkType);
		}
		if(data.resume.expectSalary) {
			data.resume.expectSalary = tool._match('salary', data.resume.expectSalary);
		}
		data.resume.judgePhone = !data.resume.judgePhone
		if(data.work_experiences&&data.work_experiences.length) {
			for(let i in data.work_experiences) {
				data.work_experiences[i].salary = tool._match('salary', data.work_experiences[i].salary);
			}
		}
		if(data.educations&&data.educations.length) {
			for(let i in data.educations) {
				data.educations[i].education = tool._match('edu', data.educations[i].education);
			}
		}
		if(data.skills&&data.skills.length) {
			for(let i in data.skills) {
				data.skills[i].masterDegree = tool._match('master', data.skills[i].masterDegree);
			}
		}
		if(!data.resume.headImg){
			this.getUserInfo();
		}else{
			const config = {
				avatarUrl:''
			}
			if(data.resume.headImg.indexOf('http')>-1){
				config.avatarUrl = data.resume.headImg
			}else{
				config.avatarUrl = 'http://192.168.1.150:8080/resume/getHeadImg?headImg='+data.resume.headImg+'&v='+(new Date().getTime())+'&rd_session='+(wx.getStorageSync('rd_session')||'')
			}
			this.setData({
				hasUserInfo: true,
				userInfo: config
			})
		}
		return data
	},
	//调用小程序上传组件
	chooseImage() {
		var that = this
		let key = 'userInfo.avatarUrl'
		wx.chooseImage({
			success:(res) => {
				console.log(res)
				wx.uploadFile({
					url:'http://192.168.1.150:8080/resume/uploadHeadImg',
					filePath:res.tempFilePaths[0],
					name:'file',
					formData:{rd_session:wx.getStorageSync('rd_session')||''},
					success:(data)=>{
						this.getResumeDeatil();
					}
				})
//				that.setData({
//					[key]: res.tempFilePaths[0]
//				})
			}
		})
	},
	//切换展开收起更多
	moreToggle(){
		this.setData({
			showMore:!this.data.showMore
		})
	},
	//简历公开开关
	openChange(e) {
		if(this.data.detail.perfect < 80) {
			tool.showToastText('请先完善简历')
			let key = 'detail.resume.judgePhone'
			this.setData({
				[key]: false
			})
			return
		}
		const config = {
			type: 2,
			judgePhone: e.detail.value ? 0 : 1
		}
		ajaxResume.updateSelfEvaluate(config, res => {
			if(res.code == 200) {
				let key = 'detail.resume.judgePhone'
				this.setData({
					[key]: e.detail.value
				})
			}
			tool.showToastText(res.message, res.code == 200)
		})
	},
	//求职状态选中后执行
	jobStatueChange(e) {
		const config = {
			type: 3,
			jobState: this.data.getJobStatus[e.detail.value].id||0,
		  	isStep:this.data.isStep
		}
		ajaxResume.updateSelfEvaluate(config, res => {
			if(res.code == 200) {
				let key = 'detail.resume.jobState';
				this.setData({
					[key]: this.data.getJobStatus[e.detail.value].id
				})
			}
			tool.showToastText(res.message, res.code == 200)
		})
	},
	//获取用户信息
	getUserInfo() {
		var that = this;

		if(app.globalData.hasLogin === false) {
			wx.login({
				success: _getUserInfo
			})
		} else {
			_getUserInfo()
		}

		function _getUserInfo() {
			wx.getUserInfo({
				success: (res) => {
					that.setData({
						hasUserInfo: true,
						userInfo: res.userInfo
					})
				}
			})
		}
	},
});