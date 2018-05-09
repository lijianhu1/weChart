// pages/withdraw/withdraw.js
const ajaxUser = require('../../utils/service/ajaxUser.js');
const tool = require('../../utils/js/tool.js').tool;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title:'提 现',
    gold:'',
    totalGold:0,
    disabled:false,
    others:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      totalGold:options.gold||0
    });
  },
  //提现
  withdraw(){
    this.setData({
      disabled:true
    });
    let reqdata={
      gold:this.data.gold
    };
    ajaxUser.transferPayment(reqdata, res =>{
      tool.showToastText(res.messge);
      this.setData({
        disabled:false
      });
      if(res.success){
        setTimeout(()=>{
          wx.switchTab({
            url: '/pages/user/user'
          })
        },2000)
      }
    })
  },
  goldChange(e){
    let gold = e.currentTarget.dataset.gold;
    this.setData({
      gold,
      others:false
    })
  },
  otherGold(){
    if(!this.data.others){
      this.setData({
        gold:""
      });
    }
    this.setData({
      others:true
    });
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
          totalGold:res.balance
        })
      }
    })
  },
  otherInput(e){
    let gold = e.detail.value;
    if(gold){
      gold = gold-0;
    }
    let totalGold = this.data.totalGold;
    this.setData({
      gold:gold
    });
     if(gold>2000){
      tool.showToastText('提现金额不得大于2000');
      this.setData({
        gold:2000
      })
    }else if(gold>totalGold){
      tool.showToastText('提现金额不得大于剩余金额');
      this.setData({
        gold:totalGold
      })
    }
    // this.setData({
    //   gold:e.detail.value
    // })
  }
});