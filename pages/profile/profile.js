// pages/profile/profile.js

var server = require("../../utils/serverAPI.js");
var config = require("../../config/config.js")
var util = require("../../utils/util.js")

var getWxrequestPromisify = util.wxPromisify(wx.request);

//获取应用实例
const app = getApp()
const QQMapWX = require('../../utils/qqmap-wx-jssdk.js')

Page({
  /**
   * 页面的初始数据
   */
  data: {
    memberInfo: {},
    loginStatus: '',

    showShouYinTaiStatus: false,
    applyPackageType: "R",
    applyPackageCount: 1,
    payMethod: "ONLINE",
    totalApplyPackagePrice: 10.00,
    payButtonStatus: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    // var that = this;
    // wx.showLoading({
    //   title: '登录中',
    // })
    // var getmember = setInterval(function () {
    //   var member = wx.getStorageSync("memberInfo");
    //   console.info("首页登录后从缓存中获取数据信息:", new Date().getTime())
    //   if (member != null) {
    //     that.setData({
    //       memberInfo: wx.getStorageSync("memberInfo")
    //     })
    //     that.setData({
    //       loginStatus: wx.getStorageSync("loginStatus")
    //     })
    //     wx.hideLoading()
    //     clearInterval(getmember);
    //     return;
    //   }
    // }, 2000);

    // 实例化API核心类
    const qqmapsdk = new QQMapWX({
      key: 'B7FBZ-GPGRU-7XOVG-BDGOM-W5DWQ-2LBZL'
    })

    wx.getLocation({
      type: 'wgs84',
      success: res => {
        //获取成功则调用地图解析
        let realaddress = ''
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: res.latitude,
            longitude: res.longitude
          },
          success: res => {
            this.setData({ locationCity: res.result.address })
          }
        })
      }
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

    var realFlag = app.globalData.realFlag;
    if('Y' != realFlag){
        wx.redirectTo({
           url: '/pages/login/signup',
        })
    }

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

    var loginStatus = app.globalData.loginStatus;
    if('Y' == loginStatus){
      this.setData({
        loginStatus: 'Y'
      })
    }

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
   * 绑定袋子
   * 
   * 1> 检查袋子是否绑定过, 如果没有绑定, 提提示用户是否进行绑定
   * 
   */
  bindPackage: function () {
    var that = this;
    wx.removeStorage({
      key: 'packageQrcode',
      success: res => {
        console.info("删除袋子二维码缓存成功")
      },
    })
    wx.scanCode({
      onlyFromCamera: true,
      success: (res) => {
        var packageQrcode = res.result;
        that.setData({
          packageQrcode: res.result
        })
        wx.setStorage({
          key: 'packageQrcode',
          data: packageQrcode,
          success: res => {
          }
        })
        var params = {
          "instId": config.config.instId,
          "platformType": config.config.platformType,
          "memberId": that.data.memberInfo.memberId,
          "packageOutCode": packageQrcode
        };
        server.POST(server.api.checkBind, params).then(res => {
          if ("000000" == res.respCode) {
            wx.showModal({
              title: '提示',
              content: '是否确定绑定这个袋子?',
              success: res => {
                var params = {
                  "instId": config.config.instId,
                  "platformType": config.config.platformType,
                  "memberId": that.data.memberInfo.memberId,
                  "packageOutCode": packageQrcode
                };
                server.POST(server.api.bindPackage, params).then(res => {
                  if ('000000' == res.respCode) {
                    wx.setStorageSync('successMessage', '绑定成功')
                    wx.navigateTo({
                      url: '/pages/result/success',
                    })
                  } else {
                    wx.showToast({
                      title: res.respMsg,
                      icon: 'none',
                      duration: 2000
                    })
                  }
                });
              }
            })
          } else {
            wx.showToast({
              title: res.respMsg,
              icon: 'none',
              duration: 2000
            })
          }
        }).catch(res => {
          wx.showToast({
            title: res.respMsg,
            icon: 'none',
            duration: 2000
          })
        })
      }
    })
  },
  /**
   * 点击添加动态
   */
  onClinkAddPhoto: function () {
    var that = this;
    wx.navigateTo({
      url: '/pages/circle/publishCircle',
      success: () => {
        that.setData({
          currentTab: 0
        })
      }
    })
  },

  // 收银台弹层
  showShouYinTai: function () {
    // 显示遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
      showShouYinTaiStatus: true
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 200)
  },

  hideShouYinTai: function () {
    // 隐藏遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        showShouYinTaiStatus: false
      })
    }.bind(this), 200)

    this.setData({
      payButtonStatus: false
    })
  },

  applyPackageCount: function (e) {
    var reg = /^[1-9]+[0-9]*]*$/;
    if (!reg.test(e.detail.value)) {
      return;
    }
    this.setData({
      applyPackageCount: e.detail.value,
      totalApplyPackagePrice: e.detail.value * 10
    })
  },
  enterPackageCount: function (e) {
    var reg = /^[1-9]+[0-9]*]*$/;
    if (!reg.test(e.detail.value)) {
      return;
    }
    this.setData({
      applyPackageCount: e.detail.value,
      totalApplyPackagePrice: e.detail.value * 10
    })
  },
  payMethodRadioChange: function (e) {
    this.setData({
      payMethod: e.detail.value,
    })
  },
  packageTypeRadioChange: function (e) {
    this.setData({
      applyPackageType: e.detail.value,
    })
  },

  payApplyPackage: function (e) {

    var that = this;
    //前往支付
    this.setData({
      payButtonStatus: true,
      showShouYinTaiStatus: false
    })
    //
    wx.showLoading({
      title: '支付中',
      mask: true
    })
    var params = {
      "instId": config.config.instId,
      "platformType": config.config.platformType,
      "memberId": that.data.memberInfo.memberId,
      "packageType": that.data.applyPackageType,
      "payMethod": that.data.payMethod,
      "packagePrice": "10",
      "payPrice": "0.01",
      "applyPackageCount": that.data.applyPackageCount
    };
    server.POST(server.api.applyPackage, params).then(res => {
      wx.hideLoading();
      if ("000000" == res.respCode) {
        console.info("微信支付下单成功:", res)
        var payOrderNo = res.responseBody.payOrderNo;
        wx.requestPayment({
          'timeStamp': res.responseBody.timeStamp,
          'nonceStr': res.responseBody.nonce_str,
          'package': res.responseBody.prepay_id,
          'signType': 'MD5',
          'paySign': res.responseBody.paySign,
          'success': res => {
            console.info("微信支付支付成功")
            var params = {
              "instId": config.config.instId,
              "platformType": config.config.platformType,
              "memberId": that.data.memberInfo.memberId,
              "applyPackageOrderId": payOrderNo,
              "applyPackagePayStatus": 'SUCCESS',
            };
            server.POST(server.api.updatePackageOrderStatus, params).then(res => {
              if ('000000' == res.respCode) {
                wx.setStorageSync('successMessage', '支付成功')
                wx.navigateTo({
                  url: '/pages/result/success',
                })
              } else {
                wx.showToast({
                  title: res.respMsg,
                  icon: 'none',
                  mask: true
                })
              }
            })
          },
          'fail': function (res) {
            console.info("支付失败", res)
          },
          'complete': function (res) {
            console.info("支付完成", res)
          }
        })
      } else {
        wx.showToast({
          title: res.respMsg,
          icon: 'none',
          duration: 2000
        })
      }
    }).catch(res => {
      console.info("购买袋子下单支付异常:", res)
    });
  },

  //   var requestBody = {
  //     "instId": config.config.instId,
  //     "platformType": config.config.platformType,
  //     "memberId": that.data.memberInfo.memberId,
  //     "packageType": that.data.applyPackageType,
  //     "payMethod": that.data.payMethod,
  //     "packagePrice": "10",
  //     "payPrice": "0.01",
  //     "applyPackageCount": that.data.applyPackageCount
  //   };
  //   var sign = util.genSign(requestBody);
  //   var requestbody = util.encryptRequestBody(requestBody);

  //   getWxrequestPromisify({
  //     method: "POST",
  //     url: server.serverAPI.merchantApplyPackage,
  //     data: {
  //       instId: config.config.instId,
  //       platformType: config.config.platformType,
  //       requestBody: requestbody,
  //       sign: sign
  //     }
  //   }).then(
  //     res => {
  //       if ("000000" == res.data.respCode) {
  //         wx.requestPayment({
  //           'timeStamp': res.data.responseBody.timeStamp,
  //           'nonceStr': res.data.responseBody.nonce_str,
  //           'package': res.data.responseBody.prepay_id,
  //           'signType': 'MD5',
  //           'paySign': res.data.responseBody.paySign,
  //           'success': res => {
  //             console.info("支付成功", res)
  //           },
  //           'fail': function (res) {
  //             console.info("支付失败", res)
  //           },
  //           'complete': function (res) {
  //             console.info("支付完成", res)
  //           }
  //         })
  //       } else {
  //         wx.showToast({
  //           title: res.data.respMsg,
  //           icon: 'none',
  //           duration: 2000
  //         })
  //       }
  //     });
  //   wx.hideLoading();
  // },

  showLoginPage: function () {
    wx.navigateTo({
      url: '/pages/login/loginSwitch',
    })
  },

  showMemberAddressList: function () {
    wx.navigateTo({
      url: '/pages/profile/address',
    })
  },

    showMemberPackageList: function () {
    wx.navigateTo({
      url: '/pages/profile/mypackage',
    })
  },

  showService: function () {

  }
})