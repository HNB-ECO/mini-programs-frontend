//app.js
import {
    configApi
} from './utils/constant';
const applyApi = require('./utils/applyApi.js');
let that;
App({
    data: {
        systemInfo: wx.getSystemInfoSync()
    },
    onLaunch: function() {
        that = this;
        this.getImgMid();
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
    openSetting: function(callback) {
        wx.getStorage({
            key:'honey-token',
            success:function(res){
                if(callback){
                    callback();
                }
            },
            fail:function(){
                wx.openSetting({
                    success: (res) => {
                        console.log('openSetting设置成功: ', res);
                        if (res.authSetting['scope.userInfo']) {
                            console.log('开启用户授权');
                            that.setUserToken(function(res) {
                                // 授权成功
                                if (callback) {
                                    callback();
                                }
                            });
                        }
                    },
                    fail: (res) => {
                        console.log('设置失败: ', res);
                    },
                    complete: (res) => {
                        console.log('设置完成: ', res);

                    }
                })
            }
        })

    },
    setUserToken: function(callback) {
        wx.getStorage({
            key: 'honey-user',
            success: function(res) {
                if (callback) {
                    callback();
                }
            },
            fail: function() {
                wx.login({
                    success: function(res) {
                        var updateParam = {};
                        applyApi.post('wx/app-auth', {
                            code: res.code
                        }, function(res) {
                            updateParam.openId = res.data.openid;
                            wx.getUserInfo({
                                success: function(res) {
                                    updateParam.nickName = res.userInfo.nickName;
                                    updateParam.avatarUrl = res.userInfo.avatarUrl;
                                    applyApi.post('wx/app-login', updateParam, function(res) {
                                        wx.setStorageSync('honey-user', res.data);
                                        wx.setStorageSync('honey-token', res.data.token);
                                        if (callback) {
                                            callback();
                                        }
                                    })
                                },
                                fail: function() {
                                    if (callback) {
                                        callback();
                                    }
                                }
                            });
                        })
                    },
                    fail: function(err) {}
                })
            }
        })

    }
})
