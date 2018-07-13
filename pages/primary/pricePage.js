// pages/primary/pricePage.js

var mock = require("../../mock/priceItem.js")

var server = require("../../utils/serverAPI.js");
var config = require("../../config/config.js")
var util = require("../../utils/util.js")

///不需要登录 - 直接就可以获取

Page({

    /**
     * 页面的初始数据
     */
    data: {
        memberInfo: {},
        loginStatus: '',
        realFlag: '',

        goodsPriceList: [],
        nowDate: '',
        nowTime: '',
        pageSize: 20,
        pageCurrent: 1,
        pageNo: 0,

        scrollWeightHeight: ''
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
        var today = new Date();

        var todayYear = today.getFullYear();
        var todayMonth = today.getMonth() + 1;
        if (todayMonth < 10) {
            todayMonth = '0' + todayMonth;
        }
        var todayDay = today.getDate() < 10 ? '0' + today.getDate() : today.getDate();
        var todayDate = todayYear + '-' + todayMonth + '-' + todayDay;

        var getTime = setInterval(function() {
            var now = new Date();
            var time = now.getHours() + ":" + now.getMinutes() +
                ":" + now.getSeconds()
            that.setData({
                nowTime: time
            })
        }, 1000);

        wx.showLoading({
            title: 'loading',
            mask: 'true'
        })

        wx.getSystemInfo({
            success: function(res) {
                that.setData({
                    scrollWeightHeight: res.windowHeight
                });
            }
        });

        var params = {
            "instId": config.config.instId,
            "platformType": config.config.platformType,
            "nonceStr": new Date().getTime,
            "pageSize": that.data.pageSize,
            "pageCurrent": that.data.pageCurrent
        };
        server.GET(server.api.getGoodsPrice, params).then(res => {
            if ('000000' == res.respCode) {
                console.info("res", res)
                this.setData({
                    goodsPriceList: res.responseBody.queryResultPage.list,
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
            console.info("获取价格页面异常=", res)
            wx.hideLoading();
        });

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

    getMorePirceList: function(e) {

        console.info("e", e)
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
        server.GET(server.api.getGoodsPrice, params).then(res => {
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
                var newList = that.data.goodsPriceList.concat(res.responseBody.queryResultPage.list)
                this.setData({
                    goodsPriceList: newList,
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
            console.info("获取价格页面异常=", res)
            wx.hideLoading();
        });

    }



})