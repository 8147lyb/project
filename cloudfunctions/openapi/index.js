// Cloud function entry file
const cloud = require('wx-server-sdk')

cloud.init()

// Cloud function entry function
exports.main = async (event, context) => {
  
  switch (event.action) {
    case 'requestSubscribeMessage': {
      return requestSubscribeMessage(event)
    }
    case 'sendSubscribeMessage': {
      return sendSubscribeMessage(event)
    }
    case 'getWXACode': {
      return getWXACode(event)
    }
    case 'getOpenData': {
      return getOpenData(event)
    }
    default: {
      return
    }
  }
}

async function requestSubscribeMessage(event) {
  // Here is the template ID. Developers need to add templates to applet management background-Subscription message-public template library.
  // Then find the ID of the corresponding template in My Template and fill it in here.
  return 'Please apply for the template ID in the management background and replace it here.' // 如 'N_J6F05_bjhqd6zh2h1LHJ9TAv9IpkCiAJEpSw0PrmQ'
}

async function sendSubscribeMessage(event) {
  const { OPENID } = cloud.getWXContext()

  const { templateId } = event

  const sendResult = await cloud.openapi.subscribeMessage.send({
    touser: OPENID,
    templateId,
    miniprogram_state: 'developer',
    page: 'pages/openapi/openapi',
    // The fields here should be modified to the fields required by the applied template.
    data: {
      thing1: {
        value: '咖啡',
      },
      time3: {
        value: '2020-01-01 00:00',
      },
    }
  })

  return sendResult
}

async function getWXACode(event) {

  // Here, the permanent and effective applet code will be obtained and stored in the cloud file storage, and finally the cloud file ID will be returned to the front end for use.

  const wxacodeResult = await cloud.openapi.wxacode.get({
    path: 'pages/openapi/openapi',
  })

  const fileExtensionMatches = wxacodeResult.contentType.match(/\/([^\/]+)/)
  const fileExtension = (fileExtensionMatches && fileExtensionMatches[1]) || 'jpg'

  const uploadResult = await cloud.uploadFile({
    // Cloud file path, where a fixed name is used for the demonstration.
    cloudPath: `wxacode_default_openapi_page.${fileExtension}`,
    // The content of the file to be uploaded can be directly passed into the picture Buffer.
    fileContent: wxacodeResult.buffer,
  })

  if (!uploadResult.fileID) {
    throw new Error(`upload failed with empty fileID and storage server status code ${uploadResult.statusCode}`)
  }

  return uploadResult.fileID
}

async function getOpenData(event) {
  return cloud.getOpenData({
    list: event.openData.list,
  })
}
