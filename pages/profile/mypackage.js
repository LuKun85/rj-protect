// pages/profile/mypackage.js

var server = require("../../utils/serverAPI.js");
var config = require("../../config/config.js")
var util = require("../../utils/util.js")

//获取应用实例
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    memberInfo: {},
    loginStatus: '',
    myPackageList:[]

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
   
    var realFlag = app.globalData.realFlag;
    if('Y' != realFlag){
        wx.redirectTo({
           url: '/pages/login/signup',
        })
        return;
    }

    var that = this;
    var memberId = app.globalData.memberId;

    wx.showLoading({
      title: '刷新个人袋子记录',
      mask: true
    })

    var params = {
      "instId": config.config.instId,
      "platformType": config.config.platformType,
      "memberId": memberId,
    };
    server.GET(server.api.getMerchantPackageList, params).then(res => {
      console.info("刷新个人袋子记录=", res)
      wx.hideLoading();
      if ('000000' == res.respCode) {
        that.setData({
          myPackageList: res.responseBody.queryResultPage != null && res.responseBody.queryResultPage.list !=null ? res.responseBody.queryResultPage.list: []
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
      console.info("刷新个人袋子记录异常=", res)
    });
 

  
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

  /**
   * 获取袋子的详细信息
   */ 
  getMypackageDetail: function (e){
     console.info("袋子的详细信息", e)
     app.globalData.packageIdForDetail = '';
     var packageId = e.currentTarget.dataset.id;
     app.globalData.packageIdForDetail  = packageId;
     wx.navigateTo({
      url: '/pages/profile/packageDetail',
     })
  }


})