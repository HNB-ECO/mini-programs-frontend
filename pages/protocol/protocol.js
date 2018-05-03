// pages/protocol/protocol.js

const applyApi = require('../../utils/applyApi.js');

var that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navbarTitle: '用户须知',
    proList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    that.getCouponProtocol();
  },

  // 获取优惠券协议
  getCouponProtocol(callback) {
    applyApi.postByToken('mall/getDocumentByType', {
      'type': 1
    }, function (res) {
      console.log('success', res);
      that.setData({
        proList: that.formatProlist(res.data.data)
      })
      console.log('prolist ', that.data.proList);
      if (callback) {
        callback();
      }
    }, function (error) {
      console.log('fail', error);
    })
  },
  formatProlist(list) {
    return list.map(item =>  {
      return {
        'id': item.id,
        'isDelete': item.isDelete,
        'title': item.title,
        'type': item.type,
        'content': item.content.split('/n')
      }
    })
  }

})