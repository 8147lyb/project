const db = wx.cloud.database();
const _ = db.command;
const jobDetail = db.collection('jobDetail');
const jobList = db.collection('jobList')
const util = require("../utils/utils")
let app = getApp();
Page({
  data: {
    info: {},
    time: '',
    show: false,
    title: [],
    id: ''
  },

  onLoad: function (options) {
    let id = options.id;
    this.setData({
      id
    })
    this.getjobDetail(id)
  },
  getjobDetail(id){
    jobDetail.where({
      _id: id
    }).get().then((res) => {
      let info = res.data[0];
      let time = util.formatDate(info.date);
      this.setData({
        info,
        time
      })
    })
  },
  join() {
    jobList.get().then((res) => {
      if (res.data === 0) {
        wx.showToast({
          title: 'Please upload your resume first.'
        })
      } else {
        let title = [];
        for (let index = 0; index < res.data.length; index++) {
          title.push(res.data[index].title)
        }
        this.setData({
          show: true,
          columns: res.data,
          title
        })
      }
    })
  },
  onConfirm(e) {
    let {
      openid
    } = app.globalData;
    let {
      index,
      value
    } = e.detail;
    let date = new Date().getTime();
    let url = this.data.columns[index].url;
    let obj = {
      date,
      value,
      url,
      openid
    }
    //Use openid to determine whether the user of this position has repeatedly delivered.
    jobDetail.where({
      //Query the number of values in the array that are equal to this id and the openid object in the array.
      //If it is equal to 0, it means that you have not voted, otherwise you have already voted for this position.
      _id: this.data.id,
      jobDocList: _.all([
        _.elemMatch({
          openid
        })     
      ])
    }).count().then((res) => {
      if (res.total === 0) {
        //Haven't voted yet
        jobDetail.doc(this.data.id).update({
          data: {
            jobDocList: _.push(obj)
          }
        }).then((res) => {
          this.setData({
            show: false
          })
          wx.showToast({
            title: 'Registration successful'
          })
        })
      } else {
        this.setData({
          show: false
        })
        //I have already voted for this part-time job.
        wx.showToast({
          title: 'You have already registered for this position, so you do not to register again',
          icon: 'none'
        })
      }
    }).catch(err=>{
      wx.showToast({
        title: 'Something went wrong.',
        icon: 'none'
      })
    })
  },
  onCancel(){
    this.setData({
      show: false
    })
  },
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading() //Show load in title bar
    let id = this.data.id;
    this.getjobDetail(id)
    //Simulated loading
    setTimeout(function () {
      // complete
      wx.hideNavigationBarLoading() //Finished stopping loading.
      wx.stopPullDownRefresh() //Stop pull-down refresh
    }, 1500);
  }
})