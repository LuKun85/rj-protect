// pages/appointment/appointmentTabPage.js

var server = require("../../utils/serverAPI.js");
var config = require("../../config/config.js")
var util = require("../../utils/util.js")

const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        memberInfo: {},
        loginStatus: '',
        memberId: '',
        realFlag: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {

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

        var that = this;
        wx.showLoading({
            title: '加载中...',
            mask: true
        })
        var getMemberId = setInterval(function() {
            var memberId = app.globalData.memberId;
            if (memberId != null && memberId != '' && memberId != undefined) {
                clearInterval(getMemberId);
                wx.hideLoading();
                //如果用户没有注册过, 那么就跳转注册界面
                var realFlag = app.globalData.realFlag;
                // if ('Y' != realFlag) {
                //     wx.redirectTo({
                //         url: '/pages/login/signup',
                //     })
                // }
                that.setData({
                    memberId: memberId,
                    realFlag: realFlag
                })
            }
        }, 1000);

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

    // 扫码进入预约界面
    goAppointmentPage: function() {

        var that = this;

        if ('Y' != that.data.realFlag) {
            wx.redirectTo({
                url: '/pages/login/signup',
            })
            return;
        }

        wx.removeStorage({
            key: 'packageQrcode',
            success: res => {
                console.info("删除袋子二维码缓存成功")
            },
        })

        app.globalData.packageOutCode = '';

        wx.scanCode({
            onlyFromCamera: true,
            success: (res) => {
                wx.showLoading({
                    title: '请等待...',
                    mask: true
                })
                var packageQrcode = res.result;
                var params = {
                    "instId": config.config.instId,
                    "platformType": config.config.platformType,
                    "memberId": that.data.memberId,
                    "packageOutCode": packageQrcode
                };

                app.globalData.packageOutCode = packageQrcode;

                server.POST(server.api.checkBind, params).then(res => {
                    if ("000000" == res.respCode) {
                        //不用确定->直接去绑定袋子
                        var params = {
                            "instId": config.config.instId,
                            "platformType": config.config.platformType,
                            "memberId": that.data.memberId,
                            "packageOutCode": packageQrcode
                        };
                        server.POST(server.api.bindPackage, params).then(res => {
                            if ('000000' == res.respCode || '300017' == res.respCode) {
                                wx.navigateTo({
                                    url: '/pages/appointment/appointment',
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
                        wx.navigateTo({
                            url: '/pages/appointment/appointment',
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
    }

})