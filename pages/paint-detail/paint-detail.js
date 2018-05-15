const applyApi = require('../../utils/applyApi.js');
const verify = require('../../utils/verify.js');
const uploadFile = require('../../utils/uploadFile.js')
import * as hnbdata from '../..//utils/hbndata-format.js';
import {
    configApi
} from '../../utils/constant';
import { Base64 } from '../../utils/urlsafe-base64';

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
        paintSelected: {},
        paint: {
          // imageUrls: ['http://ww2.sinaimg.cn/large/005T083dgw1fbsfphqs2yj303o03omx6.jpg', 'http://ww2.sinaimg.cn/large/005T083dgw1fbsfphqs2yj303o03omx6.jpg','http://ww2.sinaimg.cn/large/005T083dgw1fbsfphqs2yj303o03omx6.jpg'],
          // content: '可爱苹果手机壳7plus/8/x手机壳个性挂钩',
          // title: '范冰冰专属手机壳iphone手机壳',
          // rmbPrice: 240,
          // hnbPrice: 233,
          // isShipping: true,
          // people: 999,
          // numbs: 999,
          // address: '苏州',
          // paintSizes: [
          //   {
          //     name: 'R11 巴巴爸爸 送挂绳',
          //     isSelect: false,
          //   },
          //   {
          //     name: 'R11 巴巴爸爸 送挂绳',
          //     isSelect: false,
          //   },
          //   {
          //     name: 'R11 巴巴爸爸 送挂绳',
          //     isSelect: false,
          //   },
          //   {
          //     name: 'R11 巴巴爸爸 送挂绳',
          //     isSelect: false,
          //   },
          //   {
          //     name: 'R11 巴巴爸爸 送挂绳',
          //     isSelect: false,
          //   },
          //   {
          //     name: 'R11 巴巴爸爸 送挂绳',
          //     isSelect: false,
          //   },
          //   {
          //     name: 'R11 巴巴爸爸 送挂绳',
          //     isSelect: false,
          //   },
          //   {
          //     name: 'R11 巴巴爸爸 送挂绳',
          //     isSelect: false,
          //   },
          //   {
          //     name: 'R11 巴巴爸爸 送挂绳',
          //     isSelect: false,
          //   },
          //   {
          //     name: 'R11 巴巴爸爸 送挂绳',
          //     isSelect: false,
          //   },
          //   {
          //     name: 'R11 巴巴爸爸 送挂绳',
          //     isSelect: false,
          //   },
          //   {
          //     name: 'R11 巴巴爸爸 送挂绳',
          //     isSelect: false,
          //   }
          // ]
        },
        orderDetail: {},
        theNumber: 1
    },
    onLoad: function(options) {
        that = this;
        that.setData({
            windowWidth: app.data.systemInfo.windowWidth
        });

        if (options.goodId) {
          this.getGoodDetail(options.goodId);
          this.setData({
            goodId: options.goodId
          })
        }

    },
    onShow() {
      this.setData({
        showOrderPanel: false
      })
    },
    getGoodDetail(goodId) {
      applyApi.jsonGetRequest('good/getGoodInfo', {
        goodId: goodId
      }).then(result => {
        this.setData({
          paint: result
        })
        console.log(result);
      }).catch(error => {
        console.log(error);
      });
      applyApi.jsonGetRequest('good/getGoodDetail', {
        goodId: goodId
      }).then(result => {
        // this.setDefaultSelect(this.data.paintSizes);
        var paintList = hnbdata.formatGoodSelectedDetail(result);
        this.setData({
          paintSizes: paintList,
          orderDetail: paintList[0],
          paintSelected: {
            coinPrice: paintList[0].coinPrice,
            price: paintList[0].price,
            inventory: paintList[0].inventory,
            imageUrl: paintList[0].imageUrl
          }
        })
        console.log(result);
      }).catch(error => {
        console.log(error);
      });
    },
    bindGoTopTap() {
      wx.pageScrollTo({
        scrollTop: 0,
      })
    },
    makeOrder(e) {

      if (wx.getStorageSync('honey-user')) {
        that.setData({
          showOrderPanel: true
        })
      } else {
        wx.showModal({
          content: '请登录后购买！',
          success() {
            wx.switchTab({
              url: '../profile/profile',
            })
          }
        })
      }

    },

    // 设置默认尺寸和风格
    setDefaultSelect(list) {
        for (var i = 0; i < list.length; i++) {
            if (i == 0) {
                list[i].selected = true;
            } else {
                list[i].selected = false;
            }
        }
        return list;
    },
    closePanel(e) {
        that.setData({
            showOrderPanel: false
        })
    },
    selectTab(e) {
        var list = that.data.paintSizes;
        var index = e.currentTarget.dataset.index;
        for (var i in list) {
            if (i - index) {
                list[i].selected = false;
            } else {
                list[i].selected = true;
            }
        }
        // that.getPaintingPrice(index);
        this.setData({
          'paintSizes': list,
          orderDetail: list[index],
          paintSelected: {
            coinPrice: list[index].coinPrice,
            price: list[index].price,
            inventory: list[index].inventory,
            imageUrl: list[index].imageUrl
          }
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
        var theNumber = this.data.theNumber;
        if (type == 'minusBtnImg') {
            if (theNumber<= 1) {
                return
            } else {
              theNumber -= 1;
            }
        } else {
            theNumber += 1;
        }
        that.setData({
          theNumber: theNumber
        })
    },
    orderConfirm(e) {
        console.log('orderConfirm');
        let qsFiles = Base64.encodeURI(JSON.stringify(this.data.orderDetail));
        wx.navigateTo({
          url: '../order-confirm/order-confirm?orderDetail=' + qsFiles + '&goodName=' + this.data.paint.name + '&platformId=' + this.data.paint.platformId + '&theNumber=' + this.data.theNumber,
        })

        // applyApi.formPostRequest('order/orderPay', {
        //   orderId: this.data.orderDetail.id,
        //   openId: wx.getStorageSync('honey-openId'),
        //   payment_type: '1'
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
