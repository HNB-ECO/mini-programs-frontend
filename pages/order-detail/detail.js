const applyApi = require('../../utils/applyApi.js');
const verify = require('../../utils/verify.js');
const uploadFile = require('../../utils/uploadFile.js');
const orderApply = require('../../utils/order.js');

let that, app = getApp();
let second_time, countDown;
Page({

    data: {
        naveList: ['全部订单', '待支付', '待接单', '待确认', '待评分'],
        currentTab: 0,
        getImgMid: app.getImgMid()
    },

    onLoad: function(options) {
        that = this;
        that.data.orderId = options.orderId;
        that.getOrderDetail(that.data.orderId);
    },

    onShow: function() {

    },
    onHide: function() {
        console.log('onHide');

    },
    onUnload: function() {
        console.log('onUnload');
        clearInterval(countDown);
    },
    getOrderDetail:function(orderId){
        applyApi.postByToken('order/query-one', {
            orderId: orderId
        }, function(res) {
            console.log('订单详情', res);
            res.data.tradeNo = res.data.tradeNo.slice(12)
            that.setData({
                orderInfo: res.data
            })
            that.setCountDown();
        });
    },
    setCountDown: function() {
        var leftSeconds = that.data.orderInfo.leftSeconds;
        if (leftSeconds) {
            var str = leftSeconds.replace(/-/g, "/");
            var myDate = new Date(str);
            second_time = myDate.getTime() / 1000;
            that.getTime();
            if (second_time > 0) {
                countDown = setInterval(function() {
                    that.getTime();
                    console.log('countDown');
                }, 1000);
            } else {
                that.data.time = '已结束';
                that.setData({
                    time: that.data.time
                })
            }
        }
    },
    getTime: function() {
        second_time--;
        that.data.time = parseInt(second_time) + "秒";
        if (parseInt(second_time) > 60) {
            var second = parseInt(second_time) % 60;
            var min = parseInt(second_time / 60);
            that.data.time = min + "分" + second + "秒";
            if (min > 60) {
                min = parseInt(second_time / 60) % 60;
                var hour = parseInt(parseInt(second_time / 60) / 60);
                that.data.time = hour + "小时" + min + "分" + second + "秒";
                if (hour > 24) {
                    hour = parseInt(parseInt(second_time / 60) / 60) % 24;
                    var day = parseInt(parseInt(parseInt(second_time / 60) / 60) / 24);
                    that.data.time = day + "天" + hour + "小时" + min + "分" + second + "秒";
                }
            }
        }
        that.setData({
            time: that.data.time
        })
    },
    orderReceipt: function(e) {
        orderApply.receipt(that.data.orderId, function() {
            wx.setStorageSync('honey-order-status',3);
            that.getOrderDetail(that.data.orderId);
        });
    },
    comment: function(e){
        wx.navigateTo({
            url:`../comment/comment?orderId=${that.data.orderId}`
        })
    },
    paintDetail: function(e){
        var prodId=e.currentTarget.dataset.paintid;
        wx.navigateTo({
            url:`../paint-detail/paint-detail?prodId=${prodId}`
        })
    },
    diffPrice: function(e){
        var prodId=e.currentTarget.dataset.paintid;
        wx.navigateTo({
            url:`../price-diff/price-diff?orderId=${that.data.orderId}`
        })
    },
    pay: function() {
        orderApply.pay(this.data.orderId,function(){
            wx.setStorageSync('honey-order-status',1);
            that.getOrderDetail(that.data.orderId);
        },function(){});
    },
    preview:function(){
        orderApply.preview(that.data.orderInfo.completeImageBig);
    }

})
