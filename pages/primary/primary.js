// pages/primary/primary.js

  var mock = require("../../mock/priceItem.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    scrollWeightHeight: "550",

    "imagesList": {
      "navigationScanImg": "../../assets/images/scan.png",
      "dian": "../../assets/images/dian.png",
      "dian_s": "../../assets/images/dian_s.png",
      "reply": "../../assets/images/reply.png",
      "reply_s": "../../assets/images/reply_s.png"
    },
    imgUrls: [
      '../../assets/images/lunbo/lunbo1.png',
      '../../assets/images/lunbo/lunbo2.png',
      '../../assets/images/lunbo/lunbo3.png'
    ],
    rankImgUrls: {
      "rank_a": '../../assets/images/rank_a.png',
      "rank_b": '../../assets/images/rank_b.png',
      "rank_c": '../../assets/images/rank_c.png'
    },
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    currentTab: 0,
    tabShowMap: "display:block",

    categoryItemList: mock.priceItem1,

    memberInfo: {},
    loginStatus: ''
  },

  changeIndicatorDots: function (e) {
    this.setData({
      indicatorDots: !this.data.indicatorDots
    })
  },
  changeAutoplay: function (e) {
    this.setData({
      autoplay: !this.data.autoplay
    })
  },
  intervalChange: function (e) {
    this.setData({
      interval: e.detail.value
    })
  },
  durationChange: function (e) {
    this.setData({
      duration: e.detail.value
    })
  },

  // 地图控件
  regionchange(e) {
    console.log(e.type)
  },
  markertap(e) {
    console.log(e.markerId)
  },
  controltap(e) {
    console.log(e.controlId)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: "首页",
    })
    wx.getLocation({
      type: 'wgs84',
      success: res => {
        this.setData({
          latitude: res.latitude,
          longitude: res.longitude
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.videoContext = wx.createVideoContext('myVideo')
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    //获取用户号和检查是否实名
    wx.getStorage({
      key: 'memberInfo',
      success: res => {
        this.setData({
          memberInfo: res.data
        })
      }
    })
    wx.getStorage({
      key: 'loginStatus',
      success: res => {
        this.setData({
          loginStatus: res.data
        })
      }
    })
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



  /**
     * 首页点击左上角扫一扫
     */
  onClinkTopRightScan: function () {
    wx.scanCode({
      onlyFromCamera: true,
      success: (res) => {
        console.log(res)
      }
    })
  },

  //滑动切换
  swiperTab: function (e) {
    var that = this;
    if (3 == e.target.dataset.current) {
      wx.navigateTo({
        url: '/pages/map/classifymap',
        success: () => {
          that.setData({
            currentTab: 0
          })
        }
      })
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  },
  //点击切换
  clickTab: function (e) {

    var that = this;

    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          scrollWeightHeight: res.windowHeight
        });
      }
    });

    if (that.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      if (2 == e.target.dataset.current) {
        wx.navigateTo({
          url: '/pages/map/classifymap',
          success: () => {
            that.setData({
              currentTab: 0
            })
          }
        })
      } else {
        that.setData({
          currentTab: e.target.dataset.current
        })
      }
    }
  },

  /**
     * 获取排行榜数据
     */
  getRankData: function () {
    // const rankType = e.currentTarget.dataset.id;
    // getApp().rankType = rankType;
    wx.navigateTo({
      url: '/pages/primary/rankPage',
    })
  },

  getPriceData: function(){
    wx.navigateTo({
      url: '/pages/primary/pricePage',
    })
  },

  getRecycleDateData: function () {
    wx.navigateTo({
      url: '/pages/primary/recycleDate',
    })
  },

  getRecycleSpotData: function () {
    wx.navigateTo({
      url: '/pages/primary/recycleSpotPage',
    })
  }

})