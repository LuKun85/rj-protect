// pages/profile/newAddress.js

var server = require("../../utils/serverAPI.js");
var config = require("../../config/config.js")
var util = require("../../utils/util.js")
var getWxrequestPromisify = util.wxPromisify(wx.request);

const app = getApp();


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
        memberId: '',
        loginStatus: '',
        memberPhoneNumberSecured: '',


        familyTag: "家",
        companyTag: "公司",

        addressId: '',

        buttonFunction: 'createMemberNewAddress'

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {

        var that = this;

        console.info('options=', options)
        var addressId = options.addressId;
        var memberId = options.memberId;
        that.setData({
            memberId: memberId
        })
        if (addressId != null && addressId != '' && addressId != undefined) {
            that.setData({
                addressId: addressId,
                buttonFunction: 'updateMemberNewAddress'
            })
            wx.setNavigationBarTitle({
                title: '更新地址'
            })

            wx.showLoading({
                title: '获取地址信息',
                mask: true
            })

            //获取地址详细信息
            var params = {
                "instId": config.config.instId,
                "platformType": config.config.platformType,
                "memberId": memberId,
                "addressId": addressId
            };
            server.GET(server.api.getMerchantAddressDetail, params).then(res => {
                wx.hideLoading();
                if ("000000" == res.respCode) {
                    that.setData({
                        contactName: res.responseBody.queryResultList[0].contactName,
                        contactPhone: res.responseBody.queryResultList[0].contactPhone,
                        provinceCode: res.responseBody.queryResultList[0].provinceCode,
                        cityCode: res.responseBody.queryResultList[0].cityCode,
                        areaCode: res.responseBody.queryResultList[0].areaCode,
                        townCode: res.responseBody.queryResultList[0].townCode,
                        houseparkCode: res.responseBody.queryResultList[0].houseparkCode,
                        buildingCode: res.responseBody.queryResultList[0].buildingCode,
                        unitCode: res.responseBody.queryResultList[0].unitCode,
                        floorCode: res.responseBody.queryResultList[0].floorCode,
                        doorCode: res.responseBody.queryResultList[0].doorCode,
                        provinceName: res.responseBody.queryResultList[0].provinceName,
                        cityName: res.responseBody.queryResultList[0].cityName,
                        areaName: res.responseBody.queryResultList[0].areaName,
                        townName: res.responseBody.queryResultList[0].townName,
                        houseparkName: res.responseBody.queryResultList[0].houseparkName,
                        buildingName: res.responseBody.queryResultList[0].buildingName,
                        unitName: res.responseBody.queryResultList[0].unitName,
                        floorName: res.responseBody.queryResultList[0].floorName,
                        doorName: res.responseBody.queryResultList[0].doorName,
                        addressRemark: res.responseBody.queryResultList[0].addressRemark,
                        addressDetail: res.responseBody.queryResultList[0].addressDetail,
                        addressTag: res.responseBody.queryResultList[0].addressTag,
                    })
                } else {
                    wx.showToast({
                        title: res.respMsg,
                        icon: 'none',
                        duration: 2000
                    })
                }
            }).catch(res => {
                wx.hideLoading();
                wx.showToast({
                    title: res.respMsg,
                    icon: 'none',
                    duration: 2000
                })
            })
        } else {
            var phone = app.globalData.memberPhoneNumber;
            that.setData({
                    contactPhone: phone,
                    memberPhoneNumberSecured: phone
                })
                // if (phone == null || phone == '') {
                //     phone = '1**********'
                // } else {
                //     phone = util.securityPhoneNumber(phone);
                // }
                // that.setData({
                //     memberPhoneNumberSecured: phone,
                // })
        }

        this.setData({
            previewSelectItem: [9999, 1, 1, 1],
            houseParkPreviewSelectItem: [9999, 1, 1, 1]
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

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {
        wx.removeStorage({
            key: 'addressId',
            success: function(res) {},
        })
    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {
        wx.removeStorage({
            key: 'addressId',
            success: function(res) {},
        })
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

    bindChange: function(e) {
        const val = e.detail.value
        this.setData({
            year: this.data.years[val[0]],
            month: this.data.months[val[1]],
            day: this.data.days[val[2]]
        })
    },


    // 选择城市
    showCitySelectDialog: function() {
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
            showCityDialogFlag: true,
            saveButtonClicked: false
        })
        setTimeout(function() {
            animation.translateY(0).step()
            this.setData({
                animationData: animation.export()
            })
        }.bind(this), 200)
    },

    hideCitySelectDialog: function() {
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
        setTimeout(function() {
            animation.translateY(0).step()
            this.setData({
                animationData: animation.export(),
                showCityDialogFlag: false
            })
        }.bind(this), 200)
    },


    showAddressCodeSelect: function() {
        this.setData({
            showCityDialogFlag: true,
            provinceList: [],
            cityList: [],
            areaList: [],
            townList: [],
        })

        wx.showLoading({
            title: '获取数据中...',
            mask: true
        })

        var params = {
            "instId": config.config.instId,
            "platformType": config.config.platformType,
            "queryAddressCodeType": "province",
        };
        server.GET(server.api.getAddressCode, params).then(res => {
            console.info("获取地区选择数据", res)
            wx.hideLoading();
            if ('000000' == res.respCode) {
                this.setData({
                    provinceList: res.responseBody.queryList,
                    cityList: res.responseBody.queryChildList,
                    areaList: res.responseBody.queryChildChildList,
                    townList: res.responseBody.queryChildChildChildList,
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
                    title: res.respMsg,
                    icon: 'none',
                    duration: 2000
                })
            }
        }).catch(res => {
            wx.hideLoading();
            console.info("获取地区选择数据失败=", res)
        });
    },

    doAddressCodeSelect: function(e) {

        var a = util.compareAddressTwoList(this.data.previewSelectItem, e.detail.value);
        this.setData({
            previewSelectItem: e.detail.value,
            saveButtonClicked: false
        })
        var queryUpAddressCode = '';
        switch (a) {
            case 1:
                //用选中的省市代码作为upCode去查询城市代码
                queryUpAddressCode = this.data.provinceList[e.detail.value[0]];
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
                });
                break;
            case 2:
                //用选中的城市代码作为upCode去查询县市代码
                queryUpAddressCode = this.data.cityList[e.detail.value[1]];
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
            case 3:
                //用选中的县市代码作为upCode去查询乡镇或者是街道代码
                queryUpAddressCode = this.data.areaList[e.detail.value[2]];
                this.setData({
                    townList: [],
                    townCode: '',
                    townName: '',
                    areaCode: queryUpAddressCode != null ? queryUpAddressCode.code : '',
                    areaName: queryUpAddressCode != null ? queryUpAddressCode.name : ''
                })
                break;
            case 4:
                //用选中的县市代码作为upCode去查询乡镇或者是街道代码
                queryUpAddressCode = this.data.townList[e.detail.value[3]];
                this.setData({
                    townCode: queryUpAddressCode != null ? queryUpAddressCode.code : '',
                    townName: queryUpAddressCode != null ? queryUpAddressCode.name : ''
                })
                break
            default:
                return;
                break;
        }

        console.info("queryUpAddressCode=", queryUpAddressCode);
        if (queryUpAddressCode == null || queryUpAddressCode == '' || queryUpAddressCode == undefined) {
            return;
        }
        if (a > 3) {
            return;
        }


        var params = {
            "instId": config.config.instId,
            "platformType": config.config.platformType,
            "queryUpAddressCode": queryUpAddressCode != null && queryUpAddressCode.code != null ? queryUpAddressCode.code : "",
            "queryAddressCodeType": util.getAddressCodeType('address', a),
        };
        wx.showLoading({
            title: '获取数据中...',
            mask: true
        })
        server.GET(server.api.getAddressCode, params).then(res => {
            console.info("获取地区选择数据", res)
            wx.hideLoading();
            if ('000000' == res.respCode) {
                switch (a) {
                    case 1:
                        this.setData({
                            cityList: res.responseBody.queryList,
                            areaList: res.responseBody.queryChildList,
                            townList: res.responseBody.queryChildChildList,
                            cityCode: res.responseBody.queryList != null ? res.responseBody.queryList[0].code : "",
                            cityName: res.responseBody.queryList != null ? res.responseBody.queryList[0].name : "",
                            areaCode: res.responseBody.queryChildList != null ? res.responseBody.queryChildList[0].code : "",
                            areaName: res.responseBody.queryChildList != null ? res.responseBody.queryChildList[0].name : "",
                            townCode: res.responseBody.queryChildChildList != null ? res.responseBody.queryChildChildList[0].code : "",
                            townName: res.responseBody.queryChildChildList != null ? res.responseBody.queryChildChildList[0].name : "",
                        });
                        break;
                    case 2:
                        this.setData({
                            areaList: res.responseBody.queryList,
                            townList: res.responseBody.queryChildList,
                            areaCode: res.responseBody.queryList != null ? res.responseBody.queryList[0].code : "",
                            areaName: res.responseBody.queryList != null ? res.responseBody.queryList[0].name : "",
                            townCode: res.responseBody.queryChildList != null ? res.responseBody.queryChildList[0].code : "",
                            townName: res.responseBody.queryChildList != null ? res.responseBody.queryChildList[0].name : "",
                        });
                        break;
                    case 3:
                        this.setData({
                            townList: res.responseBody.queryList,
                            townCode: res.responseBody.queryList != null ? res.responseBody.queryList[0].code : "",
                            townName: res.responseBody.queryList != null ? res.responseBody.queryList[0].name : "",
                        });
                        break;
                    default:
                        queryUpAddressCode = "";
                        break;
                }
            } else {
                wx.showToast({
                    title: res.respMsg,
                    icon: 'none',
                    duration: 2000
                })
            }
        }).catch(res => {
            wx.hideLoading();
            console.info("获取地区选择数据失败=", res)
        });
    },

    ensureAddressCodeSelect: function() {
        this.setData({
            showCityDialogFlag: false,
            saveButtonClicked: false
        })
    },

    enterContactName: function(e) {
        this.setData({
            contactName: e.detail.value,
            saveButtonClicked: false
        })
    },
    enterContactPhone: function(e) {
        this.setData({
            contactPhone: e.detail.value,
            saveButtonClicked: false
        })
    },
    enterAddressDetail: function(e) {
        this.setData({
            addressDetail: e.detail.value,
            saveButtonClicked: false
        })
    },
    enterAddressRemark: function(e) {
        this.setData({
            addressRemark: e.detail.value,
            saveButtonClicked: false
        })
    },

    // ============
    // 选择小区
    showHouseParkSelectDialog: function() {
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
        setTimeout(function() {
            animation.translateY(0).step()
            this.setData({
                animationData: animation.export()
            })
        }.bind(this), 200)
    },

    hideHouseParkSelectDialog: function() {
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
        setTimeout(function() {
            animation.translateY(0).step()
            this.setData({
                animationData: animation.export(),
                showHouseParkDialogFlag: false
            })
        }.bind(this), 200)
    },


    /**
     * 小区选择逻辑 - > 如果townCode = 空, 就用areaCode
     */
    showHouseParkSelect: function() {

        var that = this;
        var queryAddressCode = '';
        if (that.data.townCode != null && that.data.townCode != '') {
            queryAddressCode = that.data.townCode;
        } else {
            queryAddressCode = that.data.areaCode;
        }

        if (queryAddressCode == null || queryAddressCode == '') {
            wx.showToast({
                title: '请先选择地区信息',
                icon: 'none',
                duration: 2000
            })
            return;
        }

        that.setData({
            showHouseParkDialogFlag: true,
            houseparkList: [],
            buildingList: [],
            unitList: [],
            doorList: [],
            saveButtonClicked: false
        })

        var params = {
            "instId": config.config.instId,
            "platformType": config.config.platformType,
            "queryAddressCode": queryAddressCode,
            "queryAddressCodeType": "housepark",
        };
        wx.showLoading({
            title: '获取数据中...',
            mask: true
        })
        server.GET(server.api.getAddressCode, params).then(res => {
            console.info("获取小区信息选择数据", res)
            wx.hideLoading();
            if ('000000' == res.respCode) {
                that.setData({
                    houseparkList: res.responseBody.queryList != null ? res.responseBody.queryList : [],
                    buildingList: res.responseBody.queryChildList != null ? res.responseBody.queryChildList : [],
                    unitList: res.responseBody.queryChildChildList != null ?
                        res.responseBody.queryChildChildList : [],
                    doorList: res.responseBody.queryChildChildChildList != null ? res.responseBody.queryChildChildChildList : [],
                })
                if (that.data.houseparkList[0] != null && that.data.houseparkList.length > 0) {
                    that.setData({
                        houseparkCode: that.data.houseparkList[0].code,
                        houseparkName: that.data.houseparkList[0].name
                    })
                }
                if (that.data.buildingList[0] != null && that.data.buildingList.length > 0) {
                    that.setData({
                        buildingCode: that.data.buildingList[0].code,
                        buildingName: that.data.buildingList[0].name
                    })
                }
                if (that.data.unitList[0] != null && that.data.unitList.length > 0) {
                    that.setData({
                        unitCode: that.data.unitList[0].code,
                        unitName: that.data.unitList[0].name
                    })
                }
                if (that.data.doorList[0] != null && that.data.doorList.length > 0) {
                    that.setData({
                        doorCode: that.data.doorList[0].code,
                        doorName: that.data.doorList[0].name
                    })
                }
            } else {
                wx.showToast({
                    title: res.respMsg,
                    icon: 'none',
                    duration: 2000
                })
            }
        }).catch(res => {
            wx.hideLoading();
            console.info("获取小区信息选择数据-失败=", res)
        });
    },

    doHouseparkCodeChange: function(e) {

        var a = util.compareAddressTwoList(this.data.houseParkPreviewSelectItem, e.detail.value);
        this.setData({
            houseParkPreviewSelectItem: e.detail.value,
            saveButtonClicked: false
        })
        var queryUpHouseparkCode = '';
        switch (a) {
            case 1:
                queryUpHouseparkCode = this.data.houseparkList[e.detail.value[0]];
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
                });
                break;
            case 2:
                queryUpHouseparkCode = this.data.buildingList[e.detail.value[1]];
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
            case 3:
                queryUpHouseparkCode = this.data.unitList[e.detail.value[2]];
                this.setData({
                    doorList: [],
                    doorCode: '',
                    doorName: '',
                    unitCode: queryUpHouseparkCode != null ? queryUpHouseparkCode.code : '',
                    unitName: queryUpHouseparkCode != null ? queryUpHouseparkCode.name : ''
                })
                break;
            case 4:
                queryUpHouseparkCode = this.data.doorList[e.detail.value[3]];
                this.setData({
                    doorCode: queryUpHouseparkCode != null ? queryUpHouseparkCode.code : '',
                    doorName: queryUpHouseparkCode != null ? queryUpHouseparkCode.name : ''
                })
                break
            default:
                return;
                break;
        }

        if (queryUpHouseparkCode == null || queryUpHouseparkCode == '' || queryUpHouseparkCode == undefined) {
            return;
        }
        if (a > 3) {
            return;
        }

        var params = {
            "instId": config.config.instId,
            "platformType": config.config.platformType,
            "queryUpHouseparkCode": queryUpHouseparkCode != null && queryUpHouseparkCode.code != null ? queryUpHouseparkCode.code : "",
            "queryAddressCodeType": util.getAddressCodeType('housepark', a),
        };
        wx.showLoading({
            title: '获取数据中...',
            mask: true
        })
        server.GET(server.api.getAddressCode, params).then(res => {
            console.info("获取小区信息选择数据", res)
            wx.hideLoading();
            if ('000000' == res.respCode) {
                switch (a) {
                    case 1:
                        this.setData({
                            buildingList: res.responseBody.queryList,
                            unitList: res.responseBody.queryChildList,
                            doorList: res.responseBody.queryChildChildList,
                            buildingCode: res.responseBody.queryList != null && res.responseBody.queryList.length > 0 ? res.responseBody.queryList[0].code : "",
                            buildingName: res.responseBody.queryList != null && res.responseBody.queryList.length > 0 ? res.responseBody.queryList[0].name : "",
                            unitCode: res.responseBody.queryChildList != null && res.responseBody.queryChildList.length > 0 ? res.responseBody.queryChildList[0].code : "",
                            unitName: res.responseBody.queryChildList != null && res.responseBody.queryChildList.length > 0 ? res.responseBody.queryChildList[0].name : "",
                            doorCode: res.responseBody.queryChildChildList != null && res.responseBody.queryChildChildList.length > 0 ? res.responseBody.queryChildChildList[0].code : "",
                            doorName: res.responseBody.queryChildChildList != null && res.responseBody.queryChildChildList.length > 0 ? res.responseBody.queryChildChildList[0].name : "",
                        });
                        break;
                    case 2:
                        this.setData({
                            unitList: res.responseBody.queryList,
                            doorList: res.responseBody.queryChildList,
                            unitCode: res.responseBody.queryList != null && res.responseBody.queryList.length > 0 ? res.responseBody.queryList[0].code : "",
                            unitName: res.responseBody.queryList != null && res.responseBody.queryList.length > 0 ? res.responseBody.queryList[0].name : "",
                            doorCode: res.responseBody.queryChildList != null && res.responseBody.queryChildList.length > 0 ? res.responseBody.queryChildList[0].code : "",
                            doorName: res.responseBody.queryChildList != null && res.responseBody.queryChildList.length > 0 ? res.responseBody.queryChildList[0].name : "",
                        });
                        break;
                    case 3:
                        this.setData({
                            doorList: res.responseBody.queryList,
                            doorCode: res.responseBody.queryList != null && res.responseBody.queryList.length > 0 ? res.responseBody.queryList[0].code : "",
                            doorName: res.responseBody.queryList != null && res.responseBody.queryList.length > 0 ? res.responseBody.queryList[0].name : "",
                        });
                        break;
                    default:
                        queryUpHouseparkCode = "";
                        break;
                }
            } else {
                wx.showToast({
                    title: res.respMsg,
                    icon: 'none',
                    duration: 2000
                })
            }
        }).catch(res => {
            wx.hideLoading();
            console.info("获取小区信息选择数据-失败=", res)
        });
    },


    createMemberNewAddress: function() {

        var that = this;
        that.setData({
            saveButtonClicked: true
        })

        wx.showLoading({
            title: '新增中...',
            mask: true
        })

        if (util.checkEmpty(that.data.contactName)) {
            wx.showToast({
                title: "联系人姓名",
                icon: 'none',
                duration: 2000
            })
            return;
        }
        if (util.checkEmpty(that.data.contactPhone)) {
            wx.showToast({
                title: "联系人手机号",
                icon: 'none',
                duration: 2000
            })
            return;
        }
        if (util.checkEmpty(that.data.provinceCode)) {
            wx.showToast({
                title: "请选择地区",
                icon: 'none',
                duration: 2000
            })
            return;
        }
        if (util.checkEmpty(that.data.houseparkCode)) {
            wx.showToast({
                title: "请选择小区",
                icon: 'none',
                duration: 2000
            })
            return;
        }

        //新增地址详细信息
        var params = {
            "instId": config.config.instId,
            "platformType": config.config.platformType,
            "memberId": that.data.memberId,
            "contactName": that.data.contactName,
            "contactPhone": that.data.contactPhone,
            "provinceCode": that.data.provinceCode,
            "cityCode": that.data.cityCode,
            "areaCode": that.data.areaCode,
            "townCode": that.data.townCode,
            "houseparkCode": that.data.houseparkCode,
            "buildingCode": that.data.buildingCode,
            "unitCode": that.data.unitCode,
            "floorCode": that.data.floorCode,
            "doorCode": that.data.doorCode,
            "provinceName": that.data.provinceName,
            "cityName": that.data.cityName,
            "areaName": that.data.areaName,
            "townName": that.data.townName,
            "houseparkName": that.data.houseparkName,
            "buildingName": that.data.buildingName,
            "unitName": that.data.unitName,
            "floorName": that.data.floorName,
            "doorName": that.data.doorName,
            "addressRemark": that.data.addressRemark,
            "addressDetail": that.data.addressDetail,
            "addressTag": that.data.addressTag
        };
        server.POST(server.api.postMerchantNewAddress, params).then(res => {
            wx.hideLoading();
            that.setData({
                saveButtonClicked: false
            })
            if ("000000" == res.respCode) {
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
                    title: res.respMsg,
                    icon: 'none',
                    duration: 2000
                })
            }
        }).catch(res => {
            wx.hideLoading();
            wx.showToast({
                title: res.respMsg,
                icon: 'none',
                duration: 2000
            })
        })
    },

    ensureHouseparkCodeSelect: function() {
        this.setData({
            showHouseParkDialogFlag: false
        })
    },

    updateMemberNewAddress: function() {

        var that = this;
        that.setData({
            saveButtonClicked: true
        })

        wx.showLoading({
            title: '更新中...',
            mask: true
        })

        if (util.checkEmpty(that.data.contactName)) {
            wx.showToast({
                title: "联系人姓名",
                icon: 'none',
                duration: 2000
            })
            return;
        }
        if (util.checkEmpty(that.data.contactPhone)) {
            wx.showToast({
                title: "联系人手机号",
                icon: 'none',
                duration: 2000
            })
            return;
        }
        if (util.checkEmpty(that.data.provinceCode)) {
            wx.showToast({
                title: "请选择地区",
                icon: 'none',
                duration: 2000
            })
            return;
        }
        if (util.checkEmpty(that.data.houseparkCode)) {
            wx.showToast({
                title: "请选择小区",
                icon: 'none',
                duration: 2000
            })
            return;
        }


        //更新地址详细信息
        var params = {
            "instId": config.config.instId,
            "platformType": config.config.platformType,
            "memberId": that.data.memberId,
            "contactName": that.data.contactName,
            "contactPhone": that.data.contactPhone,
            "provinceCode": that.data.provinceCode,
            "cityCode": that.data.cityCode,
            "areaCode": that.data.areaCode,
            "townCode": that.data.townCode,
            "houseparkCode": that.data.houseparkCode,
            "buildingCode": that.data.buildingCode,
            "unitCode": that.data.unitCode,
            "floorCode": that.data.floorCode,
            "doorCode": that.data.doorCode,
            "provinceName": that.data.provinceName,
            "cityName": that.data.cityName,
            "areaName": that.data.areaName,
            "townName": that.data.townName,
            "houseparkName": that.data.houseparkName,
            "buildingName": that.data.buildingName,
            "unitName": that.data.unitName,
            "floorName": that.data.floorName,
            "doorName": that.data.doorName,
            "addressRemark": that.data.addressRemark,
            "addressDetail": that.data.addressDetail,
            "addressTag": that.data.addressTag,
            "addressId": that.data.addressId
        };
        server.POST(server.api.updateMerchantAddress, params).then(res => {
            wx.hideLoading();
            if ("000000" == res.respCode) {
                that.setData({
                    saveButtonClicked: false
                })
                if ("000000" == res.respCode) {
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
                        title: res.respMsg,
                        icon: 'none',
                        duration: 2000
                    })
                }
            } else {
                wx.showToast({
                    title: res.respMsg,
                    icon: 'none',
                    duration: 2000
                })
            }
        }).catch(res => {
            wx.hideLoading();
            wx.showToast({
                title: res.respMsg,
                icon: 'none',
                duration: 2000
            })
        })
    }

})