const app = getApp()

Page({
  data: {
    userInfo: null
  },

  onShow() {
    const userInfo = wx.getStorageSync('userInfo')
    this.setData({ userInfo })
  },

  logout() {
    wx.showModal({
      title: '确认退出',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          wx.removeStorageSync('userInfo')
          app.globalData.userInfo = null
          wx.reLaunch({ url: '/pages/login/login' })
        }
      }
    })
  }
})
