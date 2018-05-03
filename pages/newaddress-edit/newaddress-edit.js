// pages/newaddress-add/newaddress-add.js
import { Base64 } from '../../utils/urlsafe-base64';
var that;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    navbarTitle: '新增地址',
    navlist: [
      {
        title: '联系人',
        inputpla: 'XXX',
        inputvalue: '',
        righticon: false
      }, {
        title: '电话',
        inputpla: '手机号码',
        inputvalue: '',
        righticon: false
      }, {
        title: '省市区',
        inputpla: 'XXX',
        inputvalue: '',
        righticon: true
      }, {
        title: '详细地址',
        inputpla: '如门牌号',
        inputvalue: '',
        righticon: false
      }
    ],
    
    region: ['北京市', '北京市', '东城区'],
    customItem: '全部'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    if (options.types == 'edit') {
      var detail = JSON.parse(Base64.decode(options.addDetail));
      this.setData({
        'navlist[0].inputvalue': detail.name,
        'navlist[1].inputvalue': detail.phonecall,
        'navlist[2].inputvalue': detail.address,
        'navlist[3].inputvalue': detail.addDetail
      })
    }
  },
  bindRegionChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    that.setData({
      region: e.detail.value,
      'navlist[2].inputvalue': e.detail.value[0] + ''
    })
  },
  bindKeyInput: function (e) {
    var index = e.currentTarget.id,
      navlist = that.data.navlist;
    navlist[index].inputvalue = e.detail.value;

    that.setData({
      navlist: navlist
    })
    console.log('navlist', navlist);
  },
  bindConfirmBtnTap() {
    
  }
})