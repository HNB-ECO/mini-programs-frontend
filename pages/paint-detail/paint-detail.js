const applyApi = require('../../utils/applyApi.js');
const verify = require('../../utils/verify.js');
const uploadFile = require('../../utils/uploadFile.js')
import {
    configApi
} from '../../utils/constant';

var that, prodId, artistId, paintSizeId, paintStyleId;

var app = getApp();
var plusBtnImg = {
    basic: '../../images/add@2x.png',
    hover: '../../images/add-nor@2x.png'
};
var minusBtnImg = {
    basic: '../../images/min@2x.png',
    hover: '../../images/min-nor@2x.png'
};
Page({
    data: {
        navbarTitle: '画作详情',
        isIphoneX: app.getSystemModelIPhoneX(),
        windowWidth: '',
        windowHeight: '',
        showOrderPanel: false,
        plusBtnImg: plusBtnImg.basic,
        minusBtnImg: minusBtnImg.basic,
        getImgMid: app.getImgMid(),
        getImgBig: app.getImgBig(),
        order: {
            numOfPeople: 1,
            isQuick: 0,
            couponId: '',
            contactor:configApi.ENV=='DEV'?'wendy':'',
            phone:configApi.ENV=='DEV'?18551587968:'',
        },
        sourceImageUrl:configApi.ENV=='DEV'?'http://ww2.sinaimg.cn/large/005T083dgw1fbsfphqs2yj303o03omx6.jpg':'',
        paint: {
          imageUrls: ['http://ww2.sinaimg.cn/large/005T083dgw1fbsfphqs2yj303o03omx6.jpg', 'http://ww2.sinaimg.cn/large/005T083dgw1fbsfphqs2yj303o03omx6.jpg','http://ww2.sinaimg.cn/large/005T083dgw1fbsfphqs2yj303o03omx6.jpg'],
          content: '可爱苹果手机壳7plus/8/x手机壳个性挂钩',
          title: '范冰冰专属手机壳iphone手机壳',
          rmbPrice: 240,
          hnbPrice: 233,
          isShipping: true,
          people: 999,
          numbs: 999,
          address: '苏州',
          paintSizes: [
            {
              name: 'R11 巴巴爸爸 送挂绳',
              isSelect: false,
            },
            {
              name: 'R11 巴巴爸爸 送挂绳',
              isSelect: false,
            },
            {
              name: 'R11 巴巴爸爸 送挂绳',
              isSelect: false,
            },
            {
              name: 'R11 巴巴爸爸 送挂绳',
              isSelect: false,
            },
            {
              name: 'R11 巴巴爸爸 送挂绳',
              isSelect: false,
            },
            {
              name: 'R11 巴巴爸爸 送挂绳',
              isSelect: false,
            },
            {
              name: 'R11 巴巴爸爸 送挂绳',
              isSelect: false,
            },
            {
              name: 'R11 巴巴爸爸 送挂绳',
              isSelect: false,
            },
            {
              name: 'R11 巴巴爸爸 送挂绳',
              isSelect: false,
            },
            {
              name: 'R11 巴巴爸爸 送挂绳',
              isSelect: false,
            },
            {
              name: 'R11 巴巴爸爸 送挂绳',
              isSelect: false,
            },
            {
              name: 'R11 巴巴爸爸 送挂绳',
              isSelect: false,
            }
          ]
        }
    },
    onLoad: function(options) {
        that = this;
        that.setData({
            windowWidth: app.data.systemInfo.windowWidth
        });
        // prodId = options.prodId || 890;
        // that.getPaintInfo();

    },
    bindGoTopTap() {
      wx.pageScrollTo({
        scrollTop: 0,
      })
    },
    makeOrder(e) {
        console.log('makeOrder');
        that.setData({
            showOrderPanel: true
        })
        // app.openSetting(function(){
        //     that.getPainterInfo(artistId,prodId,function(){
        //         that.setData({
        //             showOrderPanel: true
        //         })
        //     });
        // })
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
            that.getRecommendList(res.data.paintStyleId);

            if (callback) {
                callback();
            }
        })
    },
    // 获取猜你喜欢
    getRecommendList: function(styleId) {
        applyApi.postByToken('userAction/gallerySort', {
            page: 1,
            size: 4,
            styleId: styleId,
            sortRule: 4
        }, function(res) {
            console.log('getRecommendList', res);
            that.setData({
                recommendList: res.data.list
            })
        })
    },
    // 获取画师信息
    getPainterInfo(artistId, prodId,callback) {
        applyApi.postByToken('artistPage/paintInfo', {
            artistId: artistId,
            publishId: prodId
        }, function(res) {
            console.log('画师绘画信息', res);
            var paintSizes = that.setDefaultSelect(res.data.paintSizes);
            var paintStyleList = that.setDefaultSelect(res.data.paintStyles);
            paintSizeId = paintSizes[0].id;
            that.data.order.paintSizeName=paintSizes[0].name;
            paintStyleId = paintStyleList[0].id;
            that.data.order.paintStyleName=paintStyleList[0].name;
            that.setData({
                paintSizes: paintSizes,
                paintStyleList: paintStyleList
            })
            that.getPaintingPrice();
            if(callback){
                callback();
            }
        }, function(error) {
            console.log('fail', error);
            if(error.data.code==11005){
                that.setData({
                    showTips:true,
                    tipsInfo:error.data.message
                });
                setTimeout(function(){
                    that.setData({
                        showTips:false,
                    })
                },2000)
            }
        });
    },
    // 设置默认尺寸和风格
    setDefaultSelect(list) {
        for (var i = 0; i < list.length; i++) {
            if (i == 0) {
                list[i].isSelect = true;
            } else {
                list[i].isSelect = false;
            }
        }
        return list;
    },
    //计算订画价格
    getPaintingPrice: function() {
        var params = {
            artistId: artistId,
            paintSizeId: paintSizeId,
            paintStyleId: paintStyleId,
            isQuick: that.data.order.isQuick, //0:不急 1:加急
            peopleNumber: that.data.order.numOfPeople, //画中人数 默认为1
            couponId: that.data.order.couponId
        };
        applyApi.postByToken('order/paint-price', params, function(res) {
            console.log('计算订画价格', params, res);
            that.setData({
                paintPrice: res.data
            })
        });
    },
    closePanel(e) {
        that.setData({
            showOrderPanel: false
        })
    },
    selectTab(e) {
        var list = that.data.paint.paintSizes;
        var index = e.currentTarget.dataset.index;
        for (var i in list) {
            if (i - index) {
                list[i].isSelect = false;
            } else {
                list[i].isSelect = true;
            }
        }
        // that.getPaintingPrice();
        that.setData({
          'paint.paintSizes': list
        })
    },
    btnHover(e) {
        var type = e.currentTarget.dataset.type;
        var changeData = function(evType) {
            that.setData({
                [type]: type == 'plusBtnImg' ? plusBtnImg[evType] : minusBtnImg[evType]
            })
        }
        changeData('hover');
        setTimeout(function() {
            changeData('basic')
        }, 200)
        if (type == 'minusBtnImg') {
            if (that.data.order.numOfPeople <= 1) {
                return
            } else {
                that.data.order.numOfPeople -= 1;
            }
        } else {
            that.data.order.numOfPeople += 1;
        }
        console.log('numOfPeople', that.data.order);
        that.getPaintingPrice();
        that.setData({
            order: that.data.order
        })
    },
    orderConfirm(e) {
        console.log('orderConfirm');
        var verifing = [{
            name: 'isEmpty',
            content: that.data.order.contactor,
            tip: '请填写收货人姓名'
        }, {
            name: 'isEmpty',
            content: that.data.order.phone,
            tip: '请填写收货人电话'
        }, {
            name: 'isEmpty',
            content: that.data.sourceImageUrl,
            tip: '请上传图片'
        }];
        if(verify.verified(verifing,that)){
            that.data.order.prodId=prodId;
            that.data.order.contentId=artistId;
            that.data.order.artistId=artistId;
            that.data.order.paintSizeId=paintSizeId;
            that.data.order.paintStyleId=paintStyleId;
            that.data.order.patternOfPayment='WX_WEAPP';
            that.data.order.type=0; //订单类型 0:画 1:商品
            that.data.order.amount=1;
            that.data.order.isQuick=0;
            that.data.order.paintPrice=that.data.paintPrice.totalPrice;
            that.data.order.sourceImageUrl=that.data.sourceImageUrl;
            wx.setStorageSync('honey-new-order',that.data.order);
            wx.navigateTo({
                url: `../order-confirm/order-confirm`
            });
        }
    },
    showMore(e) {
        var showMoreLovers = that.data.showMoreLovers || false;
        that.setData({
            showMoreLovers: !showMoreLovers
        })
    },
    paintDetail(e) {
        var prodId = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: `../paint-detail/paint-detail?prodId=${prodId}`
        })
    },
    uploadImg(e) {
        uploadFile.uploadFile(that, 'sourceImageUrl');
    },
    setFrom(e){
        console.log('setFrom',e);
        var name=e.currentTarget.dataset.name;
        that.data.order[name]=e.detail.value;
        that.setData({
            order:that.data.order
        })
    }
})
