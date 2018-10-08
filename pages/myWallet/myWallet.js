// pages/myWallet/myWallet.js
const applyApi = require('../../utils/applyApi.js');
var util = require('../../utils/encode.js');  

var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isRemaidHidden: false,
    navbarTitle: '我的钱包',
    windowWidth: app.data.systemInfo.windowWidth,
    showModal: false,
    cashModal: false,
    hnbAddress: "",
    reShowModal:false,
    inputCoin:'',
    blockCoin:"",
    // 绑定钱包地址
    coinAddress: "",

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
    remindList: ['1.因Apple政策原因，充值仅限Apple指定价格',
      '2.画呗可用于直接购买小程序内虚拟内容(包含实物产品、虚拟产品、兑换码)',
      '3.画呗为虚拟货币，充值后的画呗不会过期，但无法提现或转赠他人。']
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
        this.init()
   
  },

  init:function(){
    applyApi.jsonGetRequest('user/getUserPackage', {
      userId: wx.getStorageSync('honey-user').id
    }).then(result => {

      if (result.walletAddress == null || result.walletAddress == "") {
        var coinShow = result.coinBalance - result.blockCoin
        this.setData({
          coinBalance: coinShow,
          blockCoin: result.blockCoin,
          hnbAddress: "点击绑定钱包地址"
        })
      } else {
        var coinShow = result.coinBalance - result.blockCoin
        this.setData({
          coinBalance: coinShow,
          blockCoin: result.blockCoin,
          hnbAddress: result.walletAddress.substring(0, 4) + "****" + result.walletAddress.substring(28, 32)
        })
      }

      console.log(result);

    }).catch(error => {
      console.log(error);
    });


  },

  bindSelectPriceTap(e) {
    var index = e.currentTarget.id;
    var list = this.data.priceList;
    list.forEach(item => {
      item.selected = false;
      list[index].selected = true;
    })
    this.setData({
      priceList: list,
      selectPrice: list[index].rmbprice
    })
  },

  bindComftPayTap() {
    wx.showLoading({
      title: '充值中..',
    })
    applyApi.formPostRequest('user/userRecharge', {
      userId: wx.getStorageSync('honey-user').id,
      openId: wx.getStorageSync('honey-openId'),
      price: this.data.selectPrice
    }).then(result => {
      wx.hideLoading();

      // 微信支付
      wx.requestPayment({
        'timeStamp': result.timeStamp,
        'nonceStr': result.nonceStr,
        'package': 'prepay_id=' + result.prepayId,
        'signType': 'MD5',
        'paySign': result.paySign,
        'success': function (res) {
          wx.hideLoading();
          wx.showToast({
            title: '充值成功!',
          })
          setTimeout(function () {
            wx.navigateBack({
              delta: 1
            })
          }, 1500)
        },
        'fail': function (res) {
          wx.showToast({
            icon: 'none',
            title: '充值失败!'
          })
        }
      })

      console.log(result);
    }).catch(error => {
      console.log(error);
    });
  },
  bindCloseRemaidTap() {
    this.setData({
      isRemaidHidden: true
    })
  },

  // 地址弹出层
  showDialogBtn: function () {

    if (this.data.hnbAddress == null || this.data.hnbAddress == "" || this.data.hnbAddress == "点击绑定钱包地址"){
      this.setData({
        showModal: true
      })
    }else{
      this.setData({
        reShowModal: true
      })

    }
   
  },
  /**
   * 弹出框蒙层截断touchmove事件
   */
  preventTouchMove: function () {
  },
  /**
   * 隐藏模态对话框
   */
  hideModal: function () {
    this.setData({
      showModal: false
    });
  },
  /**
   * 对话框取消按钮点击事件
   */
  onCancel: function () {
    this.hideModal();
  },
  /**
   * 对话框确认按钮点击事件
   */
  onConfirm: function () {
    this.hideModal();
  },
  // 提现弹出层
  showLimit: function () {
    this.setData({
      cashModal: true
    })
  },
  /**
   * 弹出框蒙层截断touchmove事件
   */
  cashPreventTouchMove: function () {
  },
  /**
   * 隐藏模态对话框
   */
  cashideModal: function () {
    this.setData({
      cashModal: false
    });
  },
  /**
   * 对话框取消按钮点击事件
   */
  cashCancel: function () {
    this.cashideModal();
  },
  inputMoney:function(e){
    this.setData({
      inputCoin: e.detail.value
    })
   
  },

   //提币确认
  cashConfirm: function () {
    // applyAmount
    if (this.data.inputCoin > 0 && this.data.inputCoin <= this.data.coinBalance){
      applyApi.formPostRequest('withdraw/applyWithdraw', {
        userId: wx.getStorageSync('honey-user').id,
        // openId: wx.getStorageSync('honey-openId'),
        applyAmount: this.data.inputCoin
      }).then(result => {

        setTimeout(function () {
          wx.showToast({
            title: '提币成功！',
          })
        }, 500)
        this.init()
        this.cashideModal();

      }).catch(error => {
        console.log(error);
        wx.showToast({
          title: error,
        })
      });
    }else{
      wx.showToast({
        title: '提币金额有误！',
      })
    }
 

  },
  // 获取钱包地址
  inputChange: function (e) {
    var that = this;
    that.setData({
      coinAddress:e.detail.value
    })
    console.log(this.data.coinAddress)
  },
  // 绑定地址
  onConfirm:function(){
   
    if (this.data.coinAddress == '' || this.data.coinAddress == null){
      wx.showToast({
        title: '请输入地址！',
      })
    }else{
      applyApi.formPostRequest('user/bindUserWalletAddress', {
        userId: wx.getStorageSync('honey-user').id,
        walletAddress: util.encode(this.data.coinAddress)
      }).then(result => {
        console.log(result);
        setTimeout(function () {
          wx.showToast({
            title: '绑定成功',
          })
        }, 500)
        this.hideModal();
        this.init()
      }).catch(error => {
        console.log(error);
      });

    }
  
  },
  reOnCancel:function(){
    this.setData({
      reShowModal: false
    })
  },
  reOnConfirm:function(){
    this.setData({
      reShowModal: false,
      showModal:true
    })
  },
  // 查看详情
  clickMore:function(){

    console.log("1")

  wx.navigateTo({
    url: '../course/course',
  })
  }

  
 


})