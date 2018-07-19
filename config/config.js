// var config = {
//   instId: "100000",
//   platformType:"wxmin",
//   signKey:"ABCDEFGHILGKLMKDFD",
//   aesKey:"1234567890000000",
//   aesIv:"1234567890000000"
// }
var server = require("../utils/serverAPI.js");

var config = {
    instId: "100000",
    platformType: "wxmin",
    signKey: "OIWE8KNDFNJJERPO",
    aesKey: "IUPOEJDHUAIQEYRU",
    aesIv: "8HJ23HLJSKJDJH91"
}

var filepath = `${server.url}/file/download?instId=${config.instId}&platformType=${config.platformType}&fileId=`


var lunboPics = {
    lunbo1: filepath + 'F2018000000101',
    lunbo2: filepath + 'F2018000000103',
    lunbo3: filepath + 'F2018000000102',
}

var registerPics = filepath + 'F2018000000301';

module.exports = {
    config: config,
    lunboPics: lunboPics,
    registerPics: registerPics,
    filepath: filepath
}