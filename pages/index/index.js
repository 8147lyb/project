const db = wx.cloud.database();
const jobDetail = db.collection('jobDetail');
const info = db.collection('info')
const util = require('../utils/utils')
Page({
  data :{
    swiper:[{
      img:"../../images/swiper/swiper1.jpg"
    },
    {
      img:"../../images/swiper/swiper2.jpg"
    },{
      img:"../../images/swiper/swiper3.jpg"
    }
  ],
    list:[{
      img:"/images/icon/Information.png",
      text:"Information pro",
      tag:"Information"
    },{
      img:"/images/icon/Trade.png",
      text:"Trade pro",
      tag:'trade'
    },{
      img:"/images/icon/Manufacture.png",
      text:"Manufacture pro",
      tag:"manufacture"
    },{
      img:"/images/icon/waiter.png",
      text:"Waiter pro",
      tag:"waiter"
    },{
      img:"/images/icon/Medical.png",
      text:"Medical pro",
      tag:"medical"
    },{
      img:"/images/icon/invite.png",
      text:"invitation",
      tag:"invitation"
    }
  ],
    fire:[],
    new:[],
    activeNames: ['1'],
    notice:"announcement",
    fireTime:''
  },
  onLoad(){
    this.getjobDetail();
  },
  getjobDetail(){
    jobDetail.orderBy('date','desc').limit(7).get().then((res)=>{
      let re = res.data;
      for (let i = 0; i < res.data.length; i++) {
        const element = res.data[i];
        res.data[i].date = util.formatDate(element.date);
      }
      this.setData({
        new: re
      })
    })
  },
  onChange(event) {
    this.setData({
      activeNames: event.detail
    });
  },
  detail(e){
    let id = e.currentTarget.dataset.id;
    let type = e.currentTarget.dataset.type;
    wx.navigateTo({
      url: '../detail/detail?id=' + id,
    })
  },
  tagDetail(e){
    let name = e.currentTarget.dataset.name;
    
    if(name === 'invite'){
      wx.showToast({
        title: 'Function to be perfected',
        icon: 'none'
      })
      // wx.navigateTo({
      //   url: '../my/detail/invite/invite',
      // })      
    }else{
      wx.navigateTo({
        url: '../tagList/tagList?name=' + name,
      })
    }
  },
  search(){
    wx.navigateTo({
      url: '../search/search',
    })
  },
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading() //Show load in title bar
    this.getjobDetail();
    //Simulated loading
    setTimeout(function () {
      // complete
      wx.hideNavigationBarLoading() //Finished stopping loading.
      wx.stopPullDownRefresh() //Stop pull-down refresh
    }, 1500);
  }
})
