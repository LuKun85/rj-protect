// pages/primary/recycleDate.js


var server = require("../../utils/serverAPI.js");
var config = require("../../config/config.js");
var util = require("../../utils/util.js");


Page({

  /**
   * 页面的初始数据
   */
  data: {
      searchActive: false,
      searchMaskClass: 'maskpage',
  
      queryAddressName: '',
      defaultFromTime: '08:00',
      defaultEndTime: '18:00',
      recycleList: [],
      month: '',
      filePath: ''

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
      var date=new Date;
      var year=date.getFullYear(); 
      var month=date.getMonth()+1;

      var filepath =  `${server.url}/file/download?instId=${config.config.instId}&platformType=${config.config.platformType}&fileId=`
        this.setData({
        month:month,
        filepath: filepath
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

    //每次页面刷新进来都重新加载回收点信息
    var params = {
      "instId": config.config.instId,
      "platformType": config.config.platformType,
      "rankDataType": "A"
    };
    server.GET(server.api.getRecycleDateList, params).then(res => {
      if ('000000' == res.respCode) {
          console.info("res", res)
          this.setData({
            recycleList: res.responseBody.queryList != null ? res.responseBody.queryList: []
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
      console.info("加载回收点信息异常=", res)
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


  hideSearchMask: function(e) {
    console.info("隐藏mask")
     this.setData({
       searchActive: false
     })
  },

  showSearchDialog: function(e) {
    console.info("显示搜索框")
     this.setData({
       searchActive: true
     })
  },

  activateSearch: function(e) {
     console.info("显示搜索框")
     this.setData({
       searchActive: true
     })
  },

  enterSearchCondition: function(e){
     var that = this;
     that.setData({
       queryAddressName: e.detail.value
     })
  },

  searchHouseparkRecycle: function(){
    
   var params = {
      "instId": config.config.instId,
      "platformType": config.config.platformType,
      "queryAddressName":  this.data.queryAddressName
    };
    server.GET(server.api.getRecycleDateList, params).then(res => {
      if ('000000' == res.respCode) {
          console.info("res", res)
          this.setData({
            recycleList: res.responseBody.queryList != null ? res.responseBody.queryList: []
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
      console.info("查询回收点信息异常=", res)
      wx.hideLoading();
    });

  }


})