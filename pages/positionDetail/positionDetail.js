//index.js
//获取应用实例

const ajaxPosition = require('../../utils/service/ajaxPosition.js');
const tool = require('../../utils/js/tool.js').tool;
const app = getApp();

Page({
	data: {
		title: '职位详情',
		talentInfo: {},
		isDelivery: 0,
		shareData: {
			title: 'ivva',
			desc: '',
			path: ''
		},
		modal: false,
		talentId: '',
		compId: '',
	  	mesModalData:{
			show:false,
          	cancel:"确定"
		}
	},
	//页面加载时执行
	onLoad(e) {
		//		e = {
		//			talentId:1,
		//			compId:95,
		//		}
		const config = {
			talentId: e.talentId,
			compId: e.compId,
		}
		this.setData({
			talentId: e.talentId,
			compId: e.compId
		})
		this.getTalentDemand(config);
	},
//	
//	onShareAppMessage() {
//		return this.data.shareData
//	},
	//职位详情
	getTalentDemand(data) {
		const config = {
			talentId: this.data.talentId,
			compId: this.data.compId,
			source: 0
		}
		ajaxPosition.getTalentDemand(config, res => {
			if(res.code == 200) {
				res.talentInfo = this._fomartPosition(res.talentInfo);
				let descKey = 'shareData.desc'
				let pathKey = 'shareData.path'
				var pages = getCurrentPages() //获取加载的页面

				var currentPage = pages[pages.length - 1] //获取当前页面的对象

				var url = currentPage.route //当前页面url
				this.setData({
					talentInfo: res.talentInfo,
					isDelivery: res.isDelivery || 0,
					[descKey]: res.talentInfo.jobName,
					[pathKey]: url + '?talentId=' + this.data.talentId + '&compId=' + this.data.compId + '&share=1'
				})
			} else {
				tool.showToastText(res.message, res.code == 200)
			}
		})
	},
	/*职位详情数据格式化*/
	_fomartPosition(data) {
		if(data.compProperty) {
			//			data.compProperty = tool._match('compProperty', data.compProperty);
		}
		data.salary = !data.jobSalaryFrom && !data.jobSalaryTo ? '' : data.jobSalaryFrom + '-' + data.jobSalaryTo
		if(data.sex) {
			data.sex = tool._match('sex', data.sex) || '';
		}

		return data
	},
	/*投递简历*/
	userDelivery(e) {
		if(app.data.loginStatus){
			ajaxPosition.countType(res=>{
				if(res.perfect>=80){
                  wx.showModal({
                    content: this.data.talentInfo.jobGold ? '投递该职位将获得' + this.data.talentInfo.jobGold + '金币' : '是否确认投递该职位',
                    confirmText: "立即投递",
                    cancelText: "取消",
                    confirmColor: '#ff4f64',
                    success: (e) => {
                      if(e.confirm) {
                        const config = {
                          talentId: this.data.talentId + '_' + this.data.compId
                        };
                        ajaxPosition.userDelivery(config, res => {
                          if(res.code == 200) {
                            this.setData({
                              isDelivery: 1
                            });
                            this.upSearchPositionList(this.data.talentId)
                            if(this.data.talentInfo.jobGold){
                              this.modelToggle();
                            }
                            tool.showToastText(res.message, res.code == 200)
                          } else if(res.code == 303) {
                            wx.showModal({
                              content: '简历未完善，完善信息即可投递心仪的职位',
                              confirmText: "完善简历",
                              cancelText: "取消",
                              success: (e) => {
                                if(e.confirm) {
                                  wx.navigateTo({
                                    url: '/pages/resume/resume'
                                  })
                                }
                              }
                            })
                          } else {
                            tool.showToastText(res.message, res.code == 200)
                          }
                        })

                      }
                    }
                  })
				}else {
                  wx.showModal({
                    content: '简历未完善，完善信息即可投递心仪的职位',
                    confirmText: "完善简历",
                    cancelText: "取消",
                    success: (e) => {
                      if(e.confirm) {
                        wx.navigateTo({
                          url: '/pages/resume/resume'
                        })
                      }
                    }
                  })
				}
			})

		}  else {
			this.selectComponent("#login-dialog")._isLogin();
		}

	},
	//红包显示切换
	modelToggle() {
		this.setData({
			modal: !this.data.modal
		})
	},
  	mesModal(){
		this.setData({
		  ['mesModalData.show']:true
		})
	},
	/*修改搜索页面投递状态*/
  upSearchPositionList(talentId) {
    const wxCurrPage = getCurrentPages(); //获取当前页面的页面栈
    for(let i in wxCurrPage){
      if(wxCurrPage[i].route=="pages/index/index"||wxCurrPage[i].route=="pages/positionList/positionList"){
        let searchResult = wxCurrPage[i].data.searchResult;
        for(let j in searchResult){
          if(searchResult[j].positionId == talentId&&searchResult[j].isDelivery==0){
            let updata = `searchResult[${j}].isDelivery`
            wxCurrPage[i].setData({
              [updata]:1
            });
          }
        }
      }
    }
  }
});