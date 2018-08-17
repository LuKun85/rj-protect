// pages/primary/integralDetail.js

var server = require("../../utils/serverAPI.js");
var config = require("../../config/config.js")
var util = require("../../utils/util.js")

const app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {

        myIntegralDetail: [],
        pageSize: 20,
        pageCurrent: 1,
        pageNo: 0,
        myIntegral: 0

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var integral = options.myIntegral;
        var that = this;
        that.setData({
            myIntegral: integral
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
            title: '获取个人积分记录',
            mask: true
        })

        //获取用户信息 - 直到获取真的用户ID
        var that = this;
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
                server.GET(server.api.getMerchantIntegralDetail, params).then(res => {
                    wx.hideLoading();
                    if ('000000' == res.respCode) {
                        that.setData({
                            myIntegralDetail: res.responseBody.queryResultPage != null && res.responseBody.queryResultPage.list != null ? res.responseBody.queryResultPage.list : [],
                            pageCurrent: res.responseBody.queryResultPage.nextPage,
                            pageNo: res.responseBody.queryResultPage.pageNo
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
                    console.info("获取个人积分记录异常=", res)
                });
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

    getMoreIntegralList: function(e) {

        var that = this;

        var pageCurrent = that.data.pageCurrent
        if (pageCurrent < 0) {
            //到底了
            wx.showToast({
                title: '到底了',
                icon: 'none',
                duration: 2000
            })
            return;
        }

        wx.showLoading({
            title: 'loading',
            mask: 'true'
        })

        var params = {
            "instId": config.config.instId,
            "platformType": config.config.platformType,
            "nonceStr": new Date().getTime,
            "pageSize": that.data.pageSize,
            "pageCurrent": that.data.pageCurrent
        };
        server.GET(server.api.getMerchantIntegralDetail, params).then(res => {
            if ('000000' == res.respCode) {
                console.info("res", res)
                var nextPage = res.responseBody.queryResultPage.nextPage;
                if (nextPage == 0) {
                    //到底了
                    wx.showToast({
                        title: '到底了',
                        icon: 'none',
                        duration: 2000
                    })
                    return;
                }
                var newList = that.data.myIntegralDetail.concat(res.responseBody.queryResultPage.list)
                this.setData({
                    myIntegralDetail: newList,
                    pageCurrent: res.responseBody.queryResultPage.nextPage,
                    pageNo: res.responseBody.queryResultPage.pageNo
                })
            } else {
                wx.showToast({
                    title: res.respMsg,
                    icon: 'none',
                    duration: 2000
                })
            }
            wx.hideLoading();
        }).catch(res => {
            console.info("获取个人积分记录异常=", res)
            wx.hideLoading();
        });

    },




})