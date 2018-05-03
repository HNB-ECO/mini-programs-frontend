const applyApi = require('../../utils/applyApi.js');
const verify = require('../../utils/verify.js');
import { Base64 } from '../../utils/urlsafe-base64';

let that, prevPage, order, paintPrice, totalPrice, pageType;
let app = getApp();
Page({
    data: {
      navbarTitle: '收货地址',
      isIphoneX: app.getSystemModelIPhoneX(),
      addressList: [{
          name: 'jerry',
          phonecall: '18136449610',
          address: '江苏省苏州市吴中区',
          addDetail: '隆江南路松泽家园6栋605',
          selected: true
        },{
          name: 'jerry',
          phonecall: '18136449610',
          address: '江苏省苏州市吴中区隆江南路松泽家园6栋605',
          addDetail: '隆江南路松泽家园6栋605',
          selected: false
        }
      ]
    },
    onLoad: function(options) {
        that = this;
        pageType = options.from;
        // if (pageType == 'profile') {
        //     wx.setNavigationBarTitle({
        //         title: '优惠券'
        //     })
        //     that.setData({
        //         pageType: pageType
        //     })
        // } else {
        //     prevPage = app.getPages(1); //上一个页面
        //     order = prevPage.data.order;
        //     paintPrice = prevPage.data.paintPrice;
        //     totalPrice = order.paintPrice + (order.isQuick ? paintPrice.quickPrice : 0);
        //     that.setData({
        //         totalPrice: totalPrice
        //     })
        // }
        // that.getCouponList();

    },
    bindAddNewAddressTap() {
      wx.navigateTo({
        url: '../newaddress-edit/newaddress-edit?types=add',
      })
    },
    bindEditAddressTap(e) {
      let qsFiles = Base64.encodeURI(JSON.stringify(this.data.addressList[e.currentTarget.id]));
      wx.navigateTo({
        url: '../newaddress-edit/newaddress-edit?types=edit&addDetail=' + qsFiles,
      })
    },


    getCouponList() {
        applyApi.postByToken('me/queryCoupon', {
            size: 1000
        }, function(res) {
          console.log('queryCoupon', JSON.stringify(res));
            var couponLen = 0;
            var list = res.data.list;
            for (var i in list) {
                list[i].endTime = applyApi.getDate(list[i].endTime);
                list[i].dateDiff = applyApi.momentDiff(list[i].endTime);
                if (pageType != 'profile') {
                    if (!list[i].standardValue || list[i].standardValue <= totalPrice) {
                        list[i].canUse = true;
                        couponLen++;
                    }
                    if (order.couponId == list[i].id) {
                        list[i].isSelected = true;
                        that.setData({
                            useCoupon: true
                        })
                    }
                } else {
                    list[i].canUse = true;
                }
            }
            that.setData({
                couponList: list,
                couponLen: couponLen
            })
        })
    },
    chooseCoupon(e) {
        console.log('e', e);
        var index = e.currentTarget.dataset.idx;
        var list = that.data.couponList;
        for (var i in list) {
            if (i == index) {
                list[i].isSelected = true;
                order.couponId = list[i].id;
                order.couponMinus = list[i].value;
                order.couponType = list[i].standardValue;
                prevPage.setData({
                    order: order
                })
            } else {
                list[i].isSelected = false;
            }
        }
        that.setData({
            couponList: list,
            useCoupon: true
        })
        wx.navigateBack({});
    },
    couponToggle(e) {
        var useCoupon = that.data.useCoupon || false;
        useCoupon = !useCoupon;
        var list = that.data.couponList;
        if (!useCoupon) {
            for (var i in list) {
                list[i].isSelected = false;
            }
            order.couponId = '';
            prevPage.setData({
                order: order
            })
        }
        that.setData({
            useCoupon: useCoupon,
            couponList: list
        })
    },
    couponActive(e) {
        applyApi.postByToken('me/activateCoupon', {
            couponCode: that.data.couponCode
        }, function(res) {
            wx.showToast({
                title: '成功激活',
                icon: 'success',
                duration: 2000
            })
            that.getCouponList();
        },function(res){
            that.setData({
                showTips:true,
                tipsInfo:res.data.message
            })
            setTimeout(function(){
                that.setData({
                    showTips:false,
                })
            },1500)
        });
    },
    searchClear(e) {
        that.setData({
            clearIconShow:false,
            couponCode:''
        })
    },
    setCouponCode(e) {
        that.setData({
            couponCode: e.detail.value
        })
        var searchContent=e.detail.value;
        if(searchContent&&searchContent!=''){
            that.setData({
                clearIconShow:true,
            })
        }else{
            that.searchClear();
        }
    }
})
