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
        realFlag: '',
        memberId: '',

        memberPhoneNumber: '',
        memberPhoneNumberSecured: '',
        memberDefaultAddressId: '',
        memberDefaultAddress: '',
        memberDefaultHouseparkCode: '',
        packageOutCode: '',
        subPackageOutCode: '',
        applySubPackageCount: '0',
        applySubPackageSwitchFlag: 'checked',
        applySubPackageCountDisabledFlag: true,

        applyExtraGoodsDisabledFlag: true,
        applyExtraGoodsFlag: "N",
        applyExtraGoodsCountLevel: '00',


        datePickStart: '',
        datePickEnd: '',
        timePickStart: '09:00',
        timePickEnd: '18:00',

        appointmentFromDate: '',
        appointmentToDate: '',
        appointmentFromTime: '',
        appointmentToTime: '',
        appointmentTimeRange: '',

        houseparkRecycleDateTotalList: [],
        dateIndex: 0,
        houseparkRecycleDateList: [],
        houseparkRecycleTimeList: [],
        timeIndex: 0,

        countMethod: '00',

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var that = this;
        // var today = new Date();
        // var tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
        // var sevenDaysLater = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

        // var todayYear = today.getFullYear();
        // var todayMonth = today.getMonth() + 1;
        // if (todayMonth < 10) {
        //     todayMonth = '0' + todayMonth;
        // }
        // var todayDay = today.getDate() < 10 ? '0' + today.getDate() : today.getDate();

        // var tomorrowYear = tomorrow.getFullYear();
        // var tomorrowMonth = tomorrow.getMonth() + 1;
        // if (tomorrowMonth < 10) {
        //     tomorrowMonth = '0' + tomorrowMonth;
        // }
        // var tomorrowDay = tomorrow.getDate() < 10 ? '0' + tomorrow.getDate() : tomorrow.getDate();

        // var sevenDaysLaterYear = sevenDaysLater.getFullYear();
        // var sevenDaysLaterMonth = sevenDaysLater.getMonth() + 1;
        // if (sevenDaysLaterMonth < 10) {
        //     sevenDaysLaterMonth = '0' + sevenDaysLaterMonth;
        // }
        // var sevenDaysLaterDay = sevenDaysLater.getDate() < 10 ? '0' + sevenDaysLater.getDate() : sevenDaysLater.getDate();

        // that.setData({
        //     appointmentFromDate: todayYear + '-' + todayMonth + '-' + todayDay,
        //     appointmentToDate: todayYear + '-' + todayMonth + '-' + todayDay,
        //     datePickStart: tomorrowYear + '-' + tomorrowMonth + '-' + tomorrowDay,
        //     datePickEnd: sevenDaysLaterYear + '-' + sevenDaysLaterMonth + '-' + sevenDaysLaterDay,
        // });

        // wx.showLoading({
        //     title: '获取信息',
        // })
        // var getMemberId = setInterval(function() {
        //     var memberId = app.globalData.memberId;
        //     if (memberId != null && memberId != '' && memberId != undefined) {
        //         clearInterval(getMemberId);
        //         //如果用户没有注册过, 那么就跳转注册界面
        //         var realFlag = app.globalData.realFlag;
        //         if ('Y' != realFlag) {
        //             wx.redirectTo({
        //                 url: '/pages/login/signup',
        //             })
        //         }
        //         that.setData({
        //             memberId: memberId
        //         })
        //         var phone = app.globalData.memberPhoneNumber;
        //         if (phone == null || phone == '') {
        //             phone = '1**********'
        //         } else {
        //             phone = util.securityPhoneNumber(phone);
        //         }
        //         that.setData({
        //             memberPhoneNumberSecured: phone
        //         })

        //         var params = {
        //             "instId": config.config.instId,
        //             "platformType": config.config.platformType,
        //             "memberId": memberId,
        //         };
        //         server.GET(server.api.getMerchantDefaultAddress, params).then(res => {
        //             console.info("获取用户默认地址信息=", res)
        //             wx.hideLoading();
        //             if ('000000' == res.respCode) {
        //                 that.setData({
        //                     memberDefaultAddressId: res.responseBody.memberDefaultAddressId,
        //                     memberDefaultAddress: res.responseBody.memberDefaultShortAddress,
        //                 })
        //             } else {
        //                 wx.showToast({
        //                     title: res.respMsg,
        //                     icon: 'none',
        //                     duration: 2000
        //                 })
        //             }
        //         }).catch(res => {
        //             wx.hideLoading();
        //             console.info("获取用户默认地址信息-异常=", res)
        //         });
        //     }
        // }, 2000);

        var packageOutCode = app.globalData.packageOutCode;
        if (packageOutCode != null && packageOutCode != '' && packageOutCode != undefined) {
            that.setData({
                packageOutCode: app.globalData.packageOutCode
            })
        }
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {},

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {

        var that = this;
        wx.showLoading({
            title: '获取信息',
            mask: true
        })
        var getMemberId = setInterval(function() {
            var memberId = app.globalData.memberId;
            if (memberId != null && memberId != '' && memberId != undefined) {
                clearInterval(getMemberId);
                //如果用户没有注册过, 那么就跳转注册界面
                var realFlag = app.globalData.realFlag;
                if ('Y' != realFlag) {
                    wx.redirectTo({
                        url: '/pages/login/signup',
                    })
                }
                that.setData({
                    memberId: memberId
                })
                var phone = app.globalData.memberPhoneNumber;
                console.info("phone=", phone)
                if (phone == null || phone == '') {
                    phone = '1**********'
                } else {
                    phone = util.securityPhoneNumber(phone);
                }
                that.setData({
                    memberPhoneNumberSecured: phone
                })

                var params = {
                    "instId": config.config.instId,
                    "platformType": config.config.platformType,
                    "memberId": memberId,
                };
                server.GET(server.api.getMerchantDefaultAddress, params).then(res => {
                    console.info("获取用户默认地址信息=", res)
                    if ('000000' == res.respCode) {
                        that.setData({
                            memberDefaultAddressId: res.responseBody.memberDefaultAddressId,
                            memberDefaultAddress: res.responseBody.memberDefaultShortAddress,
                            memberDefaultHouseparkCode: res.responseBody.memberDefaultHouseparkCode
                        })
                        var params = {
                            "instId": config.config.instId,
                            "platformType": config.config.platformType,
                            "houseparkCode": that.data.memberDefaultHouseparkCode,
                        };
                        server.GET(server.api.getAppointmentChooseDate, params).then(res => {
                            console.info("获取预约时间碎片:", res)
                            wx.hideLoading();
                            if ("000000" == res.respCode) {
                                if (res.responseBody.queryList != null && res.responseBody.queryList != undefined && res.responseBody.queryList.length > 0) {
                                    that.setData({
                                        houseparkRecycleDateTotalList: res.responseBody.queryList,
                                        houseparkRecycleDateList: res.responseBody.queryList,
                                        houseparkRecycleTimeList: res.responseBody.queryList[0].recycleTimeList,
                                    })
                                }
                            } else {
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
                    } else {
                        wx.hideLoading();
                        wx.showToast({
                            title: res.respMsg,
                            icon: 'none',
                            duration: 2000
                        })
                        if ('200012' == res.respCode) {
                            wx.navigateTo({
                                url: `/pages/profile/address?memberId=${memberId}`,
                            })
                            return
                        }
                    }
                }).catch(res => {
                    wx.hideLoading();
                    console.info("获取用户默认地址信息-异常=", res)
                });
            }
        }, 1000);
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {},

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    },

    getHouseparkRecycleDate: function() {},

    bindDateChange: function(e) {
        var that = this;
        console.info("时间日期", e)
        that.setData({
            houseparkRecycleTimeList: that.data.houseparkRecycleDateList[e.detail.value].recycleTimeList,
            appointmentFromDate: that.data.houseparkRecycleDateList[e.detail.value].recycleDate,
            appointmentTimeRange: '',
            appointmentFromTime: '',
            appointmentToTime: '',

        })
    },
    bindTimeChange: function(e) {
        var that = this;
        console.info("时间改变", e)
        that.setData({
            appointmentTimeRange: that.data.houseparkRecycleTimeList[e.detail.value].chooseContent,
            appointmentFromTime: that.data.houseparkRecycleTimeList[e.detail.value].fromTime,
            appointmentToTime: that.data.houseparkRecycleTimeList[e.detail.value].ToTime,
        })
    },

    bindToTimeChange: function(e) {
        this.setData({
            appointmentToTime: e.detail.value
        })
    },

    applyExtraPackageSwitch: function(e) {
        this.setData({
            applySubPackageCountDisabledFlag: !e.detail.value
        })
        if (!e.detail.value) {
            this.setData({
                applySubPackageCount: '0',
            })
        }
    },

    applyExtraPackageCount: function(e) {
        this.setData({
            applySubPackageCount: e.detail.value
        })
    },

    enterSubPackageCount: function(e) {
        this.setData({
            applySubPackageCount: e.detail.value
        })
    },

    applyExtraGoodsSwitch: function(e) {
        if (!e.detail.value) {
            this.setData({
                applyExtraGoodsFlag: 'N',
                applyExtraGoodsCountLevel: '00',
            })
        } else {
            this.setData({
                applyExtraGoodsFlag: 'Y'
            })
        }
    },
    setExtraGoodsLevel: function(e) {
        this.setData({
            applyExtraGoodsCountLevel: e.detail.value
        })
    },

    // 确认信息, 进行预约
    confirmAppointmentOrder: function() {
        var that = this;
        if (util.checkEmpty(that.data.appointmentFromDate)) {
            wx.showToast({
                title: "请先选择预约日期",
                icon: 'none',
                duration: 2000
            })
            return;
        }
        if (util.checkEmpty(that.data.appointmentFromTime)) {
            wx.showToast({
                title: "请先选择预约时间",
                icon: 'none',
                duration: 2000
            })
            return;
        }
        if (util.checkEmpty(that.data.packageOutCode)) {
            wx.showToast({
                title: "请扫码获取袋子编码",
                icon: 'none',
                duration: 2000
            })
            return;
        }

        wx.showModal({
            title: '提示',
            content: '是否确认预约?',
            success: function(res) {
                var params = {
                    "instId": config.config.instId,
                    "platformType": config.config.platformType,
                    "memberId": that.data.memberId,
                    "addressId": that.data.memberDefaultAddressId,
                    "appointmentFromDate": that.data.appointmentFromDate,
                    "appointmentToDate": that.data.appointmentFromDate,
                    "appointmentFromTime": that.data.appointmentFromTime,
                    "appointmentToTime": that.data.appointmentToTime,
                    "appointmentPackageOutCode": that.data.packageOutCode,
                    "appointmentCountMethod": that.data.countMethod,
                    "appointmentExtraGoodsFlag": that.data.applyExtraGoodsFlag,
                    "appointmentExtraGoodsCountLevel": that.data.applyExtraGoodsCountLevel
                };
                server.POST(server.api.confirmAppointmentOrder, params).then(res => {
                    if ('000000' == res.respCode) {
                        wx.setStorageSync('successMessage', '预约成功')
                        wx.setStorageSync('successType', '02')
                        wx.redirectTo({
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
    regetPackageCode: function() {
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
                    "memberId": that.data.memberId,
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
    countMethodRadioChange: function(e) {
        console.info("e=", e)
        this.setData({
            countMethod: e.detail.value
        })
    }
})