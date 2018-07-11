// pages/profile/address.js

var server = require("../../utils/serverAPI.js");
var config = require("../../config/config.js")
var util = require("../../utils/util.js")
var getWxrequestPromisify = util.wxPromisify(wx.request);

Page({

  /**
   * 页面的初始数据
   */
  data: {

    memberAddressList: [],
    memberInfo: {},
    loginStatus: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取用户号和检查是否实名
    wx.getStorage({
      key: 'memberInfo',
      success: res => {
        this.setData({
          memberInfo: res.data
        })
      }
    })
    wx.getStorage({
      key: 'loginStatus',
      success: res => {
        this.setData({
          loginStatus: res.data
        })
      }
    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

    // wx.showLoading({
    //   title: '获取地址',
    // })
    var requestBody = {
      "instId": config.config.instId,
      "platformType": config.config.platformType,
      "memberId": this.data.memberInfo.memberId
    };
    var sign = util.genSign(requestBody);
    var requestbody = util.encryptRequestBody(requestBody);

    getWxrequestPromisify({
      method: "GET",
      url: server.serverAPI.merchantAddressList,
      data: {
        instId: config.config.instId,
        platformType: config.config.platformType,
        requestBody: requestbody,
        sign: sign
      }
    }).then(
      res => {
        if ("000000" == res.data.respCode) {
          this.setData({
            memberAddressList: res.data.responseBody.queryResultList
          })
        }
      });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {




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

  goAddNewAddressPage: function () {

    wx.removeStorage({
      key: 'addressId',
      success: function (res) { },
    })

    wx.navigateTo({
      url: '/pages/profile/newAddress',
    })
  },

  setMemberDefaultAddress: function (e) {
    console.info("e=", e.currentTarget.dataset.addressid)
    var requestBody = {
      "instId": config.config.instId,
      "platformType": config.config.platformType,
      "memberId": this.data.memberInfo.memberId,
      "addressId": e.currentTarget.dataset.addressid,
    };
    var sign = util.genSign(requestBody);
    var requestbody = util.encryptRequestBody(requestBody);

    getWxrequestPromisify({
      method: "POST",
      url: server.serverAPI.merchantSetDefaultAddress,
      data: {
        instId: config.config.instId,
        platformType: config.config.platformType,
        requestBody: requestbody,
        sign: sign
      }
    }).then(
      res => {
        if ("000000" == res.data.respCode) {
          this.setData({
            memberAddressList: res.data.responseBody.queryResultList
          })
        }
      })

  },

  deleteMemberAddress: function (e) {
    
    var that = this;
    wx.showModal({
      title: '提示',
      content: '删除用户地址信息',
      success: function (res) {
        if (res.confirm) {
          var requestBody = {
            "instId": config.config.instId,
            "platformType": config.config.platformType,
            "memberId": that.data.memberInfo.memberId,
            "addressId": e.currentTarget.dataset.addressid,
          };
          var sign = util.genSign(requestBody);
          var requestbody = util.encryptRequestBody(requestBody);

          getWxrequestPromisify({
            method: "POST",
            url: server.serverAPI.merchantDeleteAddress,
            data: {
              instId: config.config.instId,
              platformType: config.config.platformType,
              requestBody: requestbody,
              sign: sign
            }
          }).then(
            res => {
              if ("000000" == res.data.respCode) {
                that.setData({
                  memberAddressList: res.data.responseBody.queryResultList
                })
              }
            })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  updateMemberAddress: function (e) {

     wx.setStorage({
       key: 'addressId',
       data: e.currentTarget.dataset.addressid,
     })

     wx.navigateTo({
       url: '/pages/profile/newAddress',
     })

  },

})