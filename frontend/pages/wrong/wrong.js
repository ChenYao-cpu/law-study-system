const api = require('../../utils/api.js')

Page({
  data: {
    wrongList: [],
    loading: false
  },

  onLoad() {
    this.loadWrongList()
  },

  async loadWrongList() {
    this.setData({ loading: true })
    const userInfo = wx.getStorageSync('userInfo')

    try {
      const res = await api.getWrongList(userInfo.id)
      this.setData({ wrongList: res.data || [] })
    } catch (err) {
      wx.showToast({ title: '加载失败', icon: 'none' })
    }
    this.setData({ loading: false })
  },

  async removeWrong(e) {
    const questionId = e.currentTarget.dataset.id
    const userInfo = wx.getStorageSync('userInfo')

    try {
      await api.removeWrong(userInfo.id, questionId)
      wx.showToast({ title: '移除成功', icon: 'success' })
      this.loadWrongList()
    } catch (err) {
      wx.showToast({ title: '操作失败', icon: 'none' })
    }
  }
})
