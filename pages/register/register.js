// pages/register/register.js
const ajaxUser = require('../../utils/service/ajaxUser.js');
const tool = require('../../utils/js/tool').tool;
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    title: 'ivva注册',
    time: 60,
    isGetCode: true,    //是否已发送验证码
    checked:false,
    telephone:'',
    code:'',
    codeTrue:false
  },
  telInput(e){
    this.setData({
      telephone:e.detail.value
    })
  },
  codeInput(e){
    let val = e.detail.value;
    let that = this;
    if(tool.verifyMobileCode(val).flag){
      that.setData({
        code:e.detail.value,
        codeTrue:true
      })
    }else {
      that.setData({
        codeTrue:false
      })
    }
  },
  getCode: function () {
    let val = this.data.telephone;
    let that = this;
    if(tool.verifyMobile(val).flag){
      this.setData({
        isGetCode: false,
        time:60
      });
      let timer = setInterval(function () {
        if(that.data.time<=0){
          clearInterval(timer);
          that.setData({
            time:0,
            isGetCode:true
          });
        }
        that.setData({
          time:that.data.time-1
        });
      }, 1000);
      wx.getStorage({
        key: 'rd_session',
        success: res => {
          let req = {
            rd_session:res.data,
            telephone:this.data.telephone
          };
          ajaxUser.wxSendSMS(req,response => {
            tool.showToastText(response.messge);
            if(!response.success){
              clearInterval(timer);
              that.setData({
                isGetCode:true
              });
            }
          })
        }
      });
    }else {
      tool.showToastText(tool.verifyMobile(val).message);
    }

  },
  checkboxChange:function(e){
    let val = e.detail.value[0]?true:false;
    this.setData({
      checked:val
    })
  },
  // wxSendSMS(){
  //   wx.getStorage({
  //     key: 'rd_session',
  //     success: res => {
  //       let req = {
  //         rd_session:res.data,
  //         telephone:this.data.telephone
  //       };
  //       ajaxUser.wxSendSMS(req,response => {
  //           tool.showToastText(response.messge);
  //       })
  //     }
  //   });
  // },
  register(){
    wx.getStorage({
      key: 'rd_session',
      success: res => {
        let req = {
          rd_session:res.data,
          telephone:this.data.telephone,
          code:this.data.code
        };
        ajaxUser.telephoenRegister(req,response => {
          tool.showToastText(response.message);
          if(response.success){
            app.data.loginStatus = true;
            wx.setStorage({
              key:"userId",
              data:response.data
            });
            wx.switchTab({
              url: '/pages/index/index'
            })
          }else {
            tool.showToastText(response.messge);
          }
        })
      }
    });
  }
});