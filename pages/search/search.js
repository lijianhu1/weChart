// pages/search/search.js
const ajaxPosition = require('../../utils/service/ajaxPosition.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    title:'搜 索',
    historyPosi:[],
    searchText:'',
    hotSearch:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    //获取历史搜索
    wx.getStorage({
      key: 'historyPosi',
      success:res =>{
        if(res.data.length>0){
          this.setData({
            historyPosi:res.data
          })
        }

      }
    });
    this.hotSearch()
  },
  searchInput(e){
    this.setData({
      searchText:e.detail.value
    })
  },
  search(e){
    let val = this.data.searchText;
    let that = this;
    if(val){
      let logsList = that.data.historyPosi;
      if(logsList.indexOf(val)==-1){
        if(logsList.length>10){
          logsList.pop()
        }
          logsList.unshift(val);
      }
      this.setData({
        historyPosi:logsList
      });
      //设置搜索
      wx.setStorage({
        key:"historyPosi",
        data:logsList
      })
    }
    wx.navigateTo({
      url: '/pages/positionList/positionList?keyWord='+this.data.searchText
    })
  },
  clearSearch(e){
    wx.switchTab({
      url: '/pages/index/index'
    })
    // let searchText = this.data.searchText;
    // let that = this;
    // if(searchText){
    //   that.setData({
    //     searchText:''
    //   });
    // }
  },
  //清空历史记录
  deleteLogs(){
    this.setData({
      historyPosi:[]
    })
    wx.removeStorage({
      key: 'historyPosi'
    })
  },
  //选择记录
  selectLogs(e){
    let val = e.currentTarget.dataset.value;
    let selectType = e.currentTarget.dataset.selectType;
    let that = this;
    if(selectType){
      let logsList = that.data.historyPosi;
      if(logsList.indexOf(val)==-1){
        if(logsList.length>10){
          logsList.pop()
        }
        logsList.unshift(val);
      }
      this.setData({
        historyPosi:logsList
      });
      //设置缓存
      wx.setStorage({
        key:"historyPosi",
        data:logsList
      })
    }
    wx.navigateTo({
      url: '/pages/positionList/positionList?keyWord='+val
    })
  },
  hotSearch(){
    ajaxPosition.hotSearch(res=>{
      if(res.code==200){
        this.setData({
          hotSearch:res.resultList
        })
      }
    })
  }
});