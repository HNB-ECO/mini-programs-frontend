const applyApi = require('../../utils/applyApi.js');
const verify = require('../../utils/verify.js');
const orderApply = require('../../utils/order.js');
let that, app = getApp();

Page({
    data: {
        navbarTitle: '补差价',
        isIphoneX: app.getSystemModelIPhoneX(),
        order: {
            price: 0.0,
            remark: ''
        }
    },
    onLoad: function(options) {
        that = this;
        that.data.order.orderId = options.orderId;
    },
    setPrice(e) {
        var limitPrice = function(input) {
            input=input.trim();
            if (input === undefined||input =='') {
                input = 0;
            }
            if (input !== null) {
                input = input.toString();
                if (input.length == 1) {
                    input = input.replace(/[^0-9]/g, '');
                } else {
                    input = (input.match(/\d+(\.\d{0,1})?/) || [''])[0];
                }
            }
            return parseFloat(input);
        }
        that.data.order.price = limitPrice(e.detail.value);
        that.setData({
            order: that.data.order
        })
    },
    setRemark(e) {
        that.data.order.remark = e.detail.value;
        that.setData({
            order: that.data.order
        })
    },
    priceUpdate() {
        console.log('order', that.data.order);
        if (that.data.order.price) {
            orderApply.payDiff(that.data.order, function() {
                wx.showToast({
                    title: '补差价成功',
                    icon: 'success',
                    duration: 2000,
                    complete: function() {
                        var prevPage = app.getPages(1);
                        prevPage.getOrderDetail(that.data.order.orderId);
                    }
                })
            }, function() {
                that.setData({
                    showTips: true,
                    tipsInfo: '补差价失败'
                })
                setTimeout(function() {
                    that.setData({
                        showTips: false,
                    })
                }, 2000)
            }, that)
        } else {
            that.setData({
                showTips: 'true',
                tipsInfo: '请输入差价金额'
            })
            setTimeout(function() {
                that.setData({
                    showTips: false,
                })
            }, 2000)
        }


    }

})
