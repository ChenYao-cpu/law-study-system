const api = require('../../utils/api.js')

Page({
    data: {
        notices: [],
        studyOverview: {},
        recommendCourses: [],
        userInfo: null
    },

    onLoad() {
        this.checkLogin()
    },

    onShow() {
        if (this.data.userInfo) {
            this.loadData()
        }
    },

    checkLogin() {
        const userInfo = wx.getStorageSync('userInfo')
        if (userInfo) {
            this.setData({ userInfo })
            this.loadData()
        } else {
            wx.redirectTo({ url: '/pages/login/login' })
        }
    },

    async loadData() {
        try {
            const userId = this.data.userInfo.id

            const [notices, overview, courses] = await Promise.all([
                api.getNotices(5),
                api.getStudyOverview(userId),
                api.getRecommend()
            ])

            this.setData({
                notices: notices.data || [],
                studyOverview: overview.data || {},
                recommendCourses: courses.data || []
            })
        } catch (err) {
            console.error('加载数据失败', err)
        }
    },

    goToQuestion() {
        wx.navigateTo({ url: '/pages/question/question' })
    },

    goToExam() {
        wx.navigateTo({ url: '/pages/exam/exam' })
    },

    goToWrong() {
        wx.navigateTo({ url: '/pages/wrong/wrong' })
    },

    goToNotice() {
        wx.navigateTo({ url: '/pages/notice/notice' })
    },

    goToStudy() {
        wx.navigateTo({ url: '/pages/study/study' })
    },

    goToCourse(e) {
        const id = e.currentTarget.dataset.id
        wx.navigateTo({ url: `/pages/course/course?id=${id}` })
    },

    goToNote() {
        wx.navigateTo({ url: '/pages/note/note' })
    },

    goToAI() {
        wx.navigateTo({ url: '/pages/ai/ai' })
    }
})
