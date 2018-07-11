//app.js

var server = require("/utils/serverAPI.js");
var config = require("./config/config.js")
var util = require("./utils/util.js")

var getWxrequestPromisify = util.wxPromisify(wx.request);
var getWxLoginPromisify = util.wxPromisify(wx.login);

const app = getApp()

App({
    onLaunch: function() {
        //清除所有缓存
        wx.clearStorageSync();

        var params = {};
        server.GET(server.api.checkNetwork, params).then(res => {
            console.info("网络通畅, 可以访问")
        }).catch(res => {
            wx.showToast({
                title: res.respMsg,
                icon: 'none',
                mask: true
            })
        })

        //登录中- 
        wx.showLoading({
            title: '登录中.....',
            mask: true
        })

        getWxLoginPromisify().then(
            res => {
                return res.code;
            }
        ).then(
            code => {
                var params = {
                    authCode: code
                };
                server.GET(server.api.getOpenId, params).then(res => {
                    console.info("res=", res)
                    if ('000000' == res.respCode) {
                        getApp().globalData.memberId = res.responseBody.memberId;
                        getApp().globalData.realFlag = res.responseBody.realFlag;

                        console.info('全局变量=', getApp().globalData)
                        wx.setStorageSync("memberInfo", res.responseBody)
                    } else {
                        wx.showToast({
                            title: res.respMsg,
                            icon: 'none',
                            mask: true
                        })
                    }
                })
            }).catch(res => {
            wx.showToast({
                title: res.respMsg,
                icon: 'none',
                mask: true
            })
        })
    },

    globalData: {
        memberId: ''
    }
})