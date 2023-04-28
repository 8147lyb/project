const db = wx.cloud.database();
const jobDetail = db.collection('jobDetail')
Page({
  data: {
    show: false,
    title: '',
    phone: '',
    address: '',
    email: '',
    salary: '',
    tag: '',
    context: '',
    columns: ['Information', 'Trade', 'Manufacture', 'Waiter', 'Medical', 'other']
  },

  onLoad: function (options) {

  },
  onTitle(e) {
    this.setData({
      title: e.detail
    })
  },
  onPhone(e) {
    this.setData({
      phone: e.detail
    })
  },
  onAddress(e) {
    this.setData({
      address: e.detail
    })
  },
  onTag(e) {
    this.setData({
      tag: e.detail
    })
  },
  onEmail(e) {
    this.setData({
      email: e.detail
    })
  },
  onSalary(e) {
    this.setData({
      salary: e.detail
    })
  },
  onContext(e) {
    this.setData({
      context: e.detail.value
    })
  },
  isShow() {
    this.setData({
      show: true
    })
  },
  pub() {
    let date = new Date().getTime();
    let tag = this.data.tag;
    let t = '';
    let {address,title,phone,email,salary,context} = this.data;
    
    if(!this.checkPhone(phone)){
      wx.showToast({
        title: 'The mobile phone number was entered incorrectly.',
        icon: 'none'
      })
      return;
    }
    if(!this.checkEmail(email)){
      wx.showToast({
        title: 'Incorrect mailbox input.',
        icon: 'none'
      })
      return;
    }
    switch (tag) {
      case 'Information pro':
        t = 'Information'
        break;
      case 'Trade pro':
        t = 'Trade'
        break;
      case 'Manufacture pro':
        t = 'Manufacture'
        break;
      case 'Waiter pro':
        t = 'waiter'
        break;
      case 'Medica pro':
        t = 'Medica'
        break;
      default:
        t = this.data.tag;
        break;
    };
    jobDetail.add({
      data:{
        address,
        title,
        phone,
        email,
        salary,
        context,
        date,
        tagName:tag,
        tag:t
      }
    }).then((res)=>{
      wx.showToast({
        title: 'Publish successfully',
        icon: 'success'
      })
      wx.navigateBack({
        delta: 1,
      })
    })
  },
  onConfirm(event) {
    const {
      picker,
      value,
      index
    } = event.detail;
    
    this.setData({
      tag: value,
      show: false
    })
  },
  onCancel() {
    this.setData({
      show: false
    })
  },
  showPopup() {
    this.setData({
      show: true
    });
  },
  onClose() {
    this.setData({
      show: false
    });
  },
  checkPhone(phone){
    let reg = /1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}/g;
    return reg.test(phone);
  },
  checkEmail(email){
    let reg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/g;
    return reg.test(email);
  }
})