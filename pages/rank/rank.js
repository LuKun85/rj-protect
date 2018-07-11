// pages/rank/rank.js

var rankData = require('../../utils/rankList.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    "anualTitle": "年度排行",
    "quarterTitle": "季度排行",
    "parkTitle": "小区排行",
    datapage: {
      pageCount: 10,
      pageCurrent: 1,
      pageTotal: 1,
      totalCount: 100
    },
    dataList: null,
    scrollTop: 0,
    scrollHeight: 0,


    memberInfo: {
      instId: "",
      platformType: "",
      memberId: "",
      realFlag: "",
    }
  },

  //下拉刷新
  onPullDownRefresh: function () {
    this.onLoad()
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var rankType = getApp().rankType;
    var that = this
    
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          scrollHeight: res.windowHeight
        });
      }
    });

    wx.showNavigationBarLoading();
    if("anual" == rankType){
      wx.setNavigationBarTitle({
        title: this.data.anualTitle
      })
    } else if ("quarter" == rankType) {
      wx.setNavigationBarTitle({
        title: this.data.quarterTitle
      })
    } else if ("park" == rankType) {
      wx.setNavigationBarTitle({
        title: this.data.parkTitle
      })
    }  ;

    console.log('onLoad')
    that.setData({
      dataList: rankData.rankList
    })
    wx.hideNavigationBarLoading();

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
})