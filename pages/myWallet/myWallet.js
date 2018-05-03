// pages/myWallet/myWallet.js

var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    navbarTitle: '我的钱包',
    windowWidth: app.data.systemInfo.windowWidth,
    priceList: [
      {
        hnbprice: 5,
        rmbprice: 5,
        selected: false
      },
      {
        hnbprice: 50,
        rmbprice: 50,
        selected: false
      },
      {
        hnbprice: 100,
        rmbprice: 100,
        selected: false
      },
      {
        hnbprice: 500,
        rmbprice: 500,
        selected: false
      },
      {
        hnbprice: 1000,
        rmbprice: 1000,
        selected: false
      },
      {
        hnbprice: 5000,
        rmbprice: 5000,
        selected: false
      }
    ],
    remindList:['1.因Apple政策原因，充值仅限Apple指定价格',
    '2.HNB可用于直接购买小程序内虚拟内容(包含实物产品、虚拟产品、兑换码)',
    '3.HNB为虚拟货币，充值后的HNB不会过期，但无法提现或转赠他人。']
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  bindSelectPriceTap(e) {
    var index = e.currentTarget.id;
    var list = this.data.priceList;
    list.forEach(item => {
      item.selected = false;
      list[index].selected = true;
    })
    this.setData({
      priceList: list
    })
  }

})