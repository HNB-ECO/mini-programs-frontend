// templates/navbar/navbar.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    bgColor: {
      type: String,
      value: '#FFFFFF'
    },
    indexPage: {
      type: Boolean,
      value: false
    },
    navbarTitle: {
      type: String,
      value: ''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    isIPhoneX: false
  },

  ready() {
    var model = wx.getSystemInfoSync().model;
    let models = model.split('(');
    if (models[0] == 'iPhone X ') {
      this.setData({
        isIPhoneX: true
      })
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    bindGoBackTap: function () {
      wx.navigateBack({
        delta: 1
      })
    },
    bindSearchTap: function () {
      wx.navigateTo({
        url: '../search/search',
      })
    }
  }
})
