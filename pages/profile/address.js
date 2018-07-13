// pages/profile/address.js

var server = require("../../utils/serverAPI.js");
var config = require("../../config/config.js")
var util = require("../../utils/util.js")
var getWxrequestPromisify = util.wxPromisify(wx.request);

const app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        memberId: '',
        memberAddressList: [],
        memberInfo: {},
        loginStatus: '',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {},

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {},

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {

        wx.showLoading({
            title: '加载中',
            mask: true
        })

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
                    memberId: memberId,
                    realFlag: realFlag
                })
                var loginStatus = app.globalData.loginStatus;
                that.setData({
                    loginStatus: loginStatus
                })
                var params = {
                    "instId": config.config.instId,
                    "platformType": config.config.platformType,
                    "memberId": memberId
                };
                server.GET(server.api.getMerchantAddressList, params).then(res => {
                    wx.hideLoading();
                    if ("000000" == res.respCode) {
                        that.setData({
                            memberAddressList: res.responseBody.queryResultList
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
                    wx.showToast({
                        title: res.respMsg,
                        icon: 'none',
                        duration: 2000
                    })
                })
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

    goAddNewAddressPage: function() {

        var memberId = this.data.memberId;
        wx.navigateTo({
            url: `/pages/profile/newAddress?memberId=${memberId}`,
        })

    },

    setMemberDefaultAddress: function(e) {

        var that = this;
        wx.showLoading({
            title: '加载中',
            mask: true
        })
        var params = {
            "instId": config.config.instId,
            "platformType": config.config.platformType,
            "memberId": this.data.memberId,
            "addressId": e.currentTarget.dataset.addressid
        };
        server.POST(server.api.setMerchantDefaultAddress, params).then(res => {
            wx.hideLoading();
            if ("000000" == res.respCode) {
                that.setData({
                    memberAddressList: res.responseBody.queryResultList
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
            wx.showToast({
                title: res.respMsg,
                icon: 'none',
                duration: 2000
            })
        })
    },

    deleteMemberAddress: function(e) {

        var that = this;
        wx.showModal({
            title: '提示',
            content: '删除用户地址信息',
            success: function(res) {
                if (res.confirm) {
                    wx.showLoading({
                        title: '加载中',
                        mask: true
                    })
                    var params = {
                        "instId": config.config.instId,
                        "platformType": config.config.platformType,
                        "memberId": that.data.memberId,
                        "addressId": e.currentTarget.dataset.addressid,
                    };
                    server.POST(server.api.deleteMerchantAddress, params).then(res => {
                        wx.hideLoading();
                        if ("000000" == res.respCode) {
                            that.setData({
                                memberAddressList: res.responseBody.queryResultList
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
                        wx.showToast({
                            title: res.respMsg,
                            icon: 'none',
                            duration: 2000
                        })
                    })
                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            }
        })
    },

    updateMemberAddress: function(e) {
        // wx.setStorage({
        //     key: 'addressId',
        //     data: e.currentTarget.dataset.addressid,
        // })
        var addressId = e.currentTarget.dataset.addressid;
        var memberId = this.data.memberId;
        wx.navigateTo({
            url: `/pages/profile/newAddress?addressId=${addressId}&memberId=${memberId}`,
        })

    },

})