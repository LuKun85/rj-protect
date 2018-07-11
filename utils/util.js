  const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

// 封装Promise
// var Promise = require('./promise.js')
var Promise = require('./es6-promise.js')
function wxPromisify(fn) {
  return function (obj = {}) {
    return new Promise((resolve, reject) => {
      obj.success = function (res) {
        console.info("封装", res)
        resolve(res)
      }

      obj.fail = function (res) {
        console.info("封装", res)

        reject(res)
      }
      fn(obj)
    })
  }

}

// 引入CryptoJS
var Crypto = require('./CryptoJS/cryptojs.js').Crypto;
// 引入配置参数
var config = require('../config/config.js')

var Base64 = require('./Base64.js').Base64

function genSign(requestBody) {
  var signTemp = Crypto.charenc.UTF8.stringToBytes(JSON.stringify(requestBody) + config.config.signKey);
  return Crypto.MD5(signTemp).toString().toUpperCase();
}

function encryptRequestBody(requestBody) {
  var srcs = Crypto.charenc.UTF8.stringToBytes(JSON.stringify(requestBody));
  var key = Crypto.charenc.UTF8.stringToBytes(config.config.aesKey)
  var iv = Crypto.charenc.UTF8.stringToBytes(config.config.aesIv);
  // 对称解密使用的算法为 AES-128-CBC，数据采用PKCS#7填充
  var mode = new Crypto.mode.CBC(Crypto.pad.pkcs7);
  var encrypted = Crypto.AES.encrypt(srcs, key, {
    asBytes: true,
    iv: iv,
    mode: mode
  });
  return Base64.encode(Crypto.util.bytesToHex(encrypted));
}


function decryptRequestBody(keysrc, ivsrc, bodysrc) {
  var body = Crypto.util.base64ToBytes(bodysrc);
  var key = Crypto.util.base64ToBytes(keysrc);
  var iv = Crypto.util.base64ToBytes(ivsrc);
  // 对称解密使用的算法为 AES-128-CBC，数据采用PKCS#7填充
  var mode = new Crypto.mode.CBC(Crypto.pad.pkcs7);
  var encrypted = Crypto.AES.decrypt(body, key, {
    asBytes: true,
    iv: iv,
    mode: mode
  });
  console.info("encrypted=", encrypted)
  console.info("encrypted=", Crypto.util.Binary.bytesToString(encrypted))

  var decryptResult = JSON.parse(encrypted);
  return encrypted;
}


var crypto = require('./crypto/crypto-js.js');
function decryptEncryptData(encryptedData, sessionKey, iv) {
  // base64 decode
  var encryptedData = Crypto.util.base64ToBytes(encryptedData);
  var sessionKey = Crypto.util.base64ToBytes(sessionKey);
  var iv = Crypto.util.base64ToBytes(iv);
  
  try {
    // 解密
    var decipher = crypto.createDecipheriv('aes-128-cbc', sessionKey, iv)
    // 设置自动 padding 为 true，删除填充补位
    decipher.setAutoPadding(true)
    var decoded = decipher.update(encryptedData, 'binary', 'utf8')
    decoded += decipher.final('utf8')
    console.info("decoded=", decoded)
    decoded = JSON.parse(decoded)

  } catch (err) {
    throw new Error('Illegal Buffer')
  }

  if (decoded.watermark.appid !== this.appId) {
    throw new Error('Illegal Buffer')
  }

  return decoded
}



function encryptRequestBody1(requestBody) {
  return Base64.encode(JSON.stringify(requestBody));
}

function compareAddressTwoList(a, b){
   for(var i = 0; i< a.length; i++){
      if(a[i] == b[i]){
        continue;
      }
      return i+1;
   }
   return 0;
}

function getAddressCodeType(a, b) {
   if( a == 'address'){
     switch (b) {
       case 1: return 'city'; break;
       case 2: return 'area'; break;
       case 3: return 'town'; break;
       default: break;
     }
  } else if (a == 'housepark') {
    switch (b) {
      case 1: return 'build'; break;
      case 2: return 'unit'; break;
      case 3: return 'door'; break;
      default: break;
    }
  } 
}

// 加密手机号
function securityPhoneNumber(a) {
  var sphone = a.slice(0, 4) + "****" + a.slice(7, 11);
}

module.exports = {
  formatTime: formatTime,
  wxPromisify: wxPromisify,
  genSign: genSign,
  encryptRequestBody: encryptRequestBody,
  compareAddressTwoList: compareAddressTwoList,
  getAddressCodeType: getAddressCodeType,
  decryptEncryptData: decryptEncryptData
}
