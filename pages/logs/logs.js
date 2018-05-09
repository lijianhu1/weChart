//logs.js
const util = require('../../utils/js/util.js')

Page({
  data: {
    logs: [],
    title:'查看启动日志'
  },
  navigateBack: function () {
	    wx.navigateBack()
	},
  onLoad: function () {
    this.setData({
      logs: (wx.getStorageSync('logs') || []).map(log => {
        return util.formatTime(new Date(log))
      })
    })
  }
})
