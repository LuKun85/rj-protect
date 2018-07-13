const Promise = require('./es6-promise.js')
const url = "http://wwkforever.natapp4.cc/protect";

var serverAPI = {

    checkNetwork: url + "/login/checkNetWork",

    getOpenId: url + "/member/openId",
    regist: url + "/member/regist",
    login: url + "/member/login",
    sendCode: url + "/sms/sendCode",
    loginNew: url + "/login/login",
    getAddressCode: url + "/common/addressCodeList",

    merchantAddressList: url + "/member/addressList",
    merchantAddNewAddress: url + "/member/newAddress",
    merchantGetAddressDetail: url + "/member/addressDetail",
    merchantUpdateAddress: url + "/member/updateAddress",
    merchantDeleteAddress: url + "/member/deleteAddress",
    merchantSetDefaultAddress: url + "/member/setDefaultAddress",
    merchantGetDefaultAddress: url + "/member/defaultAddress",

    checkBindPackage: url + "/package/checkBind",
    merchantBindPackage: url + "/package/bind",
    applyPackage: url + "/package/apply",

    merchantAppointmentOrder: url + "/appointment/order",
}


var api = {
    checkNetwork: url + "/login/checkNetWork",
    getOpenId: url + "/login/openId",
    doLoginAndRegist: url + "/login/login",
    doSendPhoneCode: url + "/sms/sendCode",

    getAddressCode: url + "/common/addressCodeList",


    getMemberInfo: url + "/member/memberInfo",
    getMerchantPackageList: url + "/member/packageList",
    getMerchantAddressList: url + "/member/addressList",
    postMerchantNewAddress: url + "/member/newAddress",
    getMerchantAddressDetail: url + "/member/addressDetail",
    updateMerchantAddress: url + "/member/updateAddress",
    deleteMerchantAddress: url + "/member/deleteAddress",
    setMerchantDefaultAddress: url + "/member/setDefaultAddress",
    getMerchantDefaultAddress: url + "/member/defaultAddress",

    checkBind: url + "/package/checkBind",
    bindPackage: url + "/package/bind",
    applyPackage: url + "/package/apply",
    updatePackageOrderStatus: url + "/package/packageOrderStatus",
    getPackageCountingOrderDetail: url + "/package/packageOrderDetail",

    confirmAppointmentOrder: url + "/appointment/order",
    getAppointmentChooseDate: url + "/appointment/chooseDate",

    getGoodsPrice: url + "/goods/priceList",

    getRankData: url + "/rank/rankData",
    getRecycleDateList: url + "/common/recycleDateList",
    getRecycleSpotList: url + "/common/recycleSpotList"
}


var config = require("../config/config.js")
var util = require("../utils/util.js")

function POST(url, params) {
    let promise = new Promise(function(resolve, reject) {
        wx.request({
            url: url,
            data: {
                instId: config.config.instId,
                platformType: config.config.platformType,
                requestBody: util.encryptRequestBody(params),
                sign: util.genSign(params)
            },
            method: 'POST',
            success: function(res) {
                console.info("resolve1 res", res)
                if (200 != res.statusCode) {
                    reject("打雷了, 下雨了, 网络出现异常了")
                } else {
                    resolve(res.data)
                }
            },
            fail: function(res) {
                console.info("reject res", res)
                reject("打雷了, 下雨了, 网络出现异常了")
            }
        })
    });
    return promise
}

function GET(url, params) {
    let promise = new Promise(function(resolve, reject) {
        wx.request({
            url: url,
            data: {
                instId: config.config.instId,
                platformType: config.config.platformType,
                requestBody: util.encryptRequestBody(params),
                sign: util.genSign(params)
            },
            method: 'GET',
            success: function(res) {
                console.info("resolve res", res)
                if (200 != res.statusCode) {
                    reject("打雷了, 下雨了, 网络出现异常了")
                } else {
                    resolve(res.data)
                }
            },
            fail: function(res) {
                console.info("reject res", res)
                reject("打雷了, 下雨了, 网络出现异常了")
            }
        })
    });
    return promise
}

// API封装Promise
function promiseWXAPI(fn) {
    return function(obj = {}) {
        return new Promise((resolve, reject) => {
            //API成功函数重载-> success回调
            obj.success = function(res) {
                    resolve(res)
                }
                //API失败函数重载-> fail回调
            obj.fail = function(res) {
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