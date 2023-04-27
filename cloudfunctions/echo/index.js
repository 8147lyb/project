const cloud = require('wx-server-sdk')

exports.main = async (event, context) => {
  // event.userInfo Is an abandoned reserved field, which is not shown here.
  // obtain OPENID Please use for WeChat context. cloud.getWXContext()
  delete event.userInfo
  return event
}
