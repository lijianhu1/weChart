// components/login.js
const app = getApp();
const ajaxUser = require('../../utils/service/ajaxUser.js');
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title: {
      type: String, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: '登录或注册ivva'
    },
    buttonText1: {
      type: String,
      value: '微信帐号快速登录'
    },
    buttonText2: {
      type: String,
      value: '手机号注册/登录'
    },
    loginDialog:{
      type:String,
      value:{
        show:false
      }
    }
  },
  ready: function () {
    this._isLogin(true)
  },
  /**
   * 组件的初始数据
   */
  data: {
    isLogin: false,
    rd_session: '',
    code: ''
  },
  /**
   * 组件的方法列表
   */
  methods: {
    _closeBtn: function () {
      this.setData({
        ['loginDialog.show']: false
      });
      this.triggerEvent('close')
    },
    _loginTel: function () {
      wx.navigateTo({
        url: '/pages/register/register'
      })
    },
    _getPhoneNumber(e){
      let that = this;
      wx.getStorage({
        key: 'rd_session',
        success: function(res) {
          let reqdata={
            rd_session:res.data,
            encryptedData:e.detail.encryptedData,
            iv:e.detail.iv
          };
          ajaxUser.wxLogin(reqdata, res => {
            if(res.success){
              wx.setStorage({
                key:"userId",
                data:res.data
              });
              app.data.loginStatus = true;
              that.triggerEvent('load')
            }
            that.setData({
              ['loginDialog.show']:false
            });

          })
        },
        fail: error =>{
          wx.login({
            success:res =>{
              let reqdata = {
                js_code: res.code,
              };
              ajaxUser.getSessionKey(reqdata, res=>{
                if(res.success){
                  wx.setStorage({
                    key:"rd_session",
                    data:res.data
                  });
                }
              })
            }
          });
        }
      })

    },
    _getSessionKey(){
      let reqdata = {
        js_code: this.data.code,
      };
      let that = this;
      ajaxUser.getSessionKey(reqdata, res=>{
        if(res.success){
          wx.setStorage({
            key:"rd_session",
            data:res.data
          })
        }
      })
    },
    _isLogin(state){
      let that = this;
      console.log(state)
      if(!state){
        that.setData({
          ['loginDialog.show']: true
        });
      }
      wx.checkSession({
        success (e){
          console.log('仍在登录状态');
          wx.getStorage({
            key: 'userId',
            success: function(res) {
              app.data.loginStatus = true;
            },
            fail(err){
              console.log('无userID');
              app.data.loginStatus = false;
              wx.login({
                success:res =>{
                  let reqdata = {
                    js_code: res.code,
                  };
                  ajaxUser.getSessionKey(reqdata, res=>{
                    if(res.success){
                      wx.setStorage({
                        key:"rd_session",
                        data:res.data
                      });
                    }
                  })
                }
              });
            }
          })
        },
        fail(){
          console.log('登录失效');
          app.data.loginStatus = false;
          wx.login({
            success:res =>{
              let reqdata = {
                js_code: res.code,
              };
              ajaxUser.getSessionKey(reqdata, res=>{
                if(res.success){
                  wx.setStorage({
                    key:"rd_session",
                    data:res.data
                  });
                }
              })
            }
          });

        },
      });
    },
  }
});
