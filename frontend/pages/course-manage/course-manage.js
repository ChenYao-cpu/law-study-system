const api = require('../../utils/api.js')

Page({
    data: {
        courses: [],
        loading: true,
        statusMap: {
            'draft': '草稿',
            'pending_review': '审核中',
            'approved': '已通过',
            'rejected': '已驳回',
            'published': '已发布'
        },
        statusColor: {
            'draft': '#9CA3AF',
            'pending_review': '#F59E0B',
            'approved': '#10B981',
            'rejected': '#EF4444',
            'published': '#3B82F6'
        }
    },

    onShow() { this.loadData() },

    async loadData() {
        this.setData({ loading: true })
        try {
            const userInfo = wx.getStorageSync('userInfo')
            const res = await api.getTeacherCourses(userInfo ? userInfo.id : 1)
            this.setData({ courses: res.data || [] })
        } catch (e) {
            wx.showToast({ title: '加载失败', icon: 'none' })
        } finally {
            this.setData({ loading: false })
        }
    },

    goCreate() {
        wx.navigateTo({ url: '/pages/course-edit/course-edit' })
    },

    goEdit(e) {
        const id = e.currentTarget.dataset.id
        wx.navigateTo({ url: '/pages/course-edit/course-edit?id=' + id })
    },

    async submitForReview(e) {
        const id = e.currentTarget.dataset.id
        try {
            await api.submitCourseForReview(id)
            wx.showToast({ title: '已提交审核', icon: 'success' })
            this.loadData()
        } catch (e) {
            wx.showToast({ title: '提交失败', icon: 'none' })
        }
    },

    async publishCourse(e) {
        const id = e.currentTarget.dataset.id
        try {
            await api.publishCourse(id)
            wx.showToast({ title: '已发布', icon: 'success' })
            this.loadData()
        } catch (e) {
            wx.showToast({ title: '发布失败', icon: 'none' })
        }
    }
})
