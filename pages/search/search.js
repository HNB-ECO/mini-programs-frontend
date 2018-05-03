const applyApi = require('../../utils/applyApi.js');
const verify = require('../../utils/verify.js');

var that;
let pageData = new applyApi.splitPage();
let app=getApp();
Page({
    data: {
        navbarTitle: '搜索',
        isIphoneX: app.getSystemModelIPhoneX(),
        getImgMid:app.getImgMid()
    },
    onLoad: function() {
        that = this;
        that.getHotSearch();
        that.getSearchHistory();
    },
    searching(e) {
        var content=e.detail.value;
        that.setData({
            content:content
        })
        that.getSearchRusult(true,2,content);
        that.setSearchHistory(content);
    },
    tipSearch(e){
        var content=e.currentTarget.dataset.content;
        that.setData({
            content:content,
            key:content,
            clearIconShow:true
        })
        that.getSearchRusult(true,2,content);
    },
    getHotSearch() {
        applyApi.postByToken('userAction/topSearch', null, function(res) {
            console.log('热门搜索', res);
            that.setData({
                hotTips: res.data
            })
        });
    },
    getSearchHistory() {
        var historyList=wx.getStorageSync('honey-search') || [];
        that.setData({
            historyList:historyList
        })
        return historyList
    },
    setSearchHistory(content){
        var searchHistory = that.getSearchHistory();
        searchHistory.push(content);
        wx.setStorageSync('honey-search', searchHistory);
        that.getSearchHistory();
    },
    clearSearchHistory(){
        wx.removeStorageSync('honey-search');
        that.setData({
            historyList:[]
        })
    },
    searchClear(e) {
        that.setData({
            searchResult: false,
            key: '',
            clearIconShow:false
        })
    },
    getSearchRusult(isFirst, type,key) {
        var param = [{
            name: 'key',
            value: key||that.data.content
        }, {
            name: 'type',
            value: type||2 //1:画师 2:作品
        }];
        pageData.getData('userAction/search', function(dataList, isLoadAll) {
            that.setData({
                searchResult: true,
                recommendList:dataList,
                isLoadAll:isLoadAll
            });
        }, isFirst, param);
    },
    handleLoadMore: function(e) {
        console.log('handleLoadMore', that.data.isLoadAll);
        applyApi.loadMore(that, that.getSearchRusult);
    },
    back(){
        wx.navigateBack();
    },
    closeIcon(e){
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
