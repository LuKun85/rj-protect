// pages/appointment/appointment.js

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
    loginStatus: '',

    memberPhoneNumber: '',
    memberPhoneNumberSecured: '',
    memberDefaultAddressId: '',
    memberDefaultAddress: '',
    packageOutCode: '',
    subPackageOutCode: '',
    applySubPackageCount: '0',
    applySubPackageSwitchFlag: 'checked',
    applySubPackageCountDisabledFlag: true,

    applyExtraGoodsDisabledFlag: true,
    applyExtraGoodsFlag: false,
    applyExtraGoodsCountLevel: '00',


    datePickStart: '',
    datePickEnd: '',
    timePickStart: '09:00',
    timePickEnd: '18:00',

    appointmentFromDate: '',
    appointmentToDate: '',
    appointmentFromTime: '09:00',
    appointmentToTime: '18:00',

    countMethod: '00',

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var today = new Date();
    var tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
    var sevenDaysLater = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

    var todayYear = today.getFullYear();
    var todayMonth = today.getMonth() + 1;
    if (todayMonth < 10) {
      todayMonth = '0' + todayMonth;
    }
    var todayDay = today.getDate() < 10 ? '0' + today.getDate() : today.getDate();

    var tomorrowYear = tomorrow.getFullYear();
    var tomorrowMonth = tomorrow.getMonth() + 1;
    if (tomorrowMonth < 10) {
      tomorrowMonth = '0' + tomorrowMonth;
    }
    var tomorrowDay = tomorrow.getDate() < 10 ? '0' + tomorrow.getDate() : tomorrow.getDate();

    var sevenDaysLaterYear = sevenDaysLater.getFullYear();
    var sevenDaysLaterMonth = sevenDaysLater.getMonth() + 1;
    if (sevenDaysLaterMonth < 10) {
      sevenDaysLaterMonth = '0' + sevenDaysLaterMonth;
    }
    var sevenDaysLaterDay = sevenDaysLater.getDate() < 10 ? '0' + sevenDaysLater.getDate() : sevenDaysLater.getDate();

    // that.setData({
    //   appointmentFromDate: today.getFullYear() + '-' + (today.getMonth() < 10 ? '0' + (today.getMonth() + 1).toString() : today.getMonth()) + '-' + today.getDate(),
    //   appointmentToDate: today.getFullYear() + '-' + (today.getMonth() < 10 ? '0' + (today.getMonth() + 1).toString() : today.getMonth()) + '-' + today.getDate(),
    //   datePickStart: tomorrow.getFullYear() + '-' + (tomorrow.getMonth() < 10 ? '0' + (tomorrow.getMonth() + 1).toString() : tomorrow.getMonth()) + '-' + tomorrow.getDate(),
    //   datePickEnd: sevenDaysLater.getFullYear() + '-' + (sevenDaysLater.getMonth() < 10 ? sevenDaysLater.getMonth() + 1 : '0' + sevenDaysLater.getMonth()) + '-' + sevenDaysLater.getDate()
    // });

    that.setData({
      appointmentFromDate: todayYear + '-' + todayMonth + '-' + todayDay,
      appointmentToDate: todayYear + '-' + todayMonth + '-' + todayDay,
      datePickStart: tomorrowYear + '-' + tomorrowMonth + '-' + tomorrowDay,
      datePickEnd: sevenDaysLaterYear + '-' + sevenDaysLaterMonth + '-' + sevenDaysLaterDay,
    });

    wx.showLoading({
      title: '获取用户信息',
    })
    var getmember = setInterval(function () {
      var member = wx.getStorageSync("memberInfo");
      console.info("获取用户的默认地址:", new Date())
      if (member != null) {
        that.setData({
          memberInfo: member
        })
        that.setData({
          loginStatus: wx.getStorageSync("loginStatus")
        })
        var phone = member.memberPhoneNumber;
        if (phone == null || phone == '') {
          phone = '1**********'
        } else {
          phone = util.securityPhoneNumber(phone);
        }
        that.setData({
          memberInfo: member,
          memberPhoneNumberSecured: phone
        })
        var params = {
          "instId": config.config.instId,
          "platformType": config.config.platformType,
          "memberId": member.memberId,
        };
        server.GET(server.api.getMerchantGetDefaultAddress, params).then(res => {
          console.info("获取用户默认地址=", res)
          wx.hideLoading();
          if ('000000' == res.respCode) {
            that.setData({
              memberDefaultAddressId: res.responseBody.memberDefaultAddressId,
              memberDefaultAddress: res.responseBody.memberDefaultShortAddress,
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
          console.info("获取价格页面异常=", res)
        });
        wx.hideLoading()
        clearInterval(getmember);
        return;
      }
    }, 2000);

     that.setData({
      packageOutCode: app.globalData.packageOutCode
     })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

    // //获取用户号和检查是否实名
    // wx.getStorage({
    //   key: 'memberInfo',
    //   success: res => {
    //     this.setData({
    //       memberInfo: res.data
    //     })
    //   }
    // })
    // wx.getStorage({
    //   key: 'loginStatus',
    //   success: res => {
    //     this.setData({
    //       loginStatus: res.data
    //     })
    //   }
    // })

    // wx.getStorage({
    //   key: 'packageQrcode',
    //   success: res => {
    //     this.setData({
    //       packageOutCode: res.data
    //     })
    //   },
    //   fail: res => {
    //     this.setData({
    //       packageOutCode: null
    //     })
    //   }
    // })
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

  bindDateChange: function (e) {
    this.setData({
      appointmentFromDate: e.detail.value,
      appointmentToDate: e.detail.value
    })
  },
  bindFromTimeChange: function (e) {
    this.setData({
      appointmentFromTime: e.detail.value
    })
  },

  bindToTimeChange: function (e) {
    this.setData({
      appointmentToTime: e.detail.value
    })
  },

  applyExtraPackageSwitch: function (e) {
    this.setData({
      applySubPackageCountDisabledFlag: !e.detail.value
    })
    if (!e.detail.value) {
      this.setData({
        applySubPackageCount: '0',
      })
    }
  },

  applyExtraPackageCount: function (e) {
    this.setData({
      applySubPackageCount: e.detail.value
    })
  },

  enterSubPackageCount: function (e) {
    this.setData({
      applySubPackageCount: e.detail.value
    })
  },

  applyExtraGoodsSwitch: function (e) {
    this.setData({
      applyExtraGoodsFlag: e.detail.value
    })
    if (!e.detail.value) {
      this.setData({
        applyExtraGoodsCountLevel: '00',
      })
    }
  },
  setExtraGoodsLevel: function (e) {
    this.setData({
      applyExtraGoodsCountLevel: e.detail.value
    })
  },

  // 确认信息, 进行预约
  confirmAppointmentOrder: function () {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '是否确认预约?',
      success: function (res) {
        var params = {
          "instId": config.config.instId,
          "platformType": config.config.platformType,
          "memberId": that.data.memberInfo.memberId,
          "addressId": that.data.memberDefaultAddressId,
          "appointmentFromDate": that.data.appointmentFromDate,
          "appointmentToDate": that.data.appointmentToDate,
          "appointmentFromTime": that.data.appointmentFromTime,
          "appointmentToTime": that.data.appointmentToTime,
          "appointmentPackageOutCode": that.data.packageOutCode,

          "appointmentCountMethod": that.data.countMethod,
        };
        server.POST(server.api.confirmAppointmentOrder, params).then(res => {
          if ('000000' == res.respCode) {
            wx.setStorageSync('successMessage', '预约成功')
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
  },

  // 重新获取袋子上的二维码信息
  regetPackageCode: function () {
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
        wx.showLoading({
          title: '请等待.....',
          mask: true
        })
        var packageQrcode = res.result;
        var params = {
          "instId": config.config.instId,
          "platformType": config.config.platformType,
          "memberId": that.data.memberInfo.memberId,
          "packageOutCode": packageQrcode
        };
        server.POST(server.api.checkBind, params).then(res => {
          if ("000000" == res.respCode) {
            //不用确定->直接去绑定袋子
            var params = {
              "instId": config.config.instId,
              "platformType": config.config.platformType,
              "memberId": that.data.memberInfo.memberId,
              "packageOutCode": packageQrcode
            };
            server.POST(server.api.bindPackage, params).then(res => {
              if ('000000' == res.respCode) {
                wx.setStorage({
                  key: 'packageQrcode',
                  data: packageQrcode,
                  success: res => {
                    that.setData({
                      packageOutCode: packageQrcode
                    })
                  }
                })
              } else {
                wx.hideLoading();
                wx.showToast({
                  title: res.respMsg,
                  icon: 'none',
                  duration: 2000
                })
              }
            });
          } else if ("300017" == res.respCode) {
            wx.hideLoading();
            wx.setStorage({
              key: 'packageQrcode',
              data: packageQrcode,
              success: res => {
                that.setData({
                  packageOutCode: packageQrcode
                })
              }
            })
          } else {
            wx.hideLoading();
            wx.showToast({
              title: res.respMsg,
              icon: 'none',
              duration: 2000
            })
          }
        }).catch(res => {
          wx.hideLoading();
          wx.showToast({
            title: res.respMsg,
            icon: 'none',
            duration: 2000
          })
        })
      }
    })
  },

  // 盘点方式
  countMethodRadioChange: function (e) {
    console.info("e=", e)
    this.setData({
      countMethod: e.detail.value
    })
  }
})