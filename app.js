//app.js
import {
    configApi
} from './utils/constant';
import Promise from './utils/bluebird.min';
const applyApi = require('./utils/applyApi.js');
let that;
// 首次登录 --> 授权 --> 获取用户信息 --> 服务器登录
// 再次登录 --> 检查本地是否有userinfo --> 有则不用登录
App({
    data: {
        systemInfo: wx.getSystemInfoSync()
    },
    onLaunch: function() {
        that = this;
        this.getImgMid();
        // if (!wx.getStorageSync('honey-user')) {
        //   // 授权 登录
        //   this.LoggedIn();
        // }
    },
    getSystemModelIPhoneX() {
      var model = this.data.systemInfo.model;
      let models = model.split('(');
      if (models[0] == 'iPhone X ') {
        return true;
      } else {
        return false;
      }
    },
    getImgMid: function() {
        var width = this.data.systemInfo.windowWidth;
        var url = `?imageView2/1/w/${width}/h/${width}`;
        return url;
    },
    getImgBig: function() {
        var width = this.data.systemInfo.windowWidth * 2;
        var url = `?imageView2/1/w/${width}/h/${width}`;
        return url;
    },
    getPages: function(pre) {
        var pages = getCurrentPages();
        return pages[pages.length - pre - 1]; //上一个页面
    },

    LoggedIn() {
      return new Promise((resolve, reject) => { 
        wx.authorize({
          scope: 'scope.userInfo',
          success () {
            // 授权成功
            return that.wxappLogin();
          },
          fail () {
            // 授权失败 -> 打开设置
            wx.openSetting({
              success: (res) => {
                console.log('openSetting 设置: ', res);
                if (res.authSetting['scope.userInfo']) {
                  console.log('开启用户授权');
                  // 授权成功
                  return that.wxappLogin();
                } else {
                  // 拒绝授权 
                  
                }
              }
            })
          }
        })
      })
    },
    wxappLogin() {
      return new Promise((resolve, reject) => { 
        wx.login({
          success(loginResult) {
            var code = loginResult.code;
            console.log('code **', code);
            applyApi.jsonGetRequest('openId/getOpenId', {
              code: code
            }).then(result => {
              wx.setStorageSync('honey-openId', result.openId);
              console.log('openId ** ',result);
            }).catch(error => {
              console.log(error);
            });
            
            return that.getUserInfo(code);
          },
          fail(error) {}
        });

      })
    },
    getUserInfo(code) {
      return new Promise((resolve, reject) => { 
        wx.getUserInfo({
          success (res) {
            return that.userLogin(code,res);
          },
          fail () {
            if (callback) {
              callback();
            }
          }
        });
      })
    },
    userLogin(code, res) {
      return new Promise((resolve, reject) => { 
        applyApi.formPostRequest('user/userLogin', {
          platformId: 1,
          nickName: res.userInfo.nickName,
          avatar: res.userInfo.avatarUrl,
          thirdPartId: code,
          thirdPartType: 'WX'
        }).then(result => {
          wx.setStorageSync('honey-user', result);
          console.log(result);
          return resolve(result)
        }).catch(error => {
          console.log(error);
          return reject(error)
        });
      })
    }

  
})
