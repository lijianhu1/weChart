//app.js
const ajaxUser = require('/utils/service/ajaxUser.js');
App({
  onLaunch: function () {
    // 展示本地存储能力
    let that = this;

    wx.checkSession({
      success (e){
        console.log('11111')
        wx.getStorage({
          key: 'userId',
          success: function(res) {
            that.data.loginStatus = true;
          },
          fail(err){
            that.data.loginStatus = false;
          }
        })
      },
      fail(){
        that.data.loginStatus = false;
        wx.login({
          success:res =>{
            let reqdata = {
              js_code: res.code,
            };
            ajaxUser.getSessionKey(reqdata, res=>{
              console.log(res)
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
    // // 获取用户信息
    wx.getSetting({
      success: res => {
        console.log('用户信息成功');
        wx.getUserInfo({
          success: res => {
            // 可以将 res 发送给后台解码出 unionId\
            console.log(res);
            let reqdata={
              sex:res.userInfo.gender,
              nickName:res.userInfo.nickName,
              headImg:res.userInfo.avatarUrl
            };
            ajaxUser.savePersonalInfo(reqdata,res=>{});
            this.globalData.userInfo = res.userInfo;
            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
            // 所以此处加入 callback 以防止这种情况
            if (this.userInfoReadyCallback) {
              this.userInfoReadyCallback(res)
            }
          }
        })
      }
    });

    //获取城市
      wx.getLocation({
        type: 'wgs84',
        success: function (res) {
          let longitude = res.longitude;
          let latitude = res.latitude;
          try {
            var systemInfo = wx.getSystemInfoSync();
            console.log(systemInfo)
          } catch (e) {
            // Do something when catch error
          }
        },
        fail: err => {
          try {
            var systemInfo = wx.getSystemInfoSync()
            console.log(systemInfo)
          } catch (e) {
            // Do something when catch error
          }
        }
      });

  },
  globalData: {
    userInfo: {
      avatarUrl:'/images/common/user_default.png',
      nickName:'游客'
    },
    deliveryId:[]
  },
  data:{
    loginStatus:false,
    time:1
  }

});