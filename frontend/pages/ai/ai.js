const { askAI, getChatHistory } = require('../../utils/api.js')

Page({
    data: {
        messages: [],
        inputText: '',
        loading: false,
        userId: 1
    },

    onLoad() {
        this.loadHistory()
    },

    loadHistory() {
        getChatHistory(this.data.userId).then(res => {
            if (res.code === 200) {
                const messages = res.data.flatMap(item => [
                    { role: 'user', content: item.question },
                    { role: 'ai', content: item.answer }
                ])
                this.setData({ messages })
            }
        })
    },

    onInput(e) {
        this.setData({ inputText: e.detail.value })
    },

    async sendQuestion() {
        const { inputText, userId } = this.data
        if (!inputText.trim()) return

        this.setData({
            messages: [...this.data.messages, { role: 'user', content: inputText }],
            inputText: '',
            loading: true
        })

        try {
            const res = await askAI(userId, inputText)
            if (res.code === 200) {
                this.setData({
                    messages: [...this.data.messages, { role: 'ai', content: res.data }],
                    loading: false
                })
            }
        } catch (err) {
            this.setData({ loading: false })
            wx.showToast({ title: '请求失败', icon: 'none' })
        }
    }
})
