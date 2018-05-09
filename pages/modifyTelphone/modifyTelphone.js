// pages/login/login.js
const tool = require('../../utils/js/tool').tool;
const ajaxUser = require('../../utils/service/ajaxUser.js');
const app = getApp()
Page({
  data: {
    title:'修改手机号码',
    time: 60,
    oldPhone:'', //旧手机号码
    isGetCode: true,    //是否已发送验证码
    telephone:'',
    code:'',
    codeTrue:false,
    disabled:true
  },
  onLoad(options){
    this.setData({
      oldPhone : options.telephone
    })
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
        disabled:false
      })
    }else {
      that.setData({
        disabled:true
      })
    }
  },
  getCode: function () {
    let val = this.data.telephone;
    let that = this;
    if(tool.verifyMobile(val).flag){
      if(val == this.data.oldPhone){
        tool.showToastText('新手机号码不能和原来手机号相同');
        return false
      }
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
  modify(){
    let req = {
      telephone:this.data.telephone,
      code:this.data.code
    };
    ajaxUser.updatetelephone(req,response => {
      console.log(response)
      if(response.code==200){
        wx.navigateTo({
          url: '/pages/resume/resume'
        })
      }else {
        tool.showToastText(response.message);
      }
    })
  }
});