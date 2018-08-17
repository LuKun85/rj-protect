var server = require("../utils/serverAPI.js");
var config = require("../config/config.js");

var filepath = `${server.url}/file/download?instId=${config.config.instId}&platformType=${config.config.platformType}&fileId=`

var newsItem = [{
        "id": "1",
        "title": "融久公告",
        "source": "官方",
        "subTitle": "融久环保重要的公告,都会发布在这里",
        "readCount": "300",
        "messageUrl": "https://www.rongjiuhuanbao.com/1/1.html",
        "titlePictureUrl": filepath + 'F2018000000101',
        "messageDate": "2018-07-18",
        "hotFlag": "Y"
    },
    {
        "id": "2",
        "title": "融久活动",
        "source": "官方",
        "subTitle": "融久环保精彩和丰富的活动,都在这里",
        "readCount": "400",
        "messageUrl": "https://www.rongjiuhuanbao.com/2/2.html",
        "titlePictureUrl": filepath + 'F2018000000102',
        "messageDate": "2018-07-18",
        "hotFlag": "Y"
    },
    {
        "id": "3",
        "title": "融久小程序使用攻略",
        "source": "官方",
        "subTitle": "如果你对融久环保小程序有疑问,可以点击这里",
        "readCount": "500",
        "messageUrl": "https://www.rongjiuhuanbao.com/3/3.html",
        "titlePictureUrl": filepath + 'F2018000000103',
        "messageDate": "2018-07-18",
        "hotFlag": "Y"
    }
]

var lunboPics = {
    lunbo1: filepath + 'F2018000000201',
    lunbo2: filepath + 'F2018000000202',
    lunbo3: filepath + 'F2018000000203',
}

var registerPics = filepath + 'F2018000000301';

module.exports = {
    newsItem: newsItem,
    lunboPics: lunboPics,
    registerPics: registerPics,
    filepath: filepath
}