// pages/user/user.js
const ajaxUser = require('../../utils/service/ajaxUser.js');
const ajaxResume = require('../../utils/service/ajaxResume.js').ajaxResume;
let app = getApp();
const tool = require('../../utils/js/tool').tool;
import * as echarts from '../../components/ec-canvas/echarts';

function setOption(chart,_date,_value) {
  var option = {
    backgroundColor: "#f3f4f8",
    color: ["#fd5064"],
    tooltip: {
      trigger: 'none'
    },
    legend: {
      // data: ['A商品']
    },
    grid: {
      containLabel: true,
      left:10,
      right:20,
      bottom:20,
      top:30,
    },
    xAxis: {
      type: 'category',
      boundaryGap: true,
      data: _date,
      minInterval:1,
      splitLine:{
        show:true,
        lineStyle:{
          color:'#fff'
        }
      },
      axisTick:{
        show:false,

      },
      axisLine:{
        show:false
      },
      axisLabel:{
        show:true,
        interval:0,
      },
      interval:1,
    },
    yAxis: {
      x: 'center',
      type: 'value',
      min:0,
      minInterval:1,
      splitLine:{
        show:true,
        lineStyle:{
          color:'#fff'
        }
      },
      axisLine:{
        show:false
      },
      axisTick:{
        show:false
      },
      axisLabel : {
        formatter: function(){
          return "";
        }
      }
    },
    series: [{
      // name: '过去7日零钱收益',
      type: 'line',
      smooth: false,  //平滑度
      data: _value,
      symbolSize: 8,//拐点大小
      symbol:'circle',//拐点样式
      areaStyle: {
        color:'#f9eaed',
        shadowColor:'#f9eaed'
      },
      itemStyle : {
        normal: {
          label : {show: true,formatter:'+{c}',color:'#ff4f66'},
          color:'#fff',
          borderColor:'#ff4f66',
          borderWidth:2,
          shadowColor:'#fff',
          shadowBlur:0,
          lineStyle:{
            width:2,//折线宽度
            color:"#ff4f66"//折线颜色
          }
          },

      },

    }]
  };
  chart.setOption(option);
}

