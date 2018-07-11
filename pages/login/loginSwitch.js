// pages/login/loginSwitch.js

var server = require("../../utils/serverAPI.js");
var config = require("../../config/config.js")
var util = require("../../utils/util.js")

var getWxrequestPromisify = util.wxPromisify(wx.request);

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
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
    wx.showLoading({
      title: '登录中',
    })
    var getmember = setInterval(function () {
      var member = wx.getStorageSync("memberInfo");
      console.info("登录也获取用户ID:", new Date().getTime())
      if (member != null) {
        that.setData({
          memberInfo: wx.getStorageSync("memberInfo")
        })
        that.setData({
          loginStatus: wx.getStorageSync("loginStatus")
        })
        that.setData({
          realStatus: wx.getStorageSync("realStatus")
        })
        wx.hideLoading()
        clearInterval(getmember);
        return;
      } 
    }, 2000);

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

  //跳转手机登录页面
  phoneLoginPage: function () {
    wx.navigateTo({
      url: '/pages/login/signup',
    })
  },
  //微信登录
  wechatLogin: function (e) {
    var that = this;

    console.info("登录信息=", e)
    if (!e.detail.rawData) {
      wx.showToast({
        title: '未同意授权,无法登陆',
        icon: 'none',
        duration: 2000
      })
      return;
    }


    wx.showLoading({
      title: '登录中',
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
      registMethod: 'PLATFORM'
    };
    server.POST(server.api.doLoginAndRegist, params).then(res => {
      console.info("微信登录应答", res)
      wx.hideLoading();
      if ('000000' == res.respCode) {
          app.globalData.loginStatus = 'Y'
      } else {
        wx.showToast({
          title: res.respMsg,
          icon: 'none',
          duration: 2000
        })
      }
        wx.navigateBack({
          delta: 2
        })
    }).catch(res => {
      wx.hideLoading();
      console.info("微信快速登录失败=", res)
    });

    // var requestBody = {
    //   instId: config.config.instId,
    //   platformType: config.config.platformType,
    //   memberId: that.data.memberInfo.memberId,
    //   userInfo: e.detail.userInfo,
    //   encryptedData: e.detail.encryptedData,
    //   iv: e.detail.iv,
    //   rawData: e.detail.rawData,
    //   registMethod: 'PLATFORM'
    // }
    // wx.showLoading({
    //   title: '登录中.....',
    // })

    // var sign = util.genSign(requestBody);
    // var requestbody = util.encryptRequestBody(requestBody);

    // getWxrequestPromisify({
    //   method: "POST",
    //   url: server.serverAPI.loginNew,
    //   data: {
    //     instId: config.config.instId,
    //     platformType: config.config.platformType,
    //     requestBody: requestbody,
    //     sign: sign
    //   }
    // }).then(
    //   res => {
    //     if("000000" == res.data.respCode){
    //       wx.setStorage({
    //         key: 'memberInfo',
    //         data: res.data.responseBody
    //       })
    //       wx.setStorage({
    //         key: 'loginStatus',
    //         data: "Y"
    //       })
    //     } else {
    //       wx.showToast({
    //         title: res.data.respMsg,
    //         icon: 'none',
    //         duration: 2000
    //       })
    //     }
    //     wx.hideLoading();
    //     wx.navigateBack({
    //       delta: 2
    //     })
    //   }
    // )
  } , 

  returnPrimaryPage: function(e){
      wx.switchTab({
         url: '/pages/primary/primary'
      })
  }
  
})