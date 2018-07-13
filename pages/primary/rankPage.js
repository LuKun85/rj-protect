// pages/rank/rank.js

var rankData = require('../../utils/rankList.js');

var server = require("../../utils/serverAPI.js");
var config = require("../../config/config.js");
var util = require("../../utils/util.js");

const app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        datapage: {
            pageCount: 10,
            pageCurrent: 1,
            pageTotal: 1,
            totalCount: 100
        },
        dataList: null,
        scrollTop: 0,
        scrollHeight: 0,

        rankDataList: [],

        currentTab: '0',
        memberInfo: {},
        mymemberId: '123131',

        toMemberRankItem: '#'
    },


    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {

        var that = this
        wx.getSystemInfo({
            success: function(res) {
                that.setData({
                    scrollHeight: res.windowHeight
                });
            }
        });

        that.setData({
            dataList: rankData.rankList
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
            title: '获取中',
            mask: true
        })

        var that = this;
        var getMemberId = setInterval(function() {
            var memberId = app.globalData.memberId;
            console.info("memberId=", memberId)
            if (memberId != null && memberId != '' && memberId != undefined) {
                clearInterval(getMemberId);
                wx.hideLoading();
                that.setData({
                    mymemberId: memberId
                })
            }
        }, 1000)

        //每次页面刷新进来都重新加载排行榜数据
        var params = {
            "instId": config.config.instId,
            "platformType": config.config.platformType,
            "rankDataType": "Q"
        };
        server.GET(server.api.getRankData, params).then(res => {
            if ('000000' == res.respCode) {
                console.info("res", res)
                this.setData({
                    rankDataList: res.responseBody.queryResultPage != null && res.responseBody.queryResultPage.list != null ? res.responseBody.queryResultPage.list : []
                })
            } else {
                wx.showToast({
                    title: res.respMsg,
                    icon: 'none',
                    duration: 2000
                })
            }
        }).catch(res => {
            console.info("获取排行榜数据异常=", res)
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

    //   该方法绑定了页面滑动到底部的事件
    bindDownLoad: function() {
        var that = this;
        var newRankList = rankData.rankList.concat(rankData.rankList2);
        that.setData({ dataList: newRankList })
    },
    //  该方法绑定了页面滚动时的事件
    scroll: function(event) {
        this.setData({
            scrollTop: event.detail.scrollTop
        });
    },


    //滑动切换
    swiperTab: function(e) {
        console.info("swiperTab=", e)
        var that = this;
        that.setData({
            currentTab: e.target.dataset.current
        })
        var rankDataType = 'Q';
        if ('1' == e.target.dataset.current) {
            var rankDataType = 'A';
        }
        var params = {
            "instId": config.config.instId,
            "platformType": config.config.platformType,
            "rankDataType": rankDataType
        };
        server.GET(server.api.getRankData, params).then(res => {
            if ('000000' == res.respCode) {
                console.info("res", res)
                this.setData({
                    rankDataList: res.responseBody.queryResultPage != null && res.responseBody.queryResultPage.list != null ? res.responseBody.queryResultPage.list : []
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
            console.info("获取排行榜数据异常=", res)
            wx.hideLoading();
        });


    },
    //点击切换
    clickTab: function(e) {
        var that = this;
        wx.getSystemInfo({
            success: function(res) {
                that.setData({
                    scrollWeightHeight: res.windowHeight
                });
            }
        });
        that.setData({
            currentTab: e.target.dataset.current
        })
        var rankDataType = 'Q';
        if ('1' == e.target.dataset.current) {
            var rankDataType = 'A';
        }
        var params = {
            "instId": config.config.instId,
            "platformType": config.config.platformType,
            "rankDataType": rankDataType
        };
        server.GET(server.api.getRankData, params).then(res => {
            if ('000000' == res.respCode) {
                console.info("res", res)
                this.setData({
                    rankDataList: res.responseBody.queryResultPage != null && res.responseBody.queryResultPage.list != null ? res.responseBody.queryResultPage.list : []
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
            console.info("获取排行榜数据异常=", res)
            wx.hideLoading();
        });

    },


    //下拉刷新
    onPullDownRefresh: function() {
        this.onLoad()
    },


    goToMyRankLocation: function(e) {
        console.info("跳转排行信息e=", e)

        var i = 'P000000000015';
        this.setData({
            toMemberRankItem: i
        })

    }


})