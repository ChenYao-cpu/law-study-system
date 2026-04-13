const api = require('../../utils/api.js')

Page({
  data: {
    overview: {},
    progressList: [],
    chartData: []
  },

  onLoad() {
    this.loadData()
  },

  async loadData() {
    const userInfo = wx.getStorageSync('userInfo')

    try {
      const [overview, progress] = await Promise.all([
        api.getStudyOverview(userInfo.id),
        api.getCourseProgress(userInfo.id)
      ])

      this.setData({
        overview: overview.data || {},
        progressList: progress.data || [],
        chartData: this.generateChartData(progress.data || [])
      })
    } catch (err) {
      wx.showToast({ title: '加载失败', icon: 'none' })
    }
  },

  generateChartData(progressList) {
    return progressList.map(item => ({
      name: item.courseTitle,
      value: item.progress
    }))
  }
})
