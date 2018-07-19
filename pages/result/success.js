// pages/result/success.js
Page({

    /**
     * 页面的初始数据
     * 
     * successType = 01packageOrder, 02=appointmentOrder 03=outcomeOrder 默认是00, 返回首页
     * 
     * 
     */
    data: {
        successMessage: "成功",
        successType: "00",
        returnLinkMessage: "前往个人信息页面",
        returnLinkMessageHidden: true
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
        wx.getStorage({
                key: 'successMessage',
                success: function(res) {
                    that.setData({
                        successMessage: res.data
                    })
                },
            })
            //successType = 01packageOrder, 02=appointmentOrder 03=outcomeOrder 默认是00, 返回首页
        wx.getStorage({
            key: 'successType',
            success: function(res) {
                that.setData({
                    successType: res.data
                })
                if ('01' == that.data.successType) {
                    that.setData({
                        returnLinkMessageHidden: false,
                        returnLinkMessage: "前往个人信息页面"
                    })
                } else if ('02' == that.data.successType) {
                    that.setData({
                        returnLinkMessageHidden: false,
                        returnLinkMessage: "前往预约订单页面"
                    })
                } else if ('03' == that.data.successType) {
                    that.setData({
                        returnLinkMessageHidden: false,
                        returnLinkMessage: "前往个人信息页面"
                    })
                } else {
                    that.setData({
                        returnLinkMessageHidden: true
                    })
                }
            },
        })
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

    returnPrimaryPage: function(e) {
        wx.switchTab({
            url: '/pages/primary/primary'
        })
    },

    gotoAnotherPage: function(e) {
        var that = this;
        //返回个人信息页面
        //successType = 01packageOrder, 02=appointmentOrder 03=outcomeOrder 默认是00, 返回首页
        console.info("that.data.successType", that.data.successType)
        if ('01' == that.data.successType) {
            wx.switchTab({
                url: '/pages/profile/profile'
            })
            that.setData({
                returnLinkMessageHidden: false
            })
        } else if ('02' == that.data.successType) {
            wx.switchTab({
                url: '/pages/profile/profile'
            })
            that.setData({
                returnLinkMessageHidden: false
            })
        } else if ('03' == that.data.successType) {
            wx.redirectTo({
                url: `/pages/profile/outcomeDetail`
            })
            that.setData({
                returnLinkMessageHidden: false
            })
        } else {
            that.setData({
                returnLinkMessageHidden: true
            })
        }

    }
})