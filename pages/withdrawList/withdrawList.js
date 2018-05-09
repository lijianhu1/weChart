// pages/withdrawList/withdrawList.js
const ajaxUser = require('../../utils/service/ajaxUser.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchCondition:{
      page:1,
      pageSize:20,
    },
    searchResult:[],
    updataEnd:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let reqdata={
      page:1,
      pageSize:20
    }
    ajaxUser.getPaymentApplyLogs(reqdata,res => {
      if(res.success){
        this.setData({
          searchResult:res.data
        })
      }

    });
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
    ajaxUser.getPaymentApplyLogs(reqdata, res => {
      if(res.success){
        this.setData({
          searchResult:this.data.searchResult.concat(res.data),
          updataing:false
        });
        if(res.data.length==0){
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
  
  //订单详情
  withdrawDetail(e){
    let detailData = JSON.stringify(e.currentTarget.dataset.detailData);
    wx.navigateTo({
      url: '/pages/orderDetail/orderDetail?detail='+detailData
    })
  }

});