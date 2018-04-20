const applyApi = require('../../utils/applyApi.js');
const verify = require('../../utils/verify.js');
const uploadFile = require('../../utils/uploadFile.js');
const orderApply = require('../../utils/order.js');

var that,app=getApp();
var pageData = new applyApi.splitPage();
Page({

  data: {
      naveList:['全部订单','待支付','待接单','待确认','待评分'],
      currentTab:0,
      getImgMid:app.getImgMid()
  },

  onLoad: function (options) {
      that=this;
      that.getOrderListByStatus('onLoad');
  },

  onShow: function () {
      that.getOrderListByStatus('onShow');
  },
  onReady:function(){

  },
  getOrderListByStatus:function(type){
      var orderStatus=wx.getStorageSync('honey-order-status');
      if(orderStatus){
          that.setData({
              currentTab:orderStatus,
              orderList:[]
          })
          that.getOrderList(true);
          wx.removeStorageSync('honey-order-status');
      }else{
          if(type=='onLoad'){
              that.getOrderList(true);
          }
      }
  },
  chooseTab(e){
      var index=e.currentTarget.dataset.index;
      that.setData({
          currentTab:index
      })
      that.getOrderList(true);
      that.setData({
          pageTop: 'pageTop'
      })
  },
  getOrderList(isFirst){
      console.log('getOrderList');
      var param = [{
          name: 'status',
          value: that.data.currentTab
      }, {
          name: 'size',
          value: 10
      }];
      var url;
      if(that.data.currentTab>0){
          url='order/status-list';
      }else{
          url='order/list'
      }
      pageData.getData(url, function(dataList, isLoadAll) {
          console.log('status-order', dataList);
          that.setData({
              orderList: dataList,
              isLoadAll: isLoadAll,
          })
      }, isFirst, param);
  },
  comment(e){
      var orderId=e.currentTarget.dataset.orderid;
      wx.navigateTo({
          url:`../comment/comment?orderId=${orderId}`
      })
  },
  handleLoadMore: function(e) {
      console.log('handleLoadMore', that.data.isLoadAll);
      applyApi.loadMore(that, that.getOrderList);
  },
  pay:function(e){
      var orderId=e.currentTarget.dataset.id;
      orderApply.pay(orderId,function(){
          that.getOrderList(true);
      },function(){

      });
  },
  preview:function(e){
      var img=e.currentTarget.dataset.src;
      console.log('img',img);
      orderApply.preview(img);
  }


})
