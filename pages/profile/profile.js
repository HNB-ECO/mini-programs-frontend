const applyApi = require('../../utils/applyApi.js');
const verify = require('../../utils/verify.js');
import { Base64 } from '../../utils/urlsafe-base64';

let that,app=getApp();

Page({
    data: {
        navList: [{
            img: "../../images/home_button_orderinquiry@2x.png",
            des: "待接单",
            status: 2
        }, {
            img: "../../images/home_button_commodity@2x.png",
            des: "待确认",
            status: 3
        }, {
            img: "../../images/home_button_service@2x.png",
            des: "待评分",
            status: 4
        }],
        navbarTitle: '我的',
        navbarBgColor: 'rgba(0,0,0,0)',
        isIphoneX: app.getSystemModelIPhoneX(),
        myphone: ''
    },
    onShow() {



    },
    onLoad: function() {
        // that = this;
        // var userInfo=wx.getStorageSync('honey-user');
        // console.log('userinfo .. ' + JSON.stringify(userInfo));
        // that.setData({
        //     userInfo:userInfo
        // })
        if (wx.getStorageSync('honey-user').id) {
          this.getPackage();
        }
    },
    getPackage() {
      applyApi.jsonGetRequest('user/getUserPackage', {
        userId: wx.getStorageSync('honey-user').id
      }).then(result => {
        wx.hideLoading();
        this.setData({
          coinBalance: result.coinBalance
        })
        this.setData({
          userInfo: wx.getStorageSync('honey-user')
        })
        console.log(result);
      }).catch(error => {
        console.log(error);
      });
    },
    getOrderList(status) {
        applyApi.postByToken('order/status-order', {
            status: status
        }, function(res) {
            that.data.navList[status - 2].total = res.data.total;
            that.setData({
                navList: that.data.navList
            })
        })
    },
    navToOrder(e) {
        wx.setStorageSync('honey-order-status',e.currentTarget.dataset.status);
        wx.navigateTo({
          url: '../order/order',
        })
    },
    myaddress(e) {
        // wx.navigateTo({
        //   url: `../myaddress/myaddress?from=profile`
        // })
        // 暂时先用微信的收货地址
        wx.chooseAddress({
          success: function (res) {
            console.log(res.userName)
            console.log(res.postalCode)
            console.log(res.provinceName)
            console.log(res.cityName)
            console.log(res.countyName)
            console.log(res.detailInfo)
            console.log(res.nationalCode)
            console.log(res.telNumber)
          }
        })
    },
    getLatestOrder() {
        applyApi.postByToken('notice/getNotReadNum', null, function(res) {
            console.log('getNotReadNum', res);
            that.setData({
                latestOrder:res.data.lastestOrder
            })
        });
    },
    goLatest(e){
        wx.navigateTo({
            url:`../order-detail/detail?orderId=${that.data.latestOrder.id}`
        })
    },
    login(e){
        app.openSetting(function(res){
            that.onLoad();
            that.onShow();
            wx.setStorageSync('honey-order-status','0')
        })
    },
    bindMywalletTap() {
      wx.navigateTo({
        url: '../myWallet/myWallet',
      })
    },
    getPhoneNumber: function (e) {
      // console.log(e.detail.errMsg)
      // console.log(e.detail.iv)
      // console.log(Base64.decode(e.detail.encryptedData))

      // var WXBizDataCrypt = require('./WXBizDataCrypt')

      // var appId = 'wx4f4bc4dec97d474b'
      // var sessionKey = 'tiihtNczf5v6AKRyjwEUhQ=='
      // var encryptedData = e.detail.encryptedData
      // var iv = 'r7BXXKkLb8qrSNn05n0qiA=='

      // var pc = new WXBizDataCrypt(appId, sessionKey)

      // var data = pc.decryptData(encryptedData, iv)

      // console.log('解密后 data: ', data)

      // // wx.setStorageSync('myphone', phoneNumber)
      // this.setData({
      //   myphone: ''
      // })
    } ,
    bindLoginTap() {
      wx.showLoading({
        title: '登录中..',
      })
      app.LoggedIn();
      var that = this;
      setTimeout(function() {
        that.getPackage();
      },1500);

    }
})
