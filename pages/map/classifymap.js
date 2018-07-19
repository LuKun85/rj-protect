// pages/map/classifymap.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        latitude: '34.405487',
        longitude: '115.830037',

        markers: [{
            iconPath: "../../assets/images/pop.png",
            title: "回收点",
            id: 1,
            latitude: 34.409419,
            longitude: 115.834159,
            width: 30,
            height: 30,
            callout: {
                content: "回收时间: 08:00 - 17:30 \n回收人员: 张三疯 \n联系电话:13817281731",
                color: '#050505',
                bgColor: "#17dbc1",
                fontSize: 14,
                borderRadius: 4,
                textAlign: 'left',
                padding: 2
            },
            label: {
                content: "珠江豪庭: 1号收集点"
            }
        }, {
            iconPath: "../../assets/images/pop.png",
            title: "回收点",
            id: 2,
            latitude: 34.408161,
            longitude: 115.830637,
            width: 30,
            height: 30,
            callout: {
                content: "回收时间: 08:00 - 17:30 \n回收人员: 张三疯 \n联系电话:13817281731",
                color: '#CD2626',
                bgColor: "#33ccff",
                fontSize: 14,
                borderRadius: 4,
                display: 'ALWAYS',
                textAlign: 'left',
                padding: 2
            },
            label: {
                content: "汇景江南: 1号收集点"
            }
        }, {
            iconPath: "../../assets/images/pop.png",
            title: "普陀区",
            id: 3,
            latitude: 10.2494,
            longitude: 121.397,
            width: 30,
            height: 30
        }, {
            iconPath: "../../assets/images/pop.png",
            title: "普陀区",
            id: 4,
            latitude: 31.2494,
            longitude: 151.397,
            width: 30,
            height: 30
        }],
        polyline: [{
            points: [{
                longitude: 113.3245211,
                latitude: 23.10229
            }, {
                longitude: 113.324520,
                latitude: 23.21229
            }],
            color: "#FF0000DD",
            width: 2,
            dottedLine: true
        }],
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
        circles: [{
            latitude: 34.409419,
            longitude: 115.834159,
            color: "#17dbc1",
            fillColor: "#17dbc110",
            radius: 1000,
            strokeWidth: 1
        }],
        showLocation: true
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        // var that = this;
        // // 今日运收安排计划
        // wx.getLocation({
        //   type: 'gcj02', //返回可以用于wx.openLocation的经纬度
        //   success: function (res) {
        //     var latitude = res.latitude
        //     var longitude = res.longitude
        //     that.setData({ latitude: latitude, longitude: longitude })
        //   }
        // })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {
        this.mapCtx = wx.createMapContext('classifymap')
    },



    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {

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
        this.mapCtx.getCenterLocation({
            success: function(res) {
                console.log(res.longitude)
                console.log(res.latitude)
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