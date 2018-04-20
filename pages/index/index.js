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
var pageData = new applyApi.splitPage();
var app = getApp();
Page({
  data: {
    selectTab: 0,
    getImgMid: app.getImgMid(),
    navbarBgColor: '',
    scrollIntoView: '',
    gotopHidden: true,
    indexPage: true
  },
  onLoad: function () {
    that = this;
    that.setData({
      windowWidth: app.data.systemInfo.windowWidth
    })
    applyApi.postByToken('userAction/bannerAndTags', null, function (res) {
      that.setData({
        navList: res.data.styleTags
      })
      console.log('styleTags == ' + JSON.stringify(res.data.styleTags));
      that.getPaintList(true);
    });
  },
  getPaintList: function (isFirst) {
    var styleId = that.data.navList[that.data.selectTab].id
    var param = [{
      name: 'sortRule',
      value: 1
    }, {
      name: 'styleId',
      value: styleId == -1 ? '' : styleId
    }, {
      name: 'size',
      value: 10
    }];
    pageData.getData('userAction/gallerySort', function (dataList, isLoadAll) {
      console.log('gallerySort', JSON.stringify(dataList));
      that.setData({
        paintList: dataList,
        isLoadAll: isLoadAll,
      })
    }, isFirst, param);
  },
  selectTab(e) {
    var index = e.currentTarget.dataset.index;
    var name = e.currentTarget.dataset.name;
    console.log('idid =' + e.currentTarget.id);
    if (index - that.data.selectTab) {
      that.setData({
        selectTab: index,
        navbarBgColor: formatNavbarColor[name]
      })
      if (index == that.data.navList.length-1) {
        that.setData({
          scrollIntoView: e.currentTarget.id
        })
      }
      if (that.data.navbarBgColor != '') {
        wx.setNavigationBarColor({
          frontColor: '#ffffff',
          backgroundColor: '#000000',
        })
      } else {
        wx.setNavigationBarColor({
          frontColor: '#000000',
          backgroundColor: '#ffffff',
        })
      }
      that.getPaintList(true)
      that.setData({
        pageTop: 'pageTop'
      })
    }
  },
  paintDetail(e) {
    var prodId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `../paint-detail/paint-detail?prodId=${prodId}`
    })
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
  }
})


// const applyApi = require('../../utils/applyApi.js');
// const app = getApp()
// var that;
// var pageData = new applyApi.splitPage();
// let pageOptions = {
//     data: {
//         navList: [{
//             img: 'orderinquiry@2x.png',
//             name: '订单跟踪',
//             url: '../order/order'
//         }, {
//             img: 'commodity@2x.png',
//             name: '画作分类',
//             url: '../classify/classify'
//         }, {
//             img: 'service@2x.png',
//             name: '联系客服',
//             url: ''
//         }],
//         getImgMid:app.getImgMid(),
//         navbarBgColor: 'red'
//     },
//     onLoad: function() {
//         that=this;
//         app.setUserToken(function(){
//             that.getRecommendList(true);
//         },function(){
//             that.getRecommendList(true);
//         });

//         that.setData({
//           navbarBgColor: 'red'
//         })
//     },
//     getRecommendList:function(isFirst){
//         var param = [{
//             name: 'size',
//             value: 10
//         }];
//         if(isFirst){
//             wx.showLoading({
//                 title:'加载中'
//             });
//         }
//         pageData.getData('userAction/recommend', function(dataList, isLoadAll) {
//             console.log('recommend', dataList);
//             that.setData({
//                 recommendList: dataList,
//                 isLoadAll: isLoadAll,
//             })
//         }, isFirst, param);
//     },
//     search(e) {
//         wx.navigateTo({
//             url: `../search/search`
//         })
//     },
//     toPage(e) {
//         var index = e.currentTarget.dataset.index;
//         console.log('e', index);
//         if(index==1){
//             wx.navigateTo({
//                 url:that.data.navList[index].url
//             })
//         }else if(index==0){
//             wx.switchTab({
//                 url:that.data.navList[index].url
//             })
//         }

//     },
//     handleLoadMore: function(e) {
//         console.log('handleLoadMore', that.data.isLoadAll);
//         applyApi.loadMore(that, that.getRecommendList);
//     }
// }

// Page(pageOptions)
