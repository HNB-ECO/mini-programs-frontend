// templates/navbar/navbar.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    bgColor: {
      type: String,
      value: ''
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

  },

  /**
   * 组件的方法列表
   */
  methods: {
    bindGoBackTap: function () {
      wx.navigateBack({
        delta: 1
      })
    }
  }
})
