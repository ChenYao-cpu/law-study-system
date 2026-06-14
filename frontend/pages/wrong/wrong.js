const api = require('../../utils/api.js')
const questionsBank = require('../../utils/questions.js')

Page({
  data: {
    wrongList: [],
    loading: false,
    score: 0,

    // 答题中
    inPractice: false,
    currentQuestion: null,
    currentOptions: [],
    currentIndex: 0,
    totalCount: 0,
    optionLabels: ['A', 'B', 'C', 'D', 'E'],
    showAnswer: false,
    isCurrentCorrect: false,

    // 练习完成
    done: false,
    doneCorrect: 0,
    doneWrong: 0
  },

  onLoad() {
    this.loadUserInfo()
  },

  onShow() {
    this.loadUserInfo()
    this.loadWrongList()
  },

  loadUserInfo() {
    const userInfo = wx.getStorageSync('userInfo')
    if (userInfo) {
      this.setData({ score: userInfo.totalScore || 0 })
    }
  },

  goBack() {
    if (this.data.inPractice) {
      // 返回错题列表
      this.setData({ inPractice: false, done: false })
      this.loadWrongList()
    } else {
      wx.navigateBack({ delta: 1 })
    }
  },

  // ========== 加载错题列表 ==========
  loadWrongList() {
    this.setData({ loading: true })
    const userInfo = wx.getStorageSync('userInfo')

    if (!userInfo || !userInfo.id) {
      this.setData({ loading: false, wrongList: [] })
      return
    }

    const wrongKey = 'wrongQuestions_' + userInfo.id
    let wrongList = wx.getStorageSync(wrongKey) || []

    // 兼容旧key
    if (!wrongList.length) {
      const old = wx.getStorageSync('wrongQuestions')
      if (old && old.length > 0) {
        wrongList = old
        wx.setStorageSync(wrongKey, wrongList)
      }
    }

    this.setData({ wrongList, loading: false })
  },

  // ========== 删除某道错题 ==========
  removeWrong(questionId) {
    const userInfo = wx.getStorageSync('userInfo')
    if (!userInfo || !userInfo.id) return

    const wrongKey = 'wrongQuestions_' + userInfo.id
    let list = wx.getStorageSync(wrongKey) || []
    // 兼容 questionId / id
    list = list.filter(w => (w.questionId || w.id) != questionId)
    wx.setStorageSync(wrongKey, list)
    this.setData({ wrongList: list })
  },

  // ========== 加积分 ==========
  addScore(points) {
    const userInfo = wx.getStorageSync('userInfo')
    if (userInfo) {
      userInfo.totalScore = (userInfo.totalScore || 0) + points
      wx.setStorageSync('userInfo', userInfo)
      this.setData({ score: userInfo.totalScore })
    }
  },

  // ========== 开始逐题练习 ==========
  startPractice() {
    const list = this.data.wrongList
    if (!list.length) {
      wx.showToast({ title: '暂无错题', icon: 'none' })
      return
    }

    // 打乱顺序
    const shuffled = [...list].sort(() => Math.random() - 0.5)

    const first = shuffled[0]
    const q = this.buildQuestion(first)
    this.setData({
      inPractice: true,
      currentQuestion: first,
      currentOptions: this.buildOptions(q),
      currentIndex: 0,
      totalCount: shuffled.length,
      showAnswer: false,
      isCurrentCorrect: false,
      done: false,
      doneCorrect: 0,
      doneWrong: 0
    })
  },

  // 从错题数据构建题目显示对象（缺失字段从题库补全）
  buildQuestion(wrong) {
    const qid = wrong.questionId || wrong.id
    const bankQ = qid ? questionsBank.find(q => q.id == qid) : null
    return {
      id: qid,
      question: wrong.question || wrong.title || (bankQ && bankQ.question) || '',
      type: wrong.type || (bankQ && bankQ.type) || 'single',
      answer: wrong.answer || (bankQ && bankQ.answer) || '',
      options: wrong.options || (bankQ && bankQ.options) || [],
      analysis: wrong.analysis || (bankQ && bankQ.analysis) || ''
    }
  },

  buildOptions(q) {
    const opts = q.options || []
    return opts.map((opt, i) => ({
      label: this.data.optionLabels[i],
      text: opt,
      isActive: false,
      isCorrectAnswer: q.answer ? q.answer.indexOf(this.data.optionLabels[i]) > -1 : false
    }))
  },

  // ========== 点击选项 ==========
  onOptionTap(e) {
    if (this.data.showAnswer) return

    const label = e.currentTarget.dataset.label
    if (!label) return

    const q = this.data.currentQuestion
    const isMulti = (q.type === 'multi')

    // 更新选中状态
    const opts = [...this.data.currentOptions]
    if (isMulti) {
      const opt = opts.find(o => o.label === label)
      if (opt) opt.isActive = !opt.isActive
    } else {
      opts.forEach(o => { o.isActive = (o.label === label) })
    }

    this.setData({ currentOptions: opts }, () => {
      this.checkAnswer()
    })
  },

  // ========== 判断对错 ==========
  checkAnswer() {
    const q = this.data.currentQuestion
    const opts = this.data.currentOptions
    const userSelected = opts.filter(o => o.isActive).map(o => o.label).sort().join('')
    const correctAns = (q.answer || '').toUpperCase().replace(/\s/g, '')

    let userAns = userSelected.toUpperCase()
    // 判断题兼容
    let isCorrect = false
    if (q.type === 'judge' || q.type === 'judgment') {
      isCorrect = (userAns === 'A' && (correctAns === '正确' || correctAns === 'A')) ||
                  (userAns === 'B' && (correctAns === '错误' || correctAns === 'B')) ||
                  userAns === correctAns
    } else {
      // 排序后比较
      isCorrect = userAns.split('').sort().join('') === correctAns.split('').sort().join('')
    }

    // 高亮正确选项
    const updatedOpts = opts.map(o => {
      o.isCorrectAnswer = correctAns.indexOf(o.label) > -1 ||
        ((q.type === 'judge' || q.type === 'judgment') && correctAns === '正确' && o.label === 'A') ||
        ((q.type === 'judge' || q.type === 'judgment') && correctAns === '错误' && o.label === 'B')
      return o
    })

    this.setData({
      showAnswer: true,
      isCurrentCorrect: isCorrect,
      currentOptions: updatedOpts
    })

    if (isCorrect) {
      // 正确：立即从错题本删除 + 加1积分
      this.removeWrong(q.id)
      this.addScore(1)
    }
  },

  // ========== 下一题 ==========
  nextQuestion() {
    const userInfo = wx.getStorageSync('userInfo')
    const wrongKey = 'wrongQuestions_' + (userInfo ? userInfo.id : '')
    const remaining = wx.getStorageSync(wrongKey) || []

    if (this.data.isCurrentCorrect) {
      // 答对了：从当前session的错题中也移除
      const qid = this.data.currentQuestion.id
      const correctCount = this.data.doneCorrect + 1
      const filtered = remaining.filter(w => (w.questionId || w.id) != qid)

      if (filtered.length === 0) {
        // 全部做完
        const total = this.data.totalCount
        this.setData({
          inPractice: false,
          done: true,
          doneCorrect: correctCount,
          doneWrong: this.data.doneWrong,
          wrongList: []
        })
        return
      }

      // 还有剩余，随机取下一道
      const next = filtered[Math.floor(Math.random() * filtered.length)]
      const q = this.buildQuestion(next)
      this.setData({
        currentQuestion: next,
        currentOptions: this.buildOptions(q),
        currentIndex: this.data.currentIndex + 1,
        totalCount: filtered.length,
        showAnswer: false,
        isCurrentCorrect: false,
        doneCorrect: correctCount
      })
    } else {
      // 答错了：保留，从剩余中取下一道
      const wrongCount = this.data.doneWrong + 1

      if (remaining.length === 0) {
        const total = this.data.totalCount
        this.setData({
          inPractice: false,
          done: true,
          doneCorrect: this.data.doneCorrect,
          doneWrong: wrongCount,
          wrongList: []
        })
        return
      }

      const next = remaining[Math.floor(Math.random() * remaining.length)]
      const q = this.buildQuestion(next)
      this.setData({
        currentQuestion: next,
        currentOptions: this.buildOptions(q),
        currentIndex: this.data.currentIndex + 1,
        totalCount: remaining.length,
        showAnswer: false,
        isCurrentCorrect: false,
        doneWrong: wrongCount
      })
    }
  },

  // ========== 重新开始 ==========
  restartPractice() {
    this.setData({ done: false, inPractice: false })
    this.loadWrongList()
  },

  backToHome() {
    wx.navigateBack({ delta: 1 })
  }
})
