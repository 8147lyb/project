const db = wx.cloud.database();
const jobDetail = db.collection('jobDetail')
const util = require('../utils/utils')
Page({

  data: {
    new:[],
    page: 0
  },
  onLoad(options){
    this.getNew();
  },
  getNew(){
    jobDetail.orderBy('date','desc').limit(10).get().then((res)=>{
      for (let i = 0; i < res.data.length; i++) {
        const element = res.data[i];
        res.data[i].date = util.formatDate(element.date);
      }
      this.setData({
        new: res.data
      })
    }).catch(res=>{
      
    })
  },
  // Pull up and touch bottom
  onReachBottom: function() {
    let page = this.data.page + 10;
    jobDetail.skip(page).get().then((res)=>{
      let newData = res.data;
      let oldData = this.data.new;
      this.setData({
        new: oldData.concat(newData),
        page
      })
    })
  },
  detail(e){
    
    let {id,type} = e.target.dataset;
    wx.navigateTo({
      url: '../detail/detail?id='+ id + '&type=' + type
    })
  },
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading() //Show load in title bar
    this.getNew();
    //Simulated loading
    setTimeout(function () {
      // complete
      wx.hideNavigationBarLoading() //Finished stopping loading.
      wx.stopPullDownRefresh() //Stop pull-down refresh
    }, 1500);
  }
})