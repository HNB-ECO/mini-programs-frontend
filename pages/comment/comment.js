const applyApi = require('../../utils/applyApi.js');
const verify = require('../../utils/verify.js');
const uploadFile = require('../../utils/uploadFile.js');

let that, app = getApp();

Page({
    data: {
        navbarTitle: '评价',
        isIphoneX: app.getSystemModelIPhoneX(),
        comment: {
            score: 4,
            isAnonymous: 1, //0:公开 1:匿名
            imageUrls: '',
        },
        uploadImgLength: 0,
        uploadImgArr: [],
        windowWidth: app.data.systemInfo.windowWidth,
        starDes: ['非常差，我要吐槽', '不满意，比较差', '一般，继续努力', '满意，可以经常来', '超赞，值得翻山越岭来拔草']
    },
    onLoad: function(options) {
        that = this;
        that.data.comment.orderId=options.orderId;
    },
    chooseStar(e) {
        var index = e.currentTarget.dataset.index;
        that.data.comment.score = index;
        that.setData({
            comment: that.data.comment
        })
    },
    anonymousToggle(e) {
        if (that.data.comment.isAnonymous) {
            that.data.comment.isAnonymous = 0;
        } else {
            that.data.comment.isAnonymous = 1;
        }
        that.setData({
            comment: that.data.comment
        })
    },
    chooseImg(e) {
        uploadFile.uploadFile(that, null, 9);
    },
    setContent(e) {
        that.data.comment.content = e.detail.value;
        that.setData({
            comment: that.data.comment
        })
    },
    delImg(e) {
        var index = e.currentTarget.dataset.index;
        that.data.uploadImgArr.splice(index, 1);
        that.setData({
            uploadImgArr: that.data.uploadImgArr
        })
    },
    commentUpdate(e) {
        that.data.comment.score += 1;
        if (that.data.uploadImgArr.length) {
            that.data.comment.imageUrls = that.data.uploadImgArr.join();
        }
        applyApi.postByToken('order/comment-order', that.data.comment, function(res) {
            wx.setStorageSync('honey-order-status',4);
            wx.switchTab({
                url:'../order/order'
            })
        });
        console.log('that.data.comment', that.data.comment);
    }
})
