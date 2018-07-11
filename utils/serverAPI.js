
const Promise = require('./es6-promise.js')
const url = "http://wwkforever.natapp4.cc/protect";

var serverAPI = {

  checkNetwork: "http://wwkforever.natapp4.cc/protect/login/checkNetWork",

  getOpenId: "http://wwkforever.natapp4.cc/protect/member/openId",
  regist: "http://wwkforever.natapp4.cc/protect/member/regist",
  login: "http://wwkforever.natapp4.cc/protect/member/login",
  sendCode: "http://wwkforever.natapp4.cc/protect/sms/sendCode",
  loginNew: "http://wwkforever.natapp4.cc/protect/login/login",
  getAddressCode: "http://wwkforever.natapp4.cc/protect/common/addressCodeList",

  merchantAddressList: "http://wwkforever.natapp4.cc/protect/member/addressList",
  merchantAddNewAddress: "http://wwkforever.natapp4.cc/protect/member/newAddress",
  merchantGetAddressDetail: "http://wwkforever.natapp4.cc/protect/member/addressDetail",
  merchantUpdateAddress: "http://wwkforever.natapp4.cc/protect/member/updateAddress",
  merchantDeleteAddress: "http://wwkforever.natapp4.cc/protect/member/deleteAddress",
  merchantSetDefaultAddress: "http://wwkforever.natapp4.cc/protect/member/setDefaultAddress",
  merchantGetDefaultAddress: "http://wwkforever.natapp4.cc/protect/member/defaultAddress",

  checkBindPackage: url + "/package/checkBind",
  merchantBindPackage: "http://wwkforever.natapp4.cc/protect/package/bind",
  applyPackage: url + "/package/apply",

  merchantAppointmentOrder: "http://wwkforever.natapp4.cc/protect/appointment/order",
}


var api = {
  checkNetwork: url + "/login/checkNetWork",
  getOpenId: url + "/login/openId",
  doLoginAndRegist: url + "/login/login",
  doSendPhoneCode: url + "/sms/sendCode",

  getAddressCode: "http://wwkforever.natapp4.cc/protect/common/addressCodeList",
  
  merchantAddressList: "http://wwkforever.natapp4.cc/protect/member/addressList",
  getMerchantGetDefaultAddress: url + "/member/defaultAddress",
  merchantAddNewAddress: "http://wwkforever.natapp4.cc/protect/member/newAddress",
  merchantGetAddressDetail: "http://wwkforever.natapp4.cc/protect/member/addressDetail",
  merchantUpdateAddress: "http://wwkforever.natapp4.cc/protect/member/updateAddress",
  merchantDeleteAddress: "http://wwkforever.natapp4.cc/protect/member/deleteAddress",
  merchantSetDefaultAddress: "http://wwkforever.natapp4.cc/protect/member/setDefaultAddress",


  getMemberInfo: url + "/member/memberInfo",
  getMerchantPackageList: url + "/member/packageList",

  checkBind: url + "/package/checkBind",
  bindPackage: url + "/package/bind",
  applyPackage: url + "/package/apply",
  updatePackageOrderStatus: url + "/package/packageOrderStatus",
  getPackageCountingOrderDetail: url + "/package/packageOrderDetail",

  confirmAppointmentOrder: url + "/appointment/order",
  getGoodsPrice: url + "/goods/priceList",

  getRankData: url + "/rank/rankData",
  getRecycleDateList: url + "/common/recycleDateList",
  getRecycleSpotList: url + "/common/recycleSpotList"
}


var config = require("../config/config.js")
var util = require("../utils/util.js")

function POST(url, params) {
  let promise = new Promise(function (resolve, reject) {
    wx.request({
      url: url,
      data: {
        instId: config.config.instId,
        platformType: config.config.platformType,
        requestBody: util.encryptRequestBody(params),
        sign: util.genSign(params)
      },
      method: 'POST',
      success: function (res) {
        console.info("resolve1 res", res)
        if (200 != res.statusCode) {
          reject("打雷了, 下雨了, 网络出现异常了")
        } else {
          resolve(res.data)
        }
      },
      fail: function (res) {
        console.info("reject res", res)
        reject("打雷了, 下雨了, 网络出现异常了")
      }
    })
  });
  return promise
}

function GET(url, params) {
  let promise = new Promise(function (resolve, reject) {
    wx.request({
      url: url,
      data: {
        instId: config.config.instId,
        platformType: config.config.platformType,
        requestBody: util.encryptRequestBody(params),
        sign: util.genSign(params)
      },
      method: 'GET',
      success: function (res) {
        console.info("resolve res", res)
        if (200 != res.statusCode) {
          reject("打雷了, 下雨了, 网络出现异常了")
        } else {
          resolve(res.data)
        }
      },
      fail: function (res) {
        console.info("reject res", res)
        reject("打雷了, 下雨了, 网络出现异常了")
      }
    })
  });
  return promise
}

// API封装Promise
function promiseWXAPI(fn) {
  return function (obj = {}) {
    return new Promise((resolve, reject) => {
      //API成功函数重载-> success回调
      obj.success = function (res) {
        resolve(res)
      }
      //API失败函数重载-> fail回调
      obj.fail = function (res) {
        reject(res)
      }
      //返回执行API
      fn(obj)
    })
  }

}

module.exports = {
  url: url,
  serverAPI: serverAPI,
  POST: POST,
  GET: GET,
  promiseWXAPI: promiseWXAPI,
  api: api
}
