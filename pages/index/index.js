// //index.js

const applyApi = require('../../utils/applyApi.js');
const verify = require('../../utils/verify.js');

const formatNavbarColor = {
  '全部': '',
  'Q版漫画': '#E9C981',
  '日系漫画': '#EAD2C1',
  '其他': '#B6D7B3',
  '日本画师': '#AAB3B8',
}

var that;
var app = getApp();
Page({
  data: {
    selectTab: 0,
    getImgMid: app.getImgMid(),
    navbarBgColor: '#FFFFFF',
    scrollIntoView: '',
    gotopHidden: true,
    indexPage: true,
    isIphoneX: app.getSystemModelIPhoneX(),

    imgUrls: ['http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
      'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg'],
    xItems: [
      {
        title: '范冰冰同款',
        list: [
          {
            tit: '范冰冰专属手机壳',
            types: '手机壳',
            des: '可爱苹果7plus/8/X手机壳个性iphone6s挂钩',
            imgurl: 'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
            hnb: '233HNB',
            rmb: 0,
            note: '仅限HNB支付'
          },
          {
            tit: '范冰冰专属手机壳',
            types: '手机壳',
            des: '可爱苹果7plus/8/X手机壳个性iphone6s挂钩个性iphone6s挂钩',
            imgurl: 'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
            hnb: '233HNB',
            rmb: 0,
            note: '仅限HNB支付'
          },
          {
            tit: '范冰冰专属手机壳',
            types: '手机壳',
            des: '可爱苹果7plus/8/X手机壳个性iphone6s挂钩个性iphone6s挂钩',
            imgurl: 'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
            hnb: '233HNB',
            rmb: 0,
            note: '仅限HNB支付'
          }
        ]
      },
      {
        title: '范冰冰签名照',
        list: [
          {
            id: 0,
            imgurl: 'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
          },
          {
            id: 0,
            imgurl: 'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
          },
          {
            id: 0,
            imgurl: 'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
          }
        ]
      },
      {
        title: '范冰冰周边',
        types: 'wide',
        list: [
          {
            id: 0,
            imgurl: 'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
          },
          {
            id: 0,
            imgurl: 'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
          },
          {
            id: 0,
            imgurl: 'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
          }
        ]
      },
      {
        title: '范冰冰代言',
        types: 'wide',
        list: [
          {
            id: 0,
            imgurl: 'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
          },
          {
            id: 0,
            imgurl: 'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
          },
          {
            id: 0,
            imgurl: 'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
          }
        ]
      }
    ]
  },
  onLoad: function () {
    that = this;
    that.setData({
      windowWidth: app.data.systemInfo.windowWidth
    })

    applyApi.jsonGetRequest('platform/getMainInfo',{
      platformId: 1
    }).then(result => {
      this.setData({
        goodsTypes: result.goodsTypes
      })
      console.log(result);
    }).catch(error => {
      console.log(error);
    });

  },
 
  handleLoadMore: function (e) {
    console.log('handleLoadMore', that.data.isLoadAll);
    applyApi.loadMore(that, that.getPaintList);
  },
  handleScroll(e) {
    if (e.detail.scrollTop > 500) {
      that.setData({
        gotopHidden: false
      });
    } else {
      that.setData({
        gotopHidden: true
      });
    }
  },
  bindGotopTap(e) {
    that.setData({
      pageTop: 'pageTop'
    })
  },
  bindPaintDetail(e) {
    wx.navigateTo({
      url: '../paint-detail/paint-detail?goodId=' + e.currentTarget.id,
    })
  }
})


