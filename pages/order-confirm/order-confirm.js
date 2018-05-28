const applyApi = require('../../utils/applyApi.js');
const verify = require('../../utils/verify.js');
const orderApply = require('../../utils/order.js');
import { Base64 } from '../../utils/urlsafe-base64';

var that, order, prodId, artistId;
var app = getApp();

Page({
    data: {
        getImgMid: app.getImgMid(),
        navbarTitle: '确认订单',
        isIphoneX: app.getSystemModelIPhoneX(),
        isReadProtocol: false,
        paint: {
          imageUrls: 'https://pic.xiami.net/images/album/img77/593402077/5237927551426732043.jpg?x-oss-process=image/resize,limit_0,m_pad,w_185,h_185',
        }, 
        payList: [
          {
            name: '画你钱包余额',
            selected: true,
            value: 1,
            note: ''
          },
          {
            name: '微信支付',
            selected: false,
            value: 2,
            note: ''
          }
        ],
        paint: {},
        payTypes: 1 //1是画你钱包 2是微信支付
    },
    onShow(e) {
        // that.getPaintingPrice();
    },
    onLoad: function(options) {
        that = this;
        // order = wx.getStorageSync('honey-new-order');
        // console.log('order', order);
        // if (order) {
        //     prodId = order.prodId;
        //     that.setData({
        //         order: order
        //     });
        //     // that.getPaintInfo();
        //     // that.getPaintingPrice();
        // }
        if (wx.getStorageSync('myaddress')) {
            this.setData({
              myaddress: wx.getStorageSync('myaddress')
            })
        }
        if (options.orderDetail) {
            this.setData({
              paint: JSON.parse(Base64.decode(options.orderDetail))
            })
        }
        if (options.platformId) {
          this.setData({
            platformId: options.platformId,
            userId: wx.getStorageSync('honey-user').id,
            goodName: options.goodName,
            theNumber: options.theNumber,
            totalPrice: this.data.paint.price * +options.theNumber,
            totalCoin: this.data.paint.coinPrice * +options.theNumber
          })
        }

        this.getPackage();
    },
    orderConfirm(e) {

      if (that.data.isReadProtocol) {
        that.data.order.price = that.data.paintPrice.totalPrice;
        that.data.order.paintDesignRequireId = 0;
        console.log('orderParam', that.data.order);
        applyApi.postByToken('order/make-order', that.data.order, function (res) {
          console.log('make-order', res);
          orderApply.pay(res.data, function () {
            wx.setStorageSync('honey-order-status', 2);
            wx.navigateTo({
              url: `../order/order`
            })
          }, function () {
            wx.setStorageSync('honey-order-status', 1);
            wx.navigateTo({
              url: `../order/order`
            })
          })

        })
      } else { 
        that.setData({
          showTips: true,
          tipsInfo: '请同意用户协议'
        })
        setTimeout(function () {
          that.setData({
            showTips: false,
          })
        }, 1500)
      }
    },
    getPackage() {
      applyApi.jsonGetRequest('user/getUserPackage', {
        userId: wx.getStorageSync('honey-user').id
      }).then(result => {
        this.setData({
          coinBalance: result.coinBalance
        })
        var payList = this.data.payList;
        payList[0].note = result.coinBalance + '画呗';

        this.setData({
          payList: payList
        })
        console.log(result);
      }).catch(error => {
        console.log(error);
      });
    },
    bindgetaddresstap(e) {
      var that = this;
      wx.chooseAddress({
        success: function (res) {
          var address = {
            userName: res.userName,
            telNumber: res.telNumber,
            address: res.provinceName + res.cityName + res.countyName + res.detailInfo
          }
          console.log('address' + JSON.stringify(address));
          wx.setStorageSync('myaddress', address);
          that.setData({
            myaddress: address
          })
        }
      })
    },
    bindWalletTap() {
      wx.navigateTo({
        url: '../myWallet/myWallet',
      })
    },
    bindCreateOrderTap() {

      if (this.data.totalCoin > this.data.coinBalance) {
        wx.showToast({
          title: '余额不足！',
        })
      } else {
        if (!this.data.myaddress) {
            wx.showToast({
              title: '请选择地址',
              icon: 'none'
            })
        } else {
          this.makeOrder();
        }
      }

    },
    makeOrder() {
      var paint = this.data.paint;
      wx.showLoading({
        title: '订单生成中..',
      })
      applyApi.formPostRequest('order/createOrder', {
        totalPrice: this.data.totalPrice,
        totalCoin: this.data.totalCoin,
        platformId: this.data.platformId,
        leaveMessage: '',
        address: this.data.myaddress.address,
        userId: this.data.userId,
        goodId: paint.goodId,
        goodDetailId: paint.goodDetailId,
        amount: this.data.theNumber,
        contactor: this.data.myaddress.userName,
        phone: this.data.myaddress.telNumber,
        paymentType: this.data.payTypes
      }).then(result => {
        wx.hideLoading();
        var that = this;
        wx.showModal({
          content: '是否确认支付？',
          success(res) {
            if (res.confirm) {
              console.log('用户点击确定');
              // 调起支付接口
              that.wxOrderPay(result, that);
            } else if (res.cancel) {
              console.log('用户点击取消');
            }
          }
        })
      }).catch(error => {
        wx.hideLoading();
        wx.showToast({
          title: '订单出错!',
        })
        console.log(error);
      });
    },
    wxOrderPay(orderid,that) {
      wx.showLoading({
        title: '支付中..',
      })
      applyApi.formPostRequest('order/orderPay', {
        orderId: orderid,
        openId: wx.getStorageSync('honey-openId'),
        payment_type: this.data.payTypes
      }).then(result => {

        if (this.data.payTypes == 2) {
          // 微信支付
          wx.requestPayment({
            'timeStamp': result.timeStamp,
            'nonceStr': result.nonceStr,
            'package': 'prepay_id=' + result.prepayId,
            'signType': 'MD5',
            'paySign': result.paySign,
            'success': function (res) {
                wx.hideLoading();
                wx.navigateBack({
                  delta: 1
                })
            },
            'fail': function (res) {
                wx.showToast({
                  icon: 'none',
                  title: '支付失败!'
                })
                setTimeout(function() {
                  wx.navigateBack({
                    delta: 1
                  })
                },1500)
            }
          })

        } else {
          wx.hideLoading();
          wx.showToast({
            title: '支付成功!',
          })
          setTimeout(function () {
            wx.navigateBack({
              delta: 1
            })
          }, 1500)
        }
        console.log(result);
      }).catch(error => {
        wx.hideLoading();
        wx.showToast({
          icon: 'none',
          title: '支付失败!',
        })
        console.log(error);
      });
    },
    bindPayTypeSelectTap(e) {

      var index = e.currentTarget.id,
          payList = this.data.payList;
      
      payList.forEach(item => {
        item.selected = false;
      })
      payList[index].selected = true;
      
      this.setData({
        payList: payList,
        payTypes: payList[index].value
      })
      console.log('payTypes..' + this.data.payTypes);
      
    }

})
