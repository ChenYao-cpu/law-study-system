Component({
  properties: {
    question: {
      type: Object,
      value: {}
    },
    userAnswer: {
      type: String,
      value: ''
    },
    showResult: {
      type: Boolean,
      value: false
    },
    isCorrect: {
      type: Boolean,
      value: false
    }
  },

  methods: {
    selectAnswer(e) {
      if (this.properties.showResult) return

      const answer = e.currentTarget.dataset.answer
      this.triggerEvent('answer', { answer })
    }
  }
})
