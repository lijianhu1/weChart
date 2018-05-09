// pages/companyInfo/companyInfo.js
const ajaxPosition = require('../../utils/service/ajaxPosition.js');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    title:"公司详情",
    compDescStage:false,
    tab:1,
    searchCondition:{
      page:1,
      pageSize:20,
      compId:'',
      status:1,
      source:0
    },
    positionList:[],
    updataing:false,
    updataEnd:false,
    companyData:{
      talentId:'',
      compId:'',
    },
    companyInfo:{},
    getTime:new Date().getTime(),

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      companyData:{
        talentId:options.talentId,
        compId:options.compId
      },
      ['searchCondition.compId']:options.compId,
    });
    this.getCompInfo();
    this.getTalentDemandList()
  },

  getCompInfo(){
    ajaxPosition.getTalentDemand(this.data.companyData, res=>{
      if(res.code==200){
        this.setData({
          companyInfo:res.talentInfo
        })
      }
    })
  },

  toggleCompDesc(){
    this.setData({
      compDescStage:!this.data.compDescStage
    })
  },
  //tab选择
  tabChange(e){
    let type = e.currentTarget.dataset.tab;
    this.setData({
      tab:type
    })
  },
  //获取在招职位
  getTalentDemandList(){
    ajaxPosition.getTalentDemandList(this.data.searchCondition, res => {
      if(res.code==200){
        this.setData({
          positionList:this.data.positionList.concat(res.talentList),
          updataing:false
        });
        if(res.talentList.length<this.data.searchCondition.pageSize){
          this.setData({
            updataEnd:true
          })
        }
      }else if(res.code==302) {
        this.setData({
          updataEnd:true
        })
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
    this.getTalentDemandList()
  },
  getPositionDetail(e){
    let positionId = e.currentTarget.dataset.positionId;
    let userId = e.currentTarget.dataset.userId;
    wx.navigateTo({
      url: `/pages/positionDetail/positionDetail?talentId=${positionId}&compId=${userId}`
    })
  },

  // //  下拉加载
  // lower(){
  //   let that = this;
  //   let updataing = that.data.updataing;
  //   let updataEnd = that.data.updataEnd;
  //   if(!updataEnd&&!updataing){
  //     that.setData({
  //       updataing:true
  //     });
  //     setTimeout(()=>{
  //       let page = that.data.searchCondition.page;
  //       page+=1;
  //       that.setData({
  //         ['searchCondition.page']:page
  //       });
  //       that.getTalentDemandList();
  //     },500)
  //   }
  // }



  //打开地图
  // openLocation(){
  //   wx.getLocation({
  //     type: 'gcj02', //返回可以用于wx.openLocation的经纬度
  //     success: function(res) {
  //       var latitude = res.latitude
  //       var longitude = res.longitude
  //       wx.openLocation({
  //         latitude: latitude,
  //         longitude: longitude,
  //         scale: 28,
  //         name:'公司名'
  //       })
  //     }
  //   })
  // }
});