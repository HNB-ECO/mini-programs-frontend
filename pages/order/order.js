const applyApi = require('../../utils/applyApi.js');
const verify = require('../../utils/verify.js');
const uploadFile = require('../../utils/uploadFile.js');
const orderApply = require('../../utils/order.js');

var that,app=getApp();
const formatorderstatus = {
  1: '待付款',
  2: '待发货',
  3: '待收货',
  4: '待评价',
  5: '已评价',
  6: '已取消'
}
// var pageData = new applyApi.splitPage();
Page({

  data: {
      navbarTitle: '我的订单',
      naveList:['全部','待付款','待发货','待收货'],
      currentTab:0,
      getImgMid: app.getImgMid(),
      isIphoneX: app.getSystemModelIPhoneX(),
      orderList: [],

      payTypes: 0
  },

  onLoad: function (options) {
      that=this;
      // that.getOrderListByStatus('onLoad');

      // 1 待付款 2 待发货 3待收货
      // Integer pageNum, Integer pageSize, Long userId, Integer orderStatus
    
    if (wx.getStorageSync('honey-user')) {
      this.getOrderList();
    }

  },

  onShow: function () {
      // that.getOrderListByStatus('onShow');
  },
  onReady:function(){

  },

  getOrderList(status='') {
    if (status==0) {
      status = '';
    }
    applyApi.jsonGetRequest('order/getOrderByStatus', {
      pageNum: 1,
      pageSize: 5,
      userId: wx.getStorageSync('honey-user').id,
      orderStatus: status
    }).then(result => {
      this.setData({
        orderList: result.list
      })
      console.log(result);
    }).catch(error => {
      console.log(error);
    });
  },

  chooseTab(e){
      var index = e.currentTarget.dataset.index;
      that.setData({
        currentTab: index
      })
      if (wx.getStorageSync('honey-user')) {
        this.getOrderList(index);
      }
  },

  bindOrderPayTap(e) {
    // paymentType(1.HNB, 2微信支付)
    var index = e.currentTarget.id;
    var orderList = this.data.orderList;
    this.setData({
      payTypes: e.currentTarget.dataset.paytypes
    })
    wx.showLoading({
      title: '支付中..',
    })
    applyApi.formPostRequest('order/orderPay', {
      orderId: orderList[index].id,
      openId: wx.getStorageSync('honey-openId'),
      payment_type: this.data.payTypes
    }).then(result => {

      if (this.data.payTypes == "2") {
        // 微信支付
        wx.requestPayment({
          'timeStamp': result.timeStamp,
          'nonceStr': result.nonceStr,
          'package': 'prepay_id=' + result.prepayId,
          'signType': 'MD5',
          'paySign': result.paySign,
          'success': function (res) {
            wx.hideLoading();
            setTimeout(function () {
              that.getOrderList(that.data.currentTab);
            }, 1500)
          },
          'fail': function (res) {
            wx.showToast({
              icon: 'none',
              title: '支付失败!'
            })
          }
        })

      } else {
        wx.hideLoading();
        wx.showToast({
          title: '支付成功!',
        })
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
    // wx.showLoading({
    //   title: '支付中..',
    // })
    // applyApi.formPostRequest('order/orderPay', {
    //   orderId: orderList[index].id,
    //   openId: wx.getStorageSync('honey-openId'),
    //   payment_type: this.data.payTypes
    // }).then(result => {
    //   wx.hideLoading();
    //   wx.showToast({
    //     title: '支付成功!',
    //   })
    //   setTimeout(function () {
    //     that.getOrderList(that.data.currentTab);
    //   }, 1000)
    //   console.log(result);
    // }).catch(error => {
    //   wx.hideLoading();
    //   wx.showToast({
    //     title: '支付失败!',
    //   })
    //   console.log(error);
    // });
  },
  handleLoadMore() {

  }

})
