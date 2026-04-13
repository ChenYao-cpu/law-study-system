const api = require('../../utils/api.js')

Page({
  data: {
    examId: null,
    questions: [],
    currentIndex: 0,
    answers: {},
    timeLeft: 1800,
    timer: null
  },

  onLoad() {
    this.startExam()
  },

  onUnload() {
    if (this.data.timer) {
      clearInterval(this.data.timer)
    }
  },

  async startExam() {
    wx.showLoading({ title: '准备考试' })
    const userInfo = wx.getStorageSync('userInfo')

    try {
      const res = await api.startExam(userInfo.id, 20)
      const exam = res.data

      this.setData({
        examId: exam.id,
        questions: exam.questions || [],
        timeLeft: 1800
      })

      this.startTimer()
    } catch (err) {
      wx.showToast({ title: '开始考试失败', icon: 'none' })
    }
    wx.hideLoading()
  },

  startTimer() {
    this.data.timer = setInterval(() => {
      const timeLeft = this.data.timeLeft - 1
      this.setData({ timeLeft })

      if (timeLeft <= 0) {
        this.submitExam()
      }
    }, 1000)
  },

  formatTime(seconds) {
    const min = Math.floor(seconds / 60)
    const sec = seconds % 60
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`
  },

  selectAnswer(e) {
    const { questionId, answer } = e.currentTarget.dataset
    const answers = { ...this.data.answers }
    answers[questionId] = answer
    this.setData({ answers })
  },

  prevQuestion() {
    if (this.data.currentIndex > 0) {
      this.setData({ currentIndex: this.data.currentIndex - 1 })
    }
  },

  nextQuestion() {
    if (this.data.currentIndex < this.data.questions.length - 1) {
      this.setData({ currentIndex: this.data.currentIndex + 1 })
    }
  },

  async submitExam() {
    if (this.data.timer) {
      clearInterval(this.data.timer)
    }

    wx.showModal({
      title: '确认交卷',
      content: '确定要提交试卷吗？',
      success: async (res) => {
        if (res.confirm) {
          try {
            const result = await api.submitExam(this.data.examId, this.data.answers)

            wx.showModal({
              title: '考试结果',
              content: `得分：${result.data.score}/${result.data.totalScore}`,
              showCancel: false,
              success: () => {
                wx.navigateBack()
              }
            })
          } catch (err) {
            wx.showToast({ title: '提交失败', icon: 'none' })
          }
        }
      }
    })
  }
})
