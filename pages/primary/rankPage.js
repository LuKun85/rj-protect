// pages/rank/rank.js

var rankData = require('../../utils/rankList.js');

var server = require("../../utils/serverAPI.js");
var config = require("../../config/config.js");
var util = require("../../utils/util.js");


Page({

  /**
   * 页面的初始数据
   */
  data: {
    datapage: {
      pageCount: 10,
      pageCurrent: 1,
      pageTotal: 1,
      totalCount: 100
    },
    dataList: null,
    scrollTop: 0,
    scrollHeight: 0,

    rankDataList: [],

    currentTab: 'A',
    memberInfo: {}
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var that = this
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          scrollHeight: res.windowHeight
        });
      }
    });

    that.setData({
      dataList: rankData.rankList
    })


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
    //获取用户号和检查是否实名
    wx.getStorage({
      key: 'memberInfo',
      success: res => {
        this.setData({
          memberInfo: res.data
        })
      }
    })

    //每次页面刷新进来都重新加载排行榜数据
    var params = {
      "instId": config.config.instId,
      "platformType": config.config.platformType,
      "rankDataType": "A"
    };
    server.GET(server.api.getRankData, params).then(res => {
      if ('000000' == res.respCode) {
          console.info("res", res)
          this.setData({
            rankDataList: res.responseBody.queryResultPage != null && res.responseBody.queryResultPage.list != null ? res.responseBody.queryResultPage.list: []
          })
      } else {
        wx.showToast({
          title: res.respMsg,
          icon: 'none',
          duration: 2000
        })
      }
      wx.hideLoading();
    }).catch(res=>{
      console.info("获取排行榜数据异常=", res)
      wx.hideLoading();
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

  //   该方法绑定了页面滑动到底部的事件
  bindDownLoad: function () {
    var that = this;
    var newRankList = rankData.rankList.concat(rankData.rankList2);
    that.setData({ dataList: newRankList })
  },
  //  该方法绑定了页面滚动时的事件
  scroll: function (event) {
    this.setData({
      scrollTop: event.detail.scrollTop
    });
  },


  //滑动切换
  swiperTab: function (e) {
    var that = this;
    that.setData({
      currentTab: e.target.dataset.current
    })
    var params = {
      "instId": config.config.instId,
      "platformType": config.config.platformType,
      "rankDataType": e.target.dataset.current
    };
    server.GET(server.api.getRankData, params).then(res => {
      if ('000000' == res.respCode) {
          console.info("res", res)
          this.setData({
            rankDataList: res.responseBody.queryResultPage != null && res.responseBody.queryResultPage.list != null ? res.responseBody.queryResultPage.list: []
          })
      } else {
        wx.showToast({
          title: res.respMsg,
          icon: 'none',
          duration: 2000
        })
      }
      wx.hideLoading();
    }).catch(res=>{
      console.info("获取排行榜数据异常=", res)
      wx.hideLoading();
    });


  },
  //点击切换
  clickTab: function (e) {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          scrollWeightHeight: res.windowHeight
        });
      }
    });
    that.setData({
      currentTab: e.target.dataset.current
    })
    var params = {
      "instId": config.config.instId,
      "platformType": config.config.platformType,
      "rankDataType": e.target.dataset.current
    };
    server.GET(server.api.getRankData, params).then(res => {
      if ('000000' == res.respCode) {
          console.info("res", res)
          this.setData({
            rankDataList: res.responseBody.queryResultPage != null && res.responseBody.queryResultPage.list != null ? res.responseBody.queryResultPage.list: []
          })
      } else {
        wx.showToast({
          title: res.respMsg,
          icon: 'none',
          duration: 2000
        })
      }
      wx.hideLoading();
    }).catch(res=>{
      console.info("获取排行榜数据异常=", res)
      wx.hideLoading();
    });

  },


  //下拉刷新
  onPullDownRefresh: function () {
    this.onLoad()
  },

})