Page({
  /**
   * 页面的初始数据
   */
  data: {
    title:'钱 包',
    loginStatus:false,
    loginDialog:{
      show:false
    },
    avatarUrl:'',
    goldData:{
      balance:'',
      totalGold:'',
      yesterdayGold:''
    },
    searchCondition:{
      page:1,
      pageSize:20
    },
    searchResult:{
      delivery:{
        resultList:[],
        total:0
      },
      download:{
        resultList:[],
        total:0
      }
    },
    tab:1,//1投递，2：下载
    updataEnd:{
      delivery:false,
      download:false
    },
    modal:false,
    perfect:0,
    nickName:'',
    chartHidden:false,
    ec: {
      lazyLoad: true
    },
    choice:'',  //判断是否同意协议
    agreementModal:false,
    firstLoad:true
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  onReady: function () {
// 获取组件
    this.ecComponent = this.selectComponent('#canvas');
    this.init()
  },
  onShow(){
    this.setData({
      loginStatus:app.data.loginStatus,
      chartHidden:false,
      ['loginDialog.show']:false,
      searchCondition:{
        page:1,
        pageSize:20
      },
      updataEnd:{
        delivery:false,
        download:false
      }
    });
    this.countType();
    this.getResumeDeatil();
    this.getPesonalGlodLogs();
    this.getDeliveryGoldLogs();
    this.getDownloadGoldLogs();
    if(!this.data.firstLoad){
      this.init()
    }
  },
  login(){
    this.selectComponent("#login-dialog")._isLogin();
    this.setData({
      chartHidden:true
    })
  },
  logout(){
    ajaxUser.wxSignOut({},res=>{
      if(res.success){
        wx.clearStorage();
          this.setData({
            modal:false,
            goldData:{},
            searchResult:{
              delivery:{
                resultList:[],
                total:0
              },
              download:{
                resultList:[],
                total:0
              }
            },
            updataEnd:false,
            loginStatus:false,
            chartHidden:false
          });
          this.init();
          app.data.loginStatus = false
      }
    });

  },
  logoutModal(){
    this.setData({
      modal:true,
      chartHidden:true
    })
  },
  logoutCancel(){
    this.setData({
      modal:false,
      chartHidden:false
    })
  },
  tabFun(e){
    if(app.data.loginStatus){
      let tab = e.currentTarget.dataset.tab;
      this.setData({
        tab:tab,
        searchCondition:{
          page:1,
          pageSize:20
        },
        updataEnd:{
          delivery:false,
          download:false
        }
      });
      this.searchFun()
    }else {
      this.setData({
        chartHidden:true
      });
      this.selectComponent("#login-dialog")._isLogin();
    }

  },
  searchFun(){
    let tab = this.data.tab;
    if(tab==1){
      this.getDeliveryGoldLogs()
    }else if(tab==2){
      this.getDownloadGoldLogs()
    }
  },
  getPesonalGlodLogs(){
    let date = new Date();
    let year = date.getFullYear();
    let mouth = date.getMonth()+1;
    let day = date.getDate();
    mouth = mouth>10 ? mouth:'0'+mouth;
    day = day>10?day:'0'+day;
    let reqdata={
      yesterday:year+'-'+mouth+'-'+day
    };
    ajaxUser.getPesonalGlodLogs(reqdata,res=>{
      if(res.code==200){
        this.setData({
          goldData:res.resultMap
        })
      }
    })
  },
  //获取投递数据
  getDeliveryGoldLogs(){
    let reqdata={
      page:this.data.searchCondition.page,
      pageSize:this.data.searchCondition.pageSize,
    };
    ajaxUser.getDeliveryGoldLogs(reqdata,res => {
      if(res.code==200){
        this.setData({
          ['searchResult.delivery']:res
        })
      }else{

        if(app.data.loginStatus){
          tool.showToastText(res.message);
        }
        if(res.code==302){
          this.setData({
            ['searchResult.delivery.resultList']:[],
            ['searchResult.delivery.total']:0,
            ['updataEnd.delivery']:true
          });
        }
      }
    })
  },
  //获取下载数据
  getDownloadGoldLogs(){
    let reqdata={
      page:this.data.searchCondition.page,
      pageSize:this.data.searchCondition.pageSize,
    };
    ajaxUser.getDownloadGoldLogs(reqdata,res => {
      if(res.code==200){
        this.setData({
          ['searchResult.download']:res
        })
      }else{
        if(app.data.loginStatus){
          tool.showToastText(res.message);
        }
        if(res.code==302){
          this.setData({
            ['searchResult.download.resultList']:[],
            ['searchResult.download.total']:0,
            ['updataEnd.download']:true
          });
        }
      }
    })
  },
  loadMore(){
    let page = this.data.searchCondition.page;
    let tab = this.data.tab;
    page+=1;
    this.setData({
      ['searchCondition.page']:page
    });
    if(tab==1){
      ajaxUser.getDeliveryGoldLogs(this.data.searchCondition,res => {
        if(res.code==200){
          this.setData({
            ['searchResult.delivery.resultList']:this.data.searchResult.delivery.resultList.concat(res.resultList)
          });
          if(res.resultList.length==0){
            this.setData({
              ['updataEnd.delivery']:true
            })
          }
        }else if(res.code==302) {
          this.setData({
            ['updataEnd.delivery']:true
          })
        }
      })
    }else if(tab==2){
      ajaxUser.getDownloadGoldLogs(this.data.searchCondition,res => {
        if(res.code==200){
          this.setData({
            ['searchResult.download.resultList']:this.data.searchResult.download.resultList.concat(res.resultList)
          });
          if(res.resultList.length==0){
            this.setData({
              ['updataEnd.download']:true
            })
          }
        }else if(res.code==302) {
          this.setData({
            ['updataEnd.download']:true
          })
        }
      })
    }
  },
  withdraw(){
    if(app.data.loginStatus){
      let perfect = this.data.perfect;
      if(perfect<80){
        tool.showToastText('简历完善度低于80%不得提现，请先完善简历')
      }else {
        wx.navigateTo({
          url: '/pages/withdraw/withdraw?gold='+this.data.goldData.balance
        })
      }

    }else {
      this.setData({
        chartHidden:true
      });
      this.selectComponent("#login-dialog")._isLogin();
    }

  },
  date_fun(day){
    let time = new Date();
    let year_end = time.getFullYear();
    let mouth_end = (time.getMonth()+1)>10?time.getMonth()+1:'0'+(time.getMonth()+1);
    let day_end = time.getDate()>10?time.getDate():'0'+time.getDate();
    let endDate = year_end+'-'+mouth_end+'-'+day_end;
    let time2 = new Date();
    day = day||0;
    time2.setTime(time2.getTime() + (24 * 60 * 60 * 1000 * day));
    let year_start = time2.getFullYear();
    let mouth_start = (time2.getMonth()+1)>10?time2.getMonth()+1:'0'+(time2.getMonth()+1);
    let day_start = time2.getDate()>10?time2.getDate():'0'+time2.getDate();
    let startDate = year_start+'-'+mouth_start+'-'+day_start;
    let md = mouth_start+'.'+day_start;
    return{
      end:endDate,
      start:startDate,
      md:md
    }
  },
  countType(){
    let that = this;
    ajaxUser.countType(res => {
      if(res.code==200){
        that.setData({
          perfect:res.perfect
        })
      }
    })
  },
  //登录关闭按钮
  closeLogin(){
    this.setData({
      chartHidden:false
    })
  },
  edit(){
    if(app.data.loginStatus){
      if(this.data.choice==0){
        this.setData({
          agreementModal:true,
          chartHidden:true
        })
      }else {
        wx.navigateTo({
          url: '/pages/resume/resume'
        })
      }

    }else {
      this.setData({
        chartHidden:true
      });
      this.selectComponent("#login-dialog")._isLogin();
    }
  },
  //获取简历详情
  getResumeDeatil(){
    let that = this;
    ajaxResume.getResumeDeatil({},res =>{
      if(res.code==200){
        let avatar = res.resume.headImg;
        that.setData({
          nickName:res.resume.name||app.globalData.userInfo.nickName,
          choice:res.resume.choice
        });
        if(avatar){
          if(avatar.indexOf('http')>-1){
            avatar = res.resume.headImg;
            that.setData({
              avatarUrl:avatar
            });
          }else{
            that.setData({
              avatarUrl:'http://192.168.1.150:8080/resume/getHeadImg?headImg='+avatar+'&v='+(new Date().getTime())+'&rd_session='+(wx.getStorageSync('rd_session')||'')
            })
          }
        }else {
          that.setData({
            avatarUrl : app.globalData.userInfo.avatarUrl
          })

        }

      }
    })
  },
  getPositionDetail(e){
    let userId = e.currentTarget.dataset.userId;
    let positionId = e.currentTarget.dataset.positionId;
    let tab = this.data.tab;
    if(tab==1){
      wx.navigateTo({
        url: `/pages/positionDetail/positionDetail?talentId=${positionId}&compId=${userId}`
      })
    }else if(tab==2){
      wx.navigateTo({
        url: `/pages/companyInfo/companyInfo?talentId=${positionId}&compId=${userId}`
      })
    }

  },


  init(){
    let that = this;
    this.ecComponent.init((canvas, width, height) => {
      // 获取组件的 canvas、width、height 后的回调函数
      // 在这里初始化图表
      const chart = echarts.init(canvas, null, {
        width: width,
        height: height
      });

      let day7 = this.date_fun(-6);
      let reqdata={
        startTime:day7.start,
        endTime:day7.end,
      };
      ajaxUser.incomeStatistics(reqdata,res=>{
        console.log('金币数',res);
        that.setData({firstLoad:false});
        let dateArr=[];
        let valArr=[];
        if(res.code==200){
          for(let i=0;i<res.resultList.length;i++){
            let dateItemArr = res.resultList[i].incomeTime.split('-');
            let dateItem = dateItemArr[1]+'.'+dateItemArr[2];
            dateArr.push(dateItem);
            valArr.push(res.resultList[i].gainNum)
          };
          setOption(chart,dateArr,valArr);
          // 将图表实例绑定到 this 上，可以在其他成员函数（如 dispose）中访问
          this.chart = chart;
          // 注意这里一定要返回 chart 实例，否则会影响事件处理等
          return chart;
        }else {
          let _date=[that.date_fun(-6).md,that.date_fun(-5).md,that.date_fun(-4).md,that.date_fun(-3).md,that.date_fun(-2).md,that.date_fun(-1).md,that.date_fun().md,];
          let _value = [0,0,0,0,0,0,0];
          setOption(chart,_date,_value);
          // 将图表实例绑定到 this 上，可以在其他成员函数（如 dispose）中访问
          this.chart = chart;
          // 注意这里一定要返回 chart 实例，否则会影响事件处理等
          return chart;
        }
      });
    });
  },
  //重新加载
  reload(){
    this.onShow();
    // this.onReady();
  },
  //取消协议
  agreementCancel(){
    this.setData({
      agreementModal:false,
      chartHidden:false
    })
  },
  agreementSubmit(){
    let reqdata={
      type:6,
      choice:1
    };
    ajaxUser.updateSelfEvaluate(reqdata, res =>{
      if(res.code==200){
        wx.navigateTo({
          url: '/pages/resume/resume'
        })
      }else {
        tool.showToastText(res.message);
      }
      this.setData({
        agreementModal:false
      })
    })
  },
  //协议
  protocol(){
    wx.navigateTo({
      url: '/pages/protocol/protocol'
    })
  },
  withdrawList(){
    if(app.data.loginStatus){
      wx.navigateTo({
        url: '/pages/withdrawList/withdrawList'
      })
    }else {
      this.setData({
        chartHidden:true
      });
      this.selectComponent("#login-dialog")._isLogin();
    }
  },

});