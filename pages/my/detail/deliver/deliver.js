const util = require('../../../utils/utils');
const db = wx.cloud.database();
const jobDetail = db.collection('jobDetail');
const _ = db.command;
const app = getApp();
Page({

  data: {
    list: []
  },

  onLoad: function (options) {
    this.getJobDetail();
  },
  getJobDetail(){
    let { openid } = app.globalData;
    jobDetail.orderBy('date','desc').where({
      jobDocList: _.elemMatch({
        openid
      })
    }).get().then((res)=>{
      for (let index = 0; index < res.data.length; index++) {
        const element = res.data[index];
        let date = element.jobDocList[0].date;
        element.jobDocList[0].date = util.formatDate(date)
      }
      this.setData({
        list: res.data
      })
    })
  },

  onPullDownRefresh: function () {
    wx.showNavigationBarLoading() //Show load in title bar
    this.getJobDetail();
    //Simulated loading
    setTimeout(function () {
      // complete
      wx.hideNavigationBarLoading() //Finished stopping loading.
      wx.stopPullDownRefresh() //Stop pull-down refresh
    }, 1500);
  }
})