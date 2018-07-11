// pages/login/signup.js


var server = require("../../utils/serverAPI.js");
var config = require("../../config/config.js")
var util = require("../../utils/util.js")

var getWxrequestPromisify = util.wxPromisify(wx.request);

var interval = null //倒计时函数

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    phoneNumber: "",
    phoneVerifyCode: "",

    verifyCodeCounting: "获取短信",
    verifyCodeCountDisable: false,
    currentTime: 61,

    memberInfo: {},
    loginStatus: 'N',
    realStatus: 'N'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {


    var that = this;
    var memberId = app.globalData.memberId;

    wx.showLoading({
      title: '获取用户信息',
      mask: true
    })

    var params = {
      "instId": config.config.instId,
      "platformType": config.config.platformType,
      "memberId": memberId,
    };
    server.GET(server.api.getMemberInfo, params).then(res => {
      console.info("刷新用户个人信息=", res)
      wx.hideLoading();
      if ('000000' == res.respCode) {
        that.setData({
          memberInfo: res.responseBody
        })
      } else {
        wx.showToast({
          title: res.respMsg,
          icon: 'none',
          duration: 2000
        })
      }
    }).catch(res => {
      wx.hideLoading();
      console.info("刷新用户个人信息异常=", res)
    });


    // var that = this;
    // wx.showLoading({
    //   title: '登录中',
    // })
    // var getmember = setInterval(function () {
    //   var member = wx.getStorageSync("memberInfo");
    //   console.info("登录也获取用户ID:", new Date().getTime())
    //   if (member != null) {
    //     that.setData({
    //       memberInfo: wx.getStorageSync("memberInfo")
    //     })
    //     that.setData({
    //       loginStatus: wx.getStorageSync("loginStatus")
    //     })
    //     that.setData({
    //       realStatus: wx.getStorageSync("realStatus")
    //     })
    //     wx.hideLoading()
    //     clearInterval(getmember);
    //     return;
    //   } 
    // }, 2000);


  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

    wx.navigateBack({
          delta: 2
    })
    
    wx.switchTab({
         url: '/pages/primary/primary'
    })
       
    // var realFlag = app.globalData.realFlag;
    // var loginStatus = app.globalData.loginStatus;
    // //如果登录了
    // if(loginStatus == 'Y'){
    //   wx.navigateBack({
    //       delta: 2
    //   })
    // }


    // if('Y' == realFlag){
    //     wx.navigateTo({
    //        url: '/pages/login/signup',
    //     })
    // } 

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  enterPhoneNumber: function (e) {
    this.setData({
      phoneNumber: e.detail.value
    })
  },
  enterPhoneVerifyCode: function (e) {
    this.setData({
      phoneVerifyCode: e.detail.value
    })
  },

  sendVerifyCode: function () {
    var that = this;


    wx.showLoading({
      title: '发送中',
      mask: true
    })

    var params = {
      instId: config.config.instId,
      platformType: config.config.platformType,
      phoneNumber: that.data.phoneNumber,
    };
    server.POST(server.api.doSendPhoneCode, params).then(res => {
      console.info("发送手机验证码", res)
      wx.hideLoading();
      if ('000000' == res.respCode) {
        var currentTime = that.data.currentTime;

        interval = setInterval(function () {
          currentTime--;
          that.setData({
            verifyCodeCounting: currentTime + '秒',
            verifyCodeCountDisable: true
          })
          if (currentTime <= 0) {
            clearInterval(interval)
            that.setData({
              verifyCodeCounting: '重新发送',
              currentTime: 61,
              verifyCodeCountDisable: false
            })
          }
        }, 1000)
      } else {
        wx.showToast({
          title: res.respMsg,
          icon: 'none',
          duration: 2000
        })
      }
    }).catch(res => {
      wx.hideLoading();
      console.info("发送手机验证码失败=", res)
    });




    // var requestBody = {
    //   instId: that.data.memberInfo.instId,
    //   platformType: that.data.memberInfo.platformType,
    //   phoneNumber: that.data.phoneNumber,
    // }
    // getWxrequestPromisify({
    //   method: "POST",
    //   url: server.serverAPI.sendCode,
    //   data: {
    //     instId: that.data.memberInfo.instId,
    //     platformType: that.data.memberInfo.platform,
    //     requestBody: JSON.stringify(requestBody),
    //     sign: "ABCD"
    //   }
    // }).then(
    //   res => {
    //     if ("000000" == res.data.respCode) {
    //       var currentTime = that.data.currentTime;

    //       interval = setInterval(function () {
    //         currentTime--;
    //         that.setData({
    //           verifyCodeCounting: currentTime + '秒',
    //           verifyCodeCountDisable: true
    //         })
    //         if (currentTime <= 0) {
    //           clearInterval(interval)
    //           that.setData({
    //             verifyCodeCounting: '重新发送',
    //             currentTime: 61,
    //             verifyCodeCountDisable: false
    //           })
    //         }
    //       }, 1000)
    //     } else {
    //       wx.showToast({
    //         title: res.data.respMsg,
    //         icon: 'none',
    //         duration: 2000
    //       })
    //     }
    //   })

  },

  //注册
  doSignUp: function (e) {

    console.info("e=", e);
    if (e.detail.errMsg == "getUserInfo:fail auth deny") {
      wx.showToast({
        title: '未授权',
        icon: 'fail',
        duration: 2000
      })
      return;
    }

    var that = this;
    if (!e.detail.rawData) {
      wx.showToast({
        title: '未同意授权,无法登陆',
        icon: 'none',
        duration: 2000
      })
      return;
    }

    wx.showLoading({
      title: '登录中.....',
      mask: true
    })

    var params = {
      instId: config.config.instId,
      platformType: config.config.platformType,
      memberId: that.data.memberInfo.memberId,
      userInfo: e.detail.userInfo,
      encryptedData: e.detail.encryptedData,
      iv: e.detail.iv,
      rawData: e.detail.rawData,
      registMethod: 'PHONE',
      phoneNumber: that.data.phoneNumber,
      messageCode: that.data.phoneVerifyCode
    };

    server.POST(server.api.doLoginAndRegist, params).then(res => {
      console.info("手机号注册登录-", res)
      wx.hideLoading();
      if ('000000' == res.respCode) {
          wx.showToast({
            title: '登录成功',
            icon: 'success',
            duration: 2000
          })
          wx.switchTab({
            url: '/pages/primary/primary'
          })
      } else {
        wx.showToast({
          title: res.respMsg,
          icon: 'none',
          duration: 2000
        })
      }
    }).catch(res => {
      wx.hideLoading();
      console.info("手机号注册登录失败=", res)
    });

    // getWxrequestPromisify({
    //   method: "POST",
    //   url: server.serverAPI.regist,
    //   data: {
    //     instId: that.data.memberInfo.instId,
    //     platformType: that.data.memberInfo.platform,
    //     requestBody: JSON.stringify(requestBody),
    //     sign: "ABCD"
    //   }
    // }).then(
    //   res => {
    //     if ("000000" == res.data.respCode) {
    //       wx.setStorage({
    //         key: 'memberInfo',
    //         data: {
    //           realFlag: res.data.responseBody != null ? res.data.responseBody.realFlag : '',
    //           memberId: res.data.responseBody != null ? res.data.responseBody.memberId : '',
    //           instId: res.data.instId,
    //           platformType: res.data.platformType,
    //           postTotalTimes: res.data.responseBody != null ? res.data.responseBody.postTotalTimes : '0',
    //           postTotalWeight: res.data.responseBody != null ? res.data.responseBody.postTotalWeight : '0.00',
    //           postTotalCount: res.data.responseBody != null ? res.data.responseBody.postTotalCount : '0',
    //           postTotalProfit: res.data.responseBody != null ? res.data.responseBody.postTotalProfit : '0.00',
    //           availableProfit: res.data.responseBody != null ? res.data.responseBody.availableProfit : '0.00',
    //           memberIntegarl: res.data.responseBody != null ? res.data.responseBody.memberIntegarl : '0'
    //         }
    //       })
    //       wx.setStorage({
    //         key: 'loginStatus',
    //         data: {
    //           loginStatus: "Y"
    //         }
    //       })
    //       wx.hideLoading();
    //       wx.showToast({
    //         title: '注册成功',
    //         icon: 'success',
    //         duration: 2000
    //       })

    //       wx.switchTab({
    //         url: '/pages/primary/primary'
    //       })
    //     } else {
    //       wx.showToast({
    //         title: res.data.respMsg,
    //         icon: 'none',
    //         duration: 2000
    //       })
    //     }
    //   })
  },


  returnPrimaryPage: function(e){
      wx.switchTab({
         url: '/pages/primary/primary'
      })
  }

})