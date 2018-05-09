//index.js
//获取应用实例

const ajaxPosition = require('../../utils/service/ajaxPosition.js');
const ajaxUser = require('../../utils/service/ajaxUser.js');
const app = getApp();
const tool = require('../../utils/js/tool.js').tool;

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    searchCondition:{
      page:1,
      pageSize:20,
    },
    searchResult:[],
    updataing:false,
    loginData:{
      show:false,
      code:''
    },
    getTime:new Date().getTime(),
    updataEnd:false
  },
  onLoad: function () {
    this.jobsearch();
    // if (app.globalData.userInfo) {
    //   this.setData({
    //     userInfo: app.globalData.userInfo,
    //     hasUserInfo: true
    //   })
    // } else if (this.data.canIUse){
    //   // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //   // 所以此处加入 callback 以防止这种情况
    //   app.userInfoReadyCallback = res => {
    //     this.setData({
    //       userInfo: res.userInfo,
    //       hasUserInfo: true
    //     })
    //   }
    // } else {
    //   // 在没有 open-type=getUserInfo 版本的兼容处理
    //   wx.getUserInfo({
    //     success: res => {
    //       app.globalData.userInfo = res.userInfo;
    //       this.setData({
    //         userInfo: res.userInfo,
    //         hasUserInfo: true
    //       })
    //     }
    //   })
    // };


  },
  onShow(){

    // wx.pageScrollTo({scrollTop: 0});
    // this.setData({
    //   ['searchCondition.page']:1,
    //   ['searchCondition.pageSize']:20,
    // });
    // this.jobsearch();
  },
  getUserInfo: function(e) {
    app.globalData.userInfo = e.detail.userInfo;
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  search(){
    wx.navigateTo({
      url: '/pages/search/search'
    })
  },


  jobsearch(){
    let reqdata={
      page:this.data.searchCondition.page,
      pageSize:this.data.searchCondition.pageSize,
    };
    ajaxPosition.jobsearch(reqdata, res => {
      console.log(reqdata, res);
      if(res.code==200){
        this.setData({
          searchResult:res.jobList,
          updataing:false
        });
        if(res.jobList.length==0){
          this.setData({
            updataEnd:true
          })
        }
      }else {
        this.setData({
          updataEnd:true,
          searchResult:[]
        });
        tool.showToastText(res.message)
      }

    })
  },
  //加载更多
  loadMore(){
    let page = this.data.searchCondition.page;
    page+=1;
    this.setData({
      ['searchCondition.page']:page
    });
    let reqdata={
      page:this.data.searchCondition.page,
      pageSize:this.data.searchCondition.pageSize,
    };
    ajaxPosition.jobsearch(reqdata, res => {
      if(res.code==200){
        this.setData({
          searchResult:this.data.searchResult.concat(res.jobList),
          updataing:false
        });
        if(res.jobList.length==0){
          this.setData({
            updataEnd:true
          })
        }
      }else {
        this.setData({
          updataEnd:true
        });
        tool.showToastText(res.message);
      }
    })
  },

  // lower(e){
  //   let that = this;
  //   let updataing = that.data.updataing;
  //   if(!updataing){
  //     that.setData({
  //       updataing:true
  //     });
  //     setTimeout(()=>{
  //       let page = that.data.searchCondition.page;
  //       page+=1;
  //       that.setData({
  //         ['searchCondition.page']:page
  //       });
  //       that.jobsearch();
  //     },500)
  //   }
  // },
  //进入职位详情
  getPositionDetail(e){
    
    let positionId = e.currentTarget.dataset.positionId;
    let userId = e.currentTarget.dataset.userId;
    wx.navigateTo({
      url: `/pages/positionDetail/positionDetail?talentId=${positionId}&compId=${userId}`
    })
  },
});

