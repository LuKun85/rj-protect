// pages/map/classifymap.js

var server = require("../../utils/serverAPI.js");
var config = require("../../config/config.js");
var util = require("../../utils/util.js");

//获取应用实例
const app = getApp()
const QQMapWX = require('../../utils/qqmap-wx-jssdk.js')

Page({

    /**
     * 页面的初始数据
     */
    data: {
        latitude: '',
        longitude: '',

        markers: [],
        controls: [{
            id: 1,
            iconPath: '../../assets/images/location.png',
            position: {
                left: 0,
                top: 15,
                width: 30,
                height: 30
            },
            clickable: true
        }],
        circle: {
            latitude: '',
            longitude: '',
            color: "#17dbc1",
            fillColor: "#17dbc110",
            radius: 1000,
            strokeWidth: 0.2
        },
        circles: [],
        showLocation: true
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

                this.setData({
                    latitude: res.latitude,
                    longitude: res.longitude,
                    'circle.latitude': res.latitude,
                    'circle.longitude': res.longitude
                })
                var clist = [];
                clist.push(this.data.circle);
                this.setData({
                    circles: clist
                })

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
        this.mapCtx = wx.createMapContext('classifymap');
    },



    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {

        //每次页面刷新进来都重新加载回收点信息
        var params = {
            "instId": config.config.instId,
            "platformType": config.config.platformType,
            "queryAddressName": this.data.queryAddressName
        };

        server.GET(server.api.getRecycleSpotList, params).then(res => {
            if ('000000' == res.respCode) {
                console.info("res", res)
                this.setData({
                    markers: res.responseBody.queryList != null ? res.responseBody.queryList : []
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
            console.info("加载回收点信息异常=", res)
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

    //点击地图控件
    controlMapTap: function(e) {
        console.info("dianji")
        console.log(e.controlId)
    },

    regionchange(e) {
        console.log(e.type)
    },


    getCenterLocation: function() {
        var that = this;
        this.mapCtx.getCenterLocation({
            success: function(res) {
                this.setData({
                    latitude: res.latitude,
                    longitude: res.longitude,
                })
            }
        })
    },
    moveToLocation: function() {
        this.mapCtx.moveToLocation()
    },

    translateMarker: function() {
        this.mapCtx.translateMarker({
            markerId: 0,
            autoRotate: true,
            duration: 1000,
            destination: {
                latitude: 23.10229,
                longitude: 113.3345211,
            },
            animationEnd() {
                console.log('animation end')
            }
        })
    },
    includePoints: function() {
        this.mapCtx.includePoints({
            padding: [10],
            points: [{
                latitude: 23.10229,
                longitude: 113.3345211,
            }, {
                latitude: 23.00229,
                longitude: 113.3345211,
            }]
        })
    }

})