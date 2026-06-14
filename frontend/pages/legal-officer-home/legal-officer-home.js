const api = require('../../utils/api.js')

Page({
    data: {
        userInfo: null,
        currentDate: '',
        pendingReviews: [],
        reviewHistory: [],
        pendingCourseReviews: [],
        activeTab: 'pending'
    },

    onLoad() {
        const userInfo = wx.getStorageSync('userInfo')
        if (!userInfo || userInfo.role !== 'legal_officer') {
            wx.redirectTo({ url: '/pages/login/login' })
            return
        }

        this.setData({ userInfo })
        this.setCurrentDate()
        this.loadData()
    },

    onShow() {
        this.loadData()
    },

    setCurrentDate() {
        const now = new Date()
        const year = now.getFullYear()
        const month = now.getMonth() + 1
        const day = now.getDate()
        const weekDays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
        const weekDay = weekDays[now.getDay()]
        this.setData({ currentDate: `${year}年${month}月${day}日 ${weekDay}` })
    },

    goBack() {
        wx.navigateTo({ url: '/pages/login/login' })
    },

    switchTab(e) {
        const tab = e.currentTarget.dataset.tab
        this.setData({ activeTab: tab })
    },

    async loadData() {
        wx.showLoading({ title: '加载中...' })
        try {
            const pendingRes = await api.getPendingReviews()
            if (pendingRes.code === 200) {
                this.setData({ pendingReviews: pendingRes.data || [] })
            } else {
                console.error('获取待审核列表失败:', pendingRes.msg)
            }
        } catch (err) {
            console.error('加载待审核列表失败:', err)
            wx.showToast({ title: '网络错误，请检查后端是否启动', icon: 'none' })
        }

        try {
            const historyRes = await api.getReviewHistory()
            if (historyRes.code === 200) {
                this.setData({ reviewHistory: historyRes.data || [] })
            }
        } catch (err) {
            console.error('加载审核历史失败:', err)
        }

        // 加载待审核课程
        try {
            const courseRes = await api.getPendingCourseReviews()
            if (courseRes.code === 200) {
                this.setData({ pendingCourseReviews: courseRes.data || [] })
            }
        } catch (err) {
            console.error('加载课程审核列表失败:', err)
        }

        wx.hideLoading()
    },

    async approveCourse(e) {
        const id = e.currentTarget.dataset.id
        wx.showModal({
            title: '审核通过',
            content: '通过后课程将自动发布，确定吗？',
            success: async (res) => {
                if (res.confirm) {
                    try {
                        await api.approveCourse(id, { comment: '审核通过' })
                        wx.showToast({ title: '已通过并发布', icon: 'success' })
                        this.loadData()
                    } catch (err) {
                        wx.showToast({ title: '操作失败', icon: 'none' })
                    }
                }
            }
        })
    },

    rejectCourse(e) {
        const id = e.currentTarget.dataset.id
        wx.showModal({
            title: '驳回课程',
            editable: true,
            placeholderText: '请填写驳回理由',
            success: async (res) => {
                if (res.confirm && res.content) {
                    try {
                        await api.rejectCourse(id, { comment: res.content })
                        wx.showToast({ title: '已驳回', icon: 'success' })
                        this.loadData()
                    } catch (err) {
                        wx.showToast({ title: '操作失败', icon: 'none' })
                    }
                }
            }
        })
    },

    goReview(e) {
        const id = e.currentTarget.dataset.id
        wx.navigateTo({
            url: `/pages/legal-review/legal-review?id=${id}`,
            fail: (err) => {
                console.error('跳转失败:', err)
                wx.showToast({ title: '页面跳转失败', icon: 'none' })
            }
        })
    }
})
