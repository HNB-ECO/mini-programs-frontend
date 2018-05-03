const applyApi = require('../../utils/applyApi.js');
const verify = require('../../utils/verify.js');
const orderApply = require('../../utils/order.js');
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
            selected: true
          },
          {
            name: '微信支付 (支付升级中)',
            selected: false
          }
        ]
    },
    onShow(e) {
        // that.getPaintingPrice();
    },
    onLoad: function() {
        that = this;
        order = wx.getStorageSync('honey-new-order');
        console.log('order', order);
        if (order) {
            prodId = order.prodId;
            that.setData({
                order: order
            });
            // that.getPaintInfo();
            // that.getPaintingPrice();
        }
    },
    chooseCoupon(e) {
        wx.navigateTo({
            url: `../coupon/coupon`
        });
    },
    // 获取作品信息
    getPaintInfo(callback) {
        applyApi.postByToken('userAction/getProdDetail', {
            prodId: prodId
        }, function(res) {
            console.log('success', res);
            that.setData({
                paint: res.data
            })
            artistId = res.data.artistId;
            if (callback) {
                callback();
            }
        }, function(error) {
            console.log('fail', error);
        })
    },
    //计算订画价格
    getPaintingPrice: function() {
        var params = {
            artistId: that.data.order.artistId,
            paintSizeId: that.data.order.paintSizeId,
            paintStyleId: that.data.order.paintStyleId,
            isQuick: that.data.order.isQuick, //0:不急 1:加急
            peopleNumber: that.data.order.numOfPeople, //画中人数 默认为1
            couponId: that.data.order.couponId
        };
        applyApi.postByToken('order/paint-price', params, function(res) {
            console.log('计算订画价格', params, res);
            that.setData({
                paintPrice: res.data
            })
            if (!that.data.paintPrice.use) {
                that.data.order.couponId = '';
            }
        });
    },
    setFrom(e) {
        console.log('setFrom', e);
        var name = e.currentTarget.dataset.name;
        that.data.order[name] = e.detail.value;
        that.setData({
            order: that.data.order
        })
    },
    quickChange(e) {
        console.log('quickChange', e);
        if (e.detail.value) {
            that.data.order.isQuick = 1;
            that.data.order.totalPrice = that.data.order.paintPrice + that.data.paintPrice.paintPrice
        } else {
            that.data.order.isQuick = 0;
        }
        that.getPaintingPrice();
        that.setData({
            order: that.data.order
        })
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
    bindCheckReadProtocolTap(e) {
      let isReadProtocol = that.data.isReadProtocol;
      that.setData({
        isReadProtocol: !isReadProtocol
      })
    },
    bindReadProtocolTap(e) {
      wx.navigateTo({
        url: '../protocol/protocol',
      })
    }

})
