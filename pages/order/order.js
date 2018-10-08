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
var workId = ""
 
Page({

  data: {
      navbarTitle: '我的订单',
      naveList:['全部','待付款','待发货','待收货'],
      currentTab:0,
      getImgMid: app.getImgMid(),
      showModal: false,
      reShowModal:false,
      infoList:"",
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
      pageSize: 15,
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

  },
  handleLoadMore() {

  },

  bindCancelOrderTap(e) {

    applyApi.wxFormBackendPostRequestP('order/cancelOrder', {
      orderId: +e.currentTarget.id
    }).then(result => {
      wx.showToast({
        title: '订单已取消',
      })
      this.getOrderList();
    }).catch(error => {
      console.log(error);
    });

  },

  bindShipTap() {
    wx.showToast({
      icon: 'none',
      title: '已提醒~请耐心等待宝贝~',
    })
  },

  // 查看物流
  logistics:function(e){
    console.log(e.currentTarget.dataset.id)
    workId = e.currentTarget.dataset.id
     this.setData({
       showModal:true
     })
     applyApi.formPostRequest('order/checkExpress', {
       workOrderId: e.currentTarget.dataset.id
     }).then(result => {
       console.log(result);
       this.setData({
         expName: result.expName,
         infoList: result.expressAreaList
       })
     }).catch(error => {
       wx.hideLoading();
       wx.showToast({
         icon: 'none',
         title: error,
       })
       console.log(error);
     });
  },
  /**
  * 弹出框蒙层截断touchmove事件
  */
  preventTouchMove: function () {
  },
  hideModal: function () {
    this.setData({
      showModal: false
    });
  
  },

  // 确认收货
  confirmGet:function(e){
    this.setData({
      reShowModal: true
    });
    workId = e.currentTarget.dataset.id
    console.log(workId)
  },
  reOnCancel: function () {
    this.setData({
      reShowModal: false
    })
  },
  reOnConfirm: function () {
    console.log(workId)
   applyApi.formPostRequest('order/confirmReceive', {
     workOrderId: workId
   }).then(result => {
     console.log(result);
     wx.showToast({
       title: "收货成功",
     })
     this.setData({
       reShowModal: false
     })
   }).catch(error => {
     wx.hideLoading();
     wx.showToast({
       icon: 'none',
       title: error,
     })
     console.log(error);
   });
   this.getOrderList();

  },
})
