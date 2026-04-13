const api = require('../../utils/api.js')

Page({
  data: {
    notices: []
  },

  onLoad() {
    this.loadNotices()
  },

  async loadNotices() {
    try {
      const res = await api.getNotices(50)
      this.setData({ notices: res.data || [] })
    } catch (err) {
      wx.showToast({ title: '加载失败', icon: 'none' })
    }
  }
})
