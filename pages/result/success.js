// pages/result/success.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        successMessage: "支付成功"
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

    toPackageDetailPage: function(e) {
        var appointmentOrderId = '';
        wx.redirectTo({
            url: `/pages/profile/mypackage?appointmentOrderId=${appointmentOrderId}`
        })
    }
})