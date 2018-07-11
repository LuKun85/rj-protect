// pages/circle/circle.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    "imagesList": {
      "profilephoto": "../../assets/images/profilephoto.png",
      "dian": "../../assets/images/dian.png",
      "dian_s": "../../assets/images/dian_s.png",
      "reply": "../../assets/images/reply.png",
      "reply_s": "../../assets/images/reply_s.png"
    },
    "text": '你长的可真漂亮',
    "dianList": [
      {
        'icon': '../../images/img/rectangle.png',
        'text': '交易查询',
        'url': 'space'
      }, {
        'icon': '../../images/img/rectangle.png',
        'text': '交易查询',
        'url': 'space'
      }, {
        'icon': '../../images/img/rectangle.png',
        'text': '交易查询',
        'url': 'space'
      }, {
        'icon': '../../images/img/rectangle.png',
        'text': '交易查询',
        'url': 'space'
      }, {
        'icon': '../../images/img/rectangle.png',
        'text': '交易查询',
        'url': 'space'
      }, {
        'icon': '../../images/img/rectangle.png',
        'text': '交易查询',
        'url': 'space'
      }, {
        'icon': '../../images/img/rectangle.png',
        'text': '交易查询',
        'url': 'space'
      }, {
        'icon': '../../images/img/rectangle.png',
        'text': '交易查询',
        'url': 'space'
      }
      ],
      commentBottomIcon: {
        loveIcon: '../../assets/images/circle/love.png',
        loveSelectedIcon: '../../assets/images/circle/love_s.png',
        hateIcon: '../../assets/images/circle/hate.png',
        hateSelectedIcon: '../../assets/images/circle/hate_s.png',
        repostIcon: '../../assets/images/circle/repost.png',
        repostSelectedIcon: '../../assets/images/circle/repost_s.png',
        commentIcon: '../../assets/images/circle/comment.png',
        commentedIcon: '../../assets/images/circle/comment_s.png',
      },

      dataList: [{ 'id': '0001', 'profile_image': '../../assets/images/lunbo/lunbo1.png', 'name': '魏万坤', 'create_time': '2018年05月01日: 12:01:01', 'text': '你说的是啥??', 'image1': "../../assets/images/lunbo/lunbo2.png", 'width': '300', 'height': '200', 'loveFlag': 'Y', 'loveTotal': 10, 'hateFlag': 'Y', 'hateTotal': 23, 'commentFlag': 'Y','commentCount': '2', 'publishAddress': { 'addressName': '河南 商丘', 'addressLatitude': '0', 'addressLongitude': '0' } }, { 'id': '0002', 'profile_image': '../../assets/images/lunbo/lunbo1.png', 'name': '魏万坤', 'create_time': '2018年05月01日: 12:01:01', 'text': '你说的是啥??', 'image1': "../../assets/images/lunbo/lunbo2.png", 'width': '300', 'height': '200', 'loveFlag': 'Y', 'hateFlag': 'Y', 'chaFlagTotal': '23', 'commentCount': '2', 'publishAddress': { 'addressName': '河南 商丘', 'addressLatitude': '0', 'addressLongitude': '0' } }, { 'id': '0001', 'profile_image': '../../assets/images/lunbo/lunbo1.png', 'name': '魏万坤', 'create_time': '2018年05月01日: 12:01:01', 'text': '你说的是啥??', 'image1': "../../assets/images/lunbo/lunbo2.png", 'width': '300', 'height': '200', 'loveFlag': 'Y', 'chaFlagTotal': '23', 'commentCount': '2', 'publishAddress': { 'addressName': '河南 商丘', 'addressLatitude': '0', 'addressLongitude': '0' } } ]
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

  clickLove: function(e){
    var circleMessageId = e.currentTarget.dataset.id;
    var newDataList = [];
    for (var i = 0; i < this.data.dataList.length; i++){
      var dataItem = this.data.dataList[i];
      if (dataItem.id === circleMessageId){
         if("Y" === dataItem.loveFlag){
           dataItem.loveFlag= "N";
           dataItem.loveTotal--;
         } else {
           dataItem.loveFlag = "Y";
           dataItem.loveTotal++;
         }
      }
      newDataList.push(dataItem);
    }
    this.setData({dataList: newDataList})
  },

  clickHate: function (e) {
    var circleMessageId = e.currentTarget.dataset.id;
    var newDataList = [];
    for (var i = 0; i < this.data.dataList.length; i++) {
      var dataItem = this.data.dataList[i];
      if (dataItem.id === circleMessageId) {
        if ("Y" === dataItem.hateFlag) {
          dataItem.hateFlag = "N";
          dataItem.hateTotal--;
        } else {
          dataItem.hateFlag = "Y";
          dataItem.hateTotal++;
        }
      }
      newDataList.push(dataItem);
    }
    this.setData({ dataList: newDataList })
  }
  
})