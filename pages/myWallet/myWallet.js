// pages/myWallet/myWallet.js
const applyApi = require('../../utils/applyApi.js');

var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isRemaidHidden: false,
    navbarTitle: '我的钱包',
    windowWidth: app.data.systemInfo.windowWidth,
    priceList: [
      {
        hnbprice: 5,
        rmbprice: 5,
        selected: false
      },
      {
        hnbprice: 50,
        rmbprice: 50,
        selected: false
      },
      {
        hnbprice: 100,
        rmbprice: 100,
        selected: false
      },
      {
        hnbprice: 500,
        rmbprice: 500,
        selected: false
      },
      {
        hnbprice: 1000,
        rmbprice: 1000,
        selected: false
      },
      {
        hnbprice: 5000,
        rmbprice: 5000,
        selected: false
      }
    ],
    remindList:['1.因Apple政策原因，充值仅限Apple指定价格',
    '2.画呗可用于直接购买小程序内虚拟内容(包含实物产品、虚拟产品、兑换码)',
    '3.画呗为虚拟货币，充值后的画呗不会过期，但无法提现或转赠他人。']
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    applyApi.jsonGetRequest('user/getUserPackage', {
      userId: wx.getStorageSync('honey-user').id
    }).then(result => {
      this.setData({
        coinBalance: result.coinBalance
      })
      console.log(result);
    }).catch(error => {
      console.log(error);
    });
  
  },

  bindSelectPriceTap(e) {
    var index = e.currentTarget.id;
    var list = this.data.priceList;
    list.forEach(item => {
      item.selected = false;
      list[index].selected = true;
    })
    this.setData({
      priceList: list,
      selectPrice: list[index].rmbprice
    })
  },

  bindComftPayTap() {
    wx.showLoading({
      title: '充值中..',
    })
    applyApi.formPostRequest('user/userRecharge', {
      userId: wx.getStorageSync('honey-user').id,
      openId: wx.getStorageSync('honey-openId'),
      price: this.data.selectPrice
    }).then(result => {
      wx.hideLoading();

      // 微信支付
      wx.requestPayment({
        'timeStamp': result.timeStamp,
        'nonceStr': result.nonceStr,
        'package': 'prepay_id=' + result.prepayId,
        'signType': 'MD5',
        'paySign': result.paySign,
        'success': function (res) {
          wx.hideLoading();
          wx.showToast({
            title: '充值成功!',
          })
          setTimeout(function () {
            wx.navigateBack({
              delta: 1
            })
          }, 1500)
        },
        'fail': function (res) {
          wx.showToast({
            icon: 'none',
            title: '充值失败!'
          })
        }
      })

      console.log(result);
    }).catch(error => {
      console.log(error);
    });
  },
  bindCloseRemaidTap() {
    this.setData({
      isRemaidHidden: true
    })
  }

})