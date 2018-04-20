import {
    configApi
} from './constant.js';
const applyApi = require('./applyApi.js');

function receipt(orderId, callback) {
    applyApi.postByToken('/order/confirm-order', {
        orderId: orderId
    }, function(res) {
        console.log('确认收货成功', res);
        if (callback) {
            callback();
        }
    });
}

function pay(orderId, success, error) {
    applyApi.postByToken('pay/weixin-pay-new', {
        orderId: orderId,
        type: 3
    }, function(res) {
        console.log('支付参数', res);
        let params = JSON.parse(res.data.weixinpayInfo);
        params.success = function(res2) {
            console.log('支付成功: ', res2)
            if (success) {
                success();
            }
        }
        params.fail = function(err) {
            console.log('支付失败: ', err);
            if (error) {
                error();
            }
        }
        wx.requestPayment(params)
    });
}
function payDiff(order,success,error,that){
    applyApi.postByToken('pay/weixin-pay-new/add', {
        price:order.price,
        orderId: order.orderId,
        type: 3,
        remark:order.remark,
    }, function(res) {
        console.log('支付参数', res);
        let params = JSON.parse(res.data.weixinpayInfo);
        params.success = function(res2) {
            console.log('支付成功: ', res2)
            if (success) {
                success();
            }
        }
        params.fail = function(err) {
            console.log('支付失败: ', err);
            if (error) {
                error();
            }
        }
        wx.requestPayment(params)
    },function(err){
        that.setData({
            showTips:true,
            tipsInfo:err.data.message
        });
        setTimeout(function(){
            that.setData({
                showTips:false,
            })
        },2000)
    });
}
function preview(src,srcArr) {
    wx.previewImage({
        current: src, // 当前显示图片的http链接
        urls: srcArr||[src] // 需要预览的图片http链接列表
    })
}
module.exports = {
    receipt: receipt,
    pay: pay,
    preview:preview,
    payDiff:payDiff
}
