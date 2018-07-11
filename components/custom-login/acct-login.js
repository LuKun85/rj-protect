// components/dialog/custom-acct-register.js
Component({

  //声明这个组件的属性 
  properties: {

    inputPlaceHalder: {
      type: String,
      value: ' ',
    },
    inputHidden: {
      type: Boolean,
      value: false
    },
    dialogHidden: {
      type: Boolean,
      value: false
    },

    // 这里定义了innerText属性，属性值可以在组件使用时指定
    titleText: {
      type: String,
      value: '实名注册认证',
    },

    titleMsg: {
      type: String,
      value: '融久会员注册',
    },

    inputMsg: {
      type: String,
      value: '请输入你他妈想干嘛',
    },

    //确定
    determineBtn: {
      type: String,
      value: 'default value',
    },

    //取消
    cancleBtn: {
      type: Boolean,
      value: true,
    },
  },

  methods: {
    // 输入值
    bindKeyInput: function (e) {
      this.setData({
        inputValue: e.detail.value
      })
    },
    cancleBtn: function () {
      this.setData({
        dialogHidden: true,
      })
    },
    determineBtn: function () {
      var determineDetail =
        this.data.inputValue // detail对象，提供给事件监听函数
      this.triggerEvent('determineevent', determineDetail)
      this.setData({
        inputValue: ""
      })

    }

  },

  /**
   * 页面的初始数据
   */
  data: {
    // 这里是一些组件内部数据
    inputValue: "",
    onCancleClick: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  submit: function () {
    this.setData({
      showModal: true
    })
  },

  go: function () {
    this.setData({
      showModal: false
    })
  },
  // 确定
})