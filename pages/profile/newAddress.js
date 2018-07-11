// pages/profile/newAddress.js

var server = require("../../utils/serverAPI.js");
var config = require("../../config/config.js")
var util = require("../../utils/util.js")
var getWxrequestPromisify = util.wxPromisify(wx.request);

Page({

  /**
   * 页面的初始数据
   */
  data: {

    value: [9999, 1, 1],
    houseParkValue: [9999, 1, 1],
    region: ['广东省', '广州市', '海珠区'],
    customItem: '全部',
    saveButtonClicked: false,

    showCityDialogFlag: false,
    showHouseParkFlag: false,
    previewSelectItem: [9999, 1, 1, 1],
    houseParkPreviewSelectItem: [9999, 1, 1, 1],
    provinceList: [],
    cityList: [],
    areaList: [],
    townList: [],
    houseparkList: [],
    buildingList: [],
    unitList: [],
    floorList: [],
    doorList: [],
    provinceName: '',
    provinceCode: '',
    cityName: '',
    cityCode: '',
    areaName: '',
    areaCode: '',
    townName: '',
    townCode: '',
    houseparkName: '',
    houseparkCode: '',
    buildingName: '',
    buildingCode: '',
    unitName: '',
    unitCode: '',
    floorName: '',
    floorCode: '',
    doorName: '',
    doorCode: '',
    addressDetail: '',
    addressTag: '',
    addressRemark: '',

    contactName: '',
    contactPhone: '',

    memberInfo: {},
    loginStatus: '',

    familyTag: "家",
    companyTag: "公司",

    addressId:'',

    buttonFunction: 'createMemberNewAddress'

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      previewSelectItem: [9999, 1, 1, 1],
      houseParkPreviewSelectItem: [9999, 1, 1, 1]
    })

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

    wx.getStorage({
      key: 'addressId',
      success: res => {
        this.setData({
          addressId: res.data
        })

        wx.setNavigationBarTitle({
          title: '更新地址'
        })            
        
        if(res.data == null || res.data == ""){
          return;
        }

        this.setData({
          buttonFunction: 'updateMemberNewAddress'
        })

        var requestBody = {
          "instId": config.config.instId,
          "platformType": config.config.platformType,
          "memberId": this.data.memberInfo.memberId,
          "addressId": res.data
        };
        var sign = util.genSign(requestBody);
        var requestbody = util.encryptRequestBody(requestBody);

        getWxrequestPromisify({
          method: "GET",
          url: server.serverAPI.merchantGetAddressDetail,
          data: {
            instId: config.config.instId,
            platformType: config.config.platformType,
            requestBody: requestbody,
            sign: sign
          }
        }).then(
          res => {
            if ("000000" == res.data.respCode) {
              if (res.data.responseBody.queryResultList != null && res.data.responseBody.queryResultList.length >0){
                this.setData({
                  contactName: res.data.responseBody.queryResultList[0].contactName,
                  contactPhone: res.data.responseBody.queryResultList[0].contactPhone,
                  provinceCode: res.data.responseBody.queryResultList[0].provinceCode,
                  cityCode: res.data.responseBody.queryResultList[0].cityCode,
                  areaCode: res.data.responseBody.queryResultList[0].areaCode,
                  townCode: res.data.responseBody.queryResultList[0].townCode,
                  houseparkCode: res.data.responseBody.queryResultList[0].houseparkCode,
                  buildingCode: res.data.responseBody.queryResultList[0].buildingCode,
                  unitCode: res.data.responseBody.queryResultList[0].unitCode,
                  floorCode: res.data.responseBody.queryResultList[0].floorCode,
                  doorCode: res.data.responseBody.queryResultList[0].doorCode,
                  provinceName: res.data.responseBody.queryResultList[0].provinceName,
                  cityName: res.data.responseBody.queryResultList[0].cityName,
                  areaName: res.data.responseBody.queryResultList[0].areaName,
                  townName: res.data.responseBody.queryResultList[0].townName,
                  houseparkName: res.data.responseBody.queryResultList[0].houseparkName,
                  buildingName: res.data.responseBody.queryResultList[0].buildingName,
                  unitName: res.data.responseBody.queryResultList[0].unitName,
                  floorName: res.data.responseBody.queryResultList[0].floorName,
                  doorName: res.data.responseBody.queryResultList[0].doorName,
                  addressRemark: res.data.responseBody.queryResultList[0].addressRemark,
                  addressDetail: res.data.responseBody.queryResultList[0].addressDetail,
                  addressTag: res.data.responseBody.queryResultList[0].addressTag,
                })
              }
            }
          });


      }
    })

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
    wx.removeStorage({
      key: 'addressId',
      success: function (res) { },
    })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
      wx.removeStorage({
        key: 'addressId',
        success: function(res) {},
      })
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

  bindChange: function (e) {
    const val = e.detail.value
    this.setData({
      year: this.data.years[val[0]],
      month: this.data.months[val[1]],
      day: this.data.days[val[2]]
    })
  },


  // 选择城市
  showCitySelectDialog: function () {
    // 显示遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
      showCityDialogFlag: true
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 200)
  },

  hideCitySelectDialog: function () {
    // 隐藏遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        showCityDialogFlag: false
      })
    }.bind(this), 200)
  },



  showSelectCity: function () {
    this.setData({
      showCityDialogFlag: true,
      provinceList: [],
      cityList: [],
      areaList: [],
      townList: [],
    })
    var requestBody = {
      "instId": config.config.instId,
      "platformType": config.config.platformType,
      "queryAddressCodeType": "province",
    };
    var sign = util.genSign(requestBody);
    var requestbody = util.encryptRequestBody(requestBody);

    getWxrequestPromisify({
      method: "GET",
      url: server.serverAPI.getAddressCode,
      data: {
        instId: config.config.instId,
        platformType: config.config.platformType,
        requestBody: requestbody,
        sign: sign
      }
    }).then(
      res => {
        if ("000000" == res.data.respCode) {
          this.setData({
            provinceList: res.data.responseBody.queryList,
            cityList: res.data.responseBody.queryChildList,
            areaList: res.data.responseBody.queryChildChildList,
            townList: res.data.responseBody.queryChildChildChildList,
          })
          if (this.data.provinceList[0] != null) {
            this.setData({
              provinceCode: this.data.provinceList[0].code,
              provinceName: this.data.provinceList[0].name
            })
          }
          if (this.data.cityList[0] != null) {
            this.setData({
              cityCode: this.data.cityList[0].code,
              cityName: this.data.cityList[0].name
            })
          }
          if (this.data.areaList[0] != null) {
            this.setData({
              areaCode: this.data.areaList[0].code,
              areaName: this.data.areaList[0].name
            })
          }
          if (this.data.townList[0] != null) {
            this.setData({
              townCode: this.data.townList[0].code,
              townName: this.data.townList[0].name
            })
          }

        } else {
          wx.showToast({
            title: res.data.respMsg,
            icon: 'none',
            duration: 2000
          })
        }
      });
    wx.hideLoading();
  },

  bindAddressCodeChange: function (e) {

    var a = util.compareAddressTwoList(this.data.previewSelectItem, e.detail.value);
    this.setData({
      previewSelectItem: e.detail.value
    })
    var queryUpAddressCode = '';
    switch (a) {
      case 1: queryUpAddressCode = this.data.provinceList[e.detail.value[0]];
        this.setData({
          cityList: [],
          areaList: [],
          townList: [],
          cityCode: '',
          cityName: '',
          areaCode: '',
          areaName: '',
          townCode: '',
          townName: '',
          provinceCode: queryUpAddressCode != null ? queryUpAddressCode.code : '',
          provinceName: queryUpAddressCode != null ? queryUpAddressCode.name : ''
        })
          ; break;
      case 2: queryUpAddressCode = this.data.cityList[e.detail.value[1]];
        this.setData({
          areaList: [],
          townList: [],
          areaCode: '',
          areaName: '',
          townCode: '',
          townName: '',
          cityCode: queryUpAddressCode != null ? queryUpAddressCode.code : '',
          cityName: queryUpAddressCode != null ? queryUpAddressCode.name : ''
        })
        break;
      case 3: queryUpAddressCode = this.data.areaList[e.detail.value[2]];
        this.setData({
          townList: [],
          townCode: '',
          townName: '',
          areaCode: queryUpAddressCode != null ? queryUpAddressCode.code : '',
          areaName: queryUpAddressCode != null ? queryUpAddressCode.name : ''
        })
        break;
      case 4: queryUpAddressCode = this.data.townList[e.detail.value[3]];
        this.setData({
          townCode: queryUpAddressCode != null ? queryUpAddressCode.code : '',
          townName: queryUpAddressCode != null ? queryUpAddressCode.name : ''
        })
        break
      default: return;
        break;
    }

    console.info("queryUpAddressCode=", queryUpAddressCode);
    if (queryUpAddressCode == null || queryUpAddressCode == '' || queryUpAddressCode == undefined) {
      return;
    }
    if (a > 3) {
      return;
    }

    var requestBody = {
      "instId": config.config.instId,
      "platformType": config.config.platformType,
      "queryUpAddressCode": queryUpAddressCode != null && queryUpAddressCode.code != null ? queryUpAddressCode.code : "",
      "queryAddressCodeType": util.getAddressCodeType('address', a),
    };
    var sign = util.genSign(requestBody);
    var requestbody = util.encryptRequestBody(requestBody);

    getWxrequestPromisify({
      method: "GET",
      url: server.serverAPI.getAddressCode,
      data: {
        instId: config.config.instId,
        platformType: config.config.platformType,
        requestBody: requestbody,
        sign: sign
      }
    }).then(
      res => {
        if ("000000" == res.data.respCode) {
          switch (a) {
            case 1: this.setData({
              cityList: res.data.responseBody.queryList,
              areaList: res.data.responseBody.queryChildList,
              townList: res.data.responseBody.queryChildChildList,
              cityCode: res.data.responseBody.queryList != null ? res.data.responseBody.queryList[0].code : "",
              cityName: res.data.responseBody.queryList != null ? res.data.responseBody.queryList[0].name : "",
              areaCode: res.data.responseBody.queryChildList != null ? res.data.responseBody.queryChildList[0].code : "",
              areaName: res.data.responseBody.queryChildList != null ? res.data.responseBody.queryChildList[0].name : "",
              townCode: res.data.responseBody.queryChildChildList != null ? res.data.responseBody.queryChildChildList[0].code : "",
              townName: res.data.responseBody.queryChildChildList != null ? res.data.responseBody.queryChildChildList[0].name : "",
            }); break;
            case 2: this.setData({
              areaList: res.data.responseBody.queryList,
              townList: res.data.responseBody.queryChildList,
              areaCode: res.data.responseBody.queryList != null ? res.data.responseBody.queryList[0].code : "",
              areaName: res.data.responseBody.queryList != null ? res.data.responseBody.queryList[0].name : "",
              townCode: res.data.responseBody.queryChildList != null ? res.data.responseBody.queryChildList[0].code : "",
              townName: res.data.responseBody.queryChildList != null ? res.data.responseBody.queryChildList[0].name : "",
            }); break;
            case 3: this.setData({
              townList: res.data.responseBody.queryList,
              townCode: res.data.responseBody.queryList != null ? res.data.responseBody.queryList[0].code : "",
              townName: res.data.responseBody.queryList != null ? res.data.responseBody.queryList[0].name : "",
            }); break;
            default: queryUpAddressCode = "";
              break;
          }
        } else {
          wx.showToast({
            title: res.data.respMsg,
            icon: 'none',
            duration: 2000
          })
        }
      });

  },

  ensureAddressCodeSelect: function () {
    this.setData({
      showCityDialogFlag: false
    })
  },

  enterContactName: function (e) {
    this.setData({
      contactName: e.detail.value
    })
  },
  enterContactPhone: function (e) {
    this.setData({
      contactPhone: e.detail.value
    })
  },
  enterContactPhone: function (e) {
    this.setData({
      contactPhone: e.detail.value
    })
  },
  enterAddressDetail: function (e) {
    this.setData({
      addressDetail: e.detail.value
    })
  },
  enterAddressRemark: function (e) {
    this.setData({
      addressRemark: e.detail.value
    })
  },

  // ============
  // 选择小区
  showHouseParkSelectDialog: function () {
    // 显示遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
      showHouseParkDialogFlag: true
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 200)
  },

  hideHouseParkSelectDialog: function () {
    // 隐藏遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        showHouseParkDialogFlag: false
      })
    }.bind(this), 200)
  },

  showHouseParkSelect: function () {

    console.info("areaCode=", this.data.areaCode)
    if (this.data.areaCode == null || this.data.areaCode == '') {
      wx.showToast({
        title: '请先选择地区',
        icon: 'none',
        duration: 2000
      })
      return;
    }

    this.setData({
      showHouseParkDialogFlag: true,
      houseparkList: [],
      buildingList: [],
      unitList: [],
      doorList: [],
    })
    var requestBody = {
      "instId": config.config.instId,
      "platformType": config.config.platformType,
      "queryAddressCode": "411425",
      "queryAddressCodeType": "housepark",
    };
    var sign = util.genSign(requestBody);
    var requestbody = util.encryptRequestBody(requestBody);

    getWxrequestPromisify({
      method: "GET",
      url: server.serverAPI.getAddressCode,
      data: {
        instId: config.config.instId,
        platformType: config.config.platformType,
        requestBody: requestbody,
        sign: sign
      }
    }).then(
      res => {
        if ("000000" == res.data.respCode) {
          this.setData({
            houseparkList: res.data.responseBody.queryList != null ? res.data.responseBody.queryList : [],
            buildingList: res.data.responseBody.queryChildList != null ? res.data.responseBody.queryChildList : [],
            unitList: res.data.responseBody.queryChildChildList != null ?
              res.data.responseBody.queryChildChildList : [],
            doorList: res.data.responseBody.queryChildChildChildList != null ? res.data.responseBody.queryChildChildChildList : [],
          })
          if (this.data.houseparkList[0] != null && this.data.houseparkList.length > 0) {
            this.setData({
              houseparkCode: this.data.houseparkList[0].code,
              houseparkName: this.data.houseparkList[0].name
            })
          }
          if (this.data.buildingList[0] != null && this.data.buildingList.length > 0) {
            this.setData({
              buildingCode: this.data.buildingList[0].code,
              buildingName: this.data.buildingList[0].name
            })
          }
          if (this.data.unitList[0] != null && this.data.unitList.length > 0) {
            this.setData({
              unitCode: this.data.unitList[0].code,
              unitName: this.data.unitList[0].name
            })
          }
          if (this.data.doorList[0] != null && this.data.doorList.length > 0) {
            this.setData({
              doorCode: this.data.doorList[0].code,
              doorName: this.data.doorList[0].name
            })
          }

        } else {
          wx.showToast({
            title: res.data.respMsg,
            icon: 'none',
            duration: 2000
          })
        }
      });
    wx.hideLoading();
  },

  bindHouseparkCodeChange: function (e) {

    var a = util.compareAddressTwoList(this.data.houseParkPreviewSelectItem, e.detail.value);
    this.setData({
      houseParkPreviewSelectItem: e.detail.value
    })
    var queryUpHouseparkCode = '';
    switch (a) {
      case 1: queryUpHouseparkCode = this.data.houseparkList[e.detail.value[0]];
        this.setData({
          buildingList: [],
          unitList: [],
          doorList: [],
          buildingCode: '',
          buildingName: '',
          unitCode: '',
          unitName: '',
          doorCode: '',
          doorName: '',
          houseparkCode: queryUpHouseparkCode != null ? queryUpHouseparkCode.code : '',
          houseparkName: queryUpHouseparkCode != null ? queryUpHouseparkCode.name : ''
        })
          ; break;
      case 2: queryUpHouseparkCode = this.data.buildingList[e.detail.value[1]];
        this.setData({
          unitList: [],
          doorList: [],
          unitCode: '',
          unitName: '',
          doorCode: '',
          doorName: '',
          buildingCode: queryUpHouseparkCode != null ? queryUpHouseparkCode.code : '',
          buildingName: queryUpHouseparkCode != null ? queryUpHouseparkCode.name : ''
        })
        break;
      case 3: queryUpHouseparkCode = this.data.unitList[e.detail.value[2]];
        this.setData({
          doorList: [],
          doorCode: '',
          doorName: '',
          unitCode: queryUpHouseparkCode != null ? queryUpHouseparkCode.code : '',
          unitName: queryUpHouseparkCode != null ? queryUpHouseparkCode.name : ''
        })
        break;
      case 4: queryUpHouseparkCode = this.data.doorList[e.detail.value[3]];
        this.setData({
          doorCode: queryUpHouseparkCode != null ? queryUpHouseparkCode.code : '',
          doorName: queryUpHouseparkCode != null ? queryUpHouseparkCode.name : ''
        })
        break
      default: return;
        break;
    }

    console.info("queryUpHouseparkCode=", queryUpHouseparkCode);
    if (queryUpHouseparkCode == null || queryUpHouseparkCode == '' || queryUpHouseparkCode == undefined) {
      return;
    }
    if (a > 3) {
      return;
    }

    var requestBody = {
      "instId": config.config.instId,
      "platformType": config.config.platformType,
      "queryUpHouseparkCode": queryUpHouseparkCode != null && queryUpHouseparkCode.code != null ? queryUpHouseparkCode.code : "",
      "queryAddressCodeType": util.getAddressCodeType('housepark', a),
    };
    var sign = util.genSign(requestBody);
    var requestbody = util.encryptRequestBody(requestBody);

    getWxrequestPromisify({
      method: "GET",
      url: server.serverAPI.getAddressCode,
      data: {
        instId: config.config.instId,
        platformType: config.config.platformType,
        requestBody: requestbody,
        sign: sign
      }
    }).then(
      res => {
        if ("000000" == res.data.respCode) {
          switch (a) {
            case 1: this.setData({
              buildingList: res.data.responseBody.queryList,
              unitList: res.data.responseBody.queryChildList,
              doorList: res.data.responseBody.queryChildChildList,
              buildingCode: res.data.responseBody.queryList != null && res.data.responseBody.queryList.length > 0 ? res.data.responseBody.queryList[0].code : "",
              buildingName: res.data.responseBody.queryList != null && res.data.responseBody.queryList.length > 0 ? res.data.responseBody.queryList[0].name : "",
              unitCode: res.data.responseBody.queryChildList != null && res.data.responseBody.queryChildList.length > 0 ? res.data.responseBody.queryChildList[0].code : "",
              unitName: res.data.responseBody.queryChildList != null && res.data.responseBody.queryChildList.length > 0 ? res.data.responseBody.queryChildList[0].name : "",
              doorCode: res.data.responseBody.queryChildChildList != null && res.data.responseBody.queryChildChildList.length > 0 ? res.data.responseBody.queryChildChildList[0].code : "",
              doorName: res.data.responseBody.queryChildChildList != null && res.data.responseBody.queryChildChildList.length > 0 ? res.data.responseBody.queryChildChildList[0].name : "",
            }); break;
            case 2: this.setData({
              unitList: res.data.responseBody.queryList,
              doorList: res.data.responseBody.queryChildList,
              unitCode: res.data.responseBody.queryList != null && res.data.responseBody.queryList.length > 0 ? res.data.responseBody.queryList[0].code : "",
              unitName: res.data.responseBody.queryList != null && res.data.responseBody.queryList.length > 0 ? res.data.responseBody.queryList[0].name : "",
              doorCode: res.data.responseBody.queryChildList != null && res.data.responseBody.queryChildList.length > 0 ? res.data.responseBody.queryChildList[0].code : "",
              doorName: res.data.responseBody.queryChildList != null && res.data.responseBody.queryChildList.length > 0 ? res.data.responseBody.queryChildList[0].name : "",
            }); break;
            case 3: this.setData({
              doorList: res.data.responseBody.queryList,
              doorCode: res.data.responseBody.queryList != null && res.data.responseBody.queryList.length > 0 ? res.data.responseBody.queryList[0].code : "",
              doorName: res.data.responseBody.queryList != null && res.data.responseBody.queryList.length > 0 ? res.data.responseBody.queryList[0].name : "",
            }); break;
            default: queryUpHouseparkCode = "";
              break;
          }
        } else {
          wx.showToast({
            title: res.data.respMsg,
            icon: 'none',
            duration: 2000
          })
        }
      });

  },


  createMemberNewAddress: function () {

    this.setData({
      saveButtonClicked: true
    })

    var requestBody = {
      "instId": config.config.instId,
      "platformType": config.config.platformType,
      "memberId": this.data.memberInfo.memberId,
      "contactName": this.data.contactName,
      "contactPhone": this.data.contactPhone,
      "provinceCode": this.data.provinceCode,
      "cityCode": this.data.cityCode,
      "areaCode": this.data.areaCode,
      "townCode": this.data.townCode,
      "houseparkCode": this.data.houseparkCode,
      "buildingCode": this.data.buildingCode,
      "unitCode": this.data.unitCode,
      "floorCode": this.data.floorCode,
      "doorCode": this.data.doorCode,
      "provinceName": this.data.provinceName,
      "cityName": this.data.cityName,
      "areaName": this.data.areaName,
      "townName": this.data.townName,
      "houseparkName": this.data.houseparkName,
      "buildingName": this.data.buildingName,
      "unitName": this.data.unitName,
      "floorName": this.data.floorName,
      "doorName": this.data.doorName,
      "addressRemark": this.data.addressRemark,
      "addressDetail": this.data.addressDetail,
      "addressTag": this.data.addressTag,
    };
    var sign = util.genSign(requestBody);
    var requestbody = util.encryptRequestBody(requestBody);

    getWxrequestPromisify({
      method: "POST",
      url: server.serverAPI.merchantAddNewAddress,
      data: {
        instId: config.config.instId,
        platformType: config.config.platformType,
        requestBody: requestbody,
        sign: sign
      }
    }).then(res => {

      this.setData({
        saveButtonClicked: false
      })

      if ("000000" == res.data.respCode) {
        wx.showToast({
          title: "添加成功",
          icon: 'success',
          duration: 2000
        })
        wx.navigateTo({
          url: '/pages/profile/address',
        })
      } else {
        wx.showToast({
          title: res.data.respMsg,
          icon: 'none',
          duration: 2000
        })
      }

    })

  },

  updateMemberNewAddress: function () {

    this.setData({
      saveButtonClicked: true
    })

    var requestBody = {
      "instId": config.config.instId,
      "platformType": config.config.platformType,
      "memberId": this.data.memberInfo.memberId,
      "contactName": this.data.contactName,
      "contactPhone": this.data.contactPhone,
      "provinceCode": this.data.provinceCode,
      "cityCode": this.data.cityCode,
      "areaCode": this.data.areaCode,
      "townCode": this.data.townCode,
      "houseparkCode": this.data.houseparkCode,
      "buildingCode": this.data.buildingCode,
      "unitCode": this.data.unitCode,
      "floorCode": this.data.floorCode,
      "doorCode": this.data.doorCode,
      "provinceName": this.data.provinceName,
      "cityName": this.data.cityName,
      "areaName": this.data.areaName,
      "townName": this.data.townName,
      "houseparkName": this.data.houseparkName,
      "buildingName": this.data.buildingName,
      "unitName": this.data.unitName,
      "floorName": this.data.floorName,
      "doorName": this.data.doorName,
      "addressRemark": this.data.addressRemark,
      "addressDetail": this.data.addressDetail,
      "addressTag": this.data.addressTag,
      "addressId": this.data.addressId
    };
    var sign = util.genSign(requestBody);
    var requestbody = util.encryptRequestBody(requestBody);

    getWxrequestPromisify({
      method: "POST",
      url: server.serverAPI.merchantUpdateAddress,
      data: {
        instId: config.config.instId,
        platformType: config.config.platformType,
        requestBody: requestbody,
        sign: sign
      }
    }).then(res => {

      this.setData({
        saveButtonClicked: false
      })

      if ("000000" == res.data.respCode) {
        wx.showToast({
          title: "保存成功",
          icon: 'success',
          duration: 2000
        })
        wx.navigateTo({
          url: '/pages/profile/address',
        })
      } else {
        wx.showToast({
          title: res.data.respMsg,
          icon: 'none',
          duration: 2000
        })
      }

    })}

})