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
        realFlag: '',
        memberId: '',
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
    onLoad: function(options) {

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
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {

        wx.showLoading({
            title: '获取用户信息',
            mask: true
        })

        var that = this;
        var getMemberId = setInterval(function() {
            var memberId = app.globalData.memberId;
            console.info("memberId=", memberId)
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

                that.setData({
                    realFlag: realFlag
                })
                var loginStatus = app.globalData.loginStatus;
                that.setData({
                    loginStatus: loginStatus
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
                if ('Y' == loginStatus) {
                    that.setData({
                        loginStatus: 'Y'
                    })
                }
            }
        }, 1000)
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

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

    /**
     * 绑定袋子
     * 
     * 1> 检查袋子是否绑定过, 如果没有绑定, 提提示用户是否进行绑定
     * 
     */
    bindPackage: function() {
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
                    success: res => {}
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
    onClinkAddPhoto: function() {
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
    showShouYinTai: function() {
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
        setTimeout(function() {
            animation.translateY(0).step()
            this.setData({
                animationData: animation.export()
            })
        }.bind(this), 200)
    },

    hideShouYinTai: function() {
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
        setTimeout(function() {
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

    applyPackageCount: function(e) {
        var reg = /^[1-9]+[0-9]*]*$/;
        if (!reg.test(e.detail.value)) {
            return;
        }
        this.setData({
            applyPackageCount: e.detail.value,
            totalApplyPackagePrice: e.detail.value * 10
        })
    },
    enterPackageCount: function(e) {
        var reg = /^[1-9]+[0-9]*]*$/;
        if (!reg.test(e.detail.value)) {
            return;
        }
        this.setData({
            applyPackageCount: e.detail.value,
            totalApplyPackagePrice: e.detail.value * 10
        })
    },
    payMethodRadioChange: function(e) {
        this.setData({
            payMethod: e.detail.value,
        })
    },
    packageTypeRadioChange: function(e) {
        this.setData({
            applyPackageType: e.detail.value,
        })
    },

    payApplyPackage: function(e) {

        var that = this;
        //前往支付
        that.setData({
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
                        that.setData({
                            "memberInfo.avaiblePackageCount": that.data.memberInfo.avaiblePackageCount + 1
                        })
                        server.POST(server.api.updatePackageOrderStatus, params).then(res => {
                            console.info("更新购买袋子订单状态=", res)
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
                            wx.hideLoading();
                        }).catch(res => {
                            wx.hideLoading();
                            console.info("更新购买袋子订单状态失败:", res)
                        })
                    },
                    'fail': function(res) {
                        wx.hideLoading();
                        console.info("支付失败", res)
                    },
                    'complete': function(res) {
                        wx.hideLoading();
                        console.info("支付完成", res)
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
            console.info("购买袋子下单支付异常:", res)
        });
    },

    showLoginPage: function() {
        wx.navigateTo({
            url: '/pages/login/loginSwitch',
        })
    },

    showMemberAddressList: function() {
        wx.navigateTo({
            url: `/pages/profile/address?memberId=${this.data.memberId}`,
        })
    },

    showMemberPackageList: function() {
        wx.navigateTo({
            url: '/pages/profile/mypackage',
        })
    },

    showService: function() {

    }
})