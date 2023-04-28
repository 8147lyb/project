const app = getApp();
const db = wx.cloud.database();
const info = db.collection('info');
const openid = app.globalData.openid;
Page({
  data: {
    piece: [{
        name: "My delivery",
        url: "./detail/deliver/deliver"
      },
      {
        name: "Resume upload",
        url: "./detail/uploadDoc/uploadDoc"
      },
      {
        name: "Post a recruitment",
        url: "./detail/pub/pub"
      },
      {
        name: "My recruitment",
        url: "./detail/myPub/myPub"
      },
      {
        name: "contact us",
        url: "./detail/contact/contact"
      }
    ],
    during: 0,
    userInfo: {
      nickName: 'name',
      avatarUrl: '/images/head.jpg'
    },
    show: true
  },
  async onLoad(options) {
    let count = info.where({
      _openid: openid
    }).count();
    count.then((res)=>{
      if(res.total === 0){
        wx.getSetting({
          success: res => {
            if (res.authSetting['scope.userInfo']) {
              wx.getUserInfo({
                success: res => {
                  let userInfo = res.userInfo; 
                  let {
                    avatarUrl,
                    city,
                    country,
                    gender,
                    language,
                    nickName,
                    province
                  } = userInfo;
                  info.add({
                    data: {
                      avatarUrl,
                      city,
                      country,
                      gender,
                      language,
                      nickName,
                      province
                    }
                  })
                  this.setData({
                    userInfo,
                    show:false
                  })
                }
              })
            }
          }
        });
      }else{
        info.where({
          openid
        }).get().then((res) => {
          let info = res.data[0];
          this.setData({
            userInfo: info,
            show: false
          })
        })
  
      }
    })

  },
  getUserInfomation: function (event) {
    let userInfo = event.detail.userInfo;
    
    let {
      avatarUrl,
      city,
      country,
      gender,
      language,
      nickName,
      province
    } = userInfo;
    info.where({
      openid
    }).get().then((res) => {
      this.setData({
        userInfo,
        show: false
      })
      info.add({
        data: {
          avatarUrl,
          city,
          country,
          gender,
          language,
          nickName,
          province
        }
      })
    }).catch((err) => {
      
    })
  },
})