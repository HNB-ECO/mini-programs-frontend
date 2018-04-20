const applyApi = require('../../utils/applyApi.js');
const verify = require('../../utils/verify.js');

var that;
var pageData = new applyApi.splitPage();
var app = getApp();
Page({
    data: {
        selectTab: 0,
        getImgMid: app.getImgMid()
    },
    onLoad: function() {
        that = this;
        that.setData({
            windowWidth: app.data.systemInfo.windowWidth
        })
        applyApi.postByToken('userAction/bannerAndTags', null, function(res) {
            that.setData({
                navList: res.data.styleTags
            })
            that.getPaintList(true);
        });
    },
    getPaintList: function(isFirst) {
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
        pageData.getData('userAction/gallerySort', function(dataList, isLoadAll) {
            console.log('gallerySort', dataList);
            that.setData({
                paintList: dataList,
                isLoadAll: isLoadAll,
            })
        }, isFirst, param);
    },
    selectTab(e) {
        var index = e.currentTarget.dataset.index;
        if (index - that.data.selectTab) {
            that.setData({
                selectTab: index
            })
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
    handleLoadMore: function(e) {
        console.log('handleLoadMore', that.data.isLoadAll);
        applyApi.loadMore(that, that.getPaintList);
    }
})
