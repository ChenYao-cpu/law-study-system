const api = require('../../utils/api.js')

Page({
    data: {
        mode: 'create',   // create | edit
        courseId: null,
        form: {
            title: '',
            description: '',
            videoUrl: '',
            cover: '',
            duration: 30,
            category: '必修',
            points: 10
        },
        categoryOptions: ['必修', '民族', '法规', '政策'],
        categoryIndex: 0,
        submitting: false
    },

    goBack() { wx.navigateBack() },

    onLoad(options) {
        if (options.id) {
            this.setData({ mode: 'edit', courseId: options.id })
            this.loadCourse(options.id)
        }
    },

    async loadCourse(id) {
        try {
            const res = await api.getCourseDetail(id)
            if (res && res.data) {
                const c = res.data
                const catIdx = this.data.categoryOptions.indexOf(c.category)
                this.setData({
                    form: {
                        title: c.title || '',
                        description: c.description || '',
                        videoUrl: c.videoUrl || '',
                        cover: c.cover || '',
                        duration: c.duration || 30,
                        category: c.category || '必修',
                        points: c.points || 10
                    },
                    categoryIndex: catIdx >= 0 ? catIdx : 0
                })
            }
        } catch (e) {
            wx.showToast({ title: '加载失败', icon: 'none' })
        }
    },

    onCategoryChange(e) {
        const idx = e.detail.value
        this.setData({
            categoryIndex: idx,
            'form.category': this.data.categoryOptions[idx]
        })
    },

    async onSubmit() {
        const f = this.data.form
        if (!f.title.trim()) {
            wx.showToast({ title: '请输入课程标题', icon: 'none' })
            return
        }
        if (!f.videoUrl.trim()) {
            wx.showToast({ title: '请输入视频链接', icon: 'none' })
            return
        }

        this.setData({ submitting: true })
        try {
            const data = {
                ...f,
                title: f.title.trim(),
                videoUrl: f.videoUrl.trim(),
                cover: f.cover.trim() || 'https://img.alicdn.com/imgextra/i3/O1CN01n2E5kh1sO0k1PZp3g_!!6000000005758-2-tps-800-450.png',
                duration: parseInt(f.duration) || 30,
                points: parseInt(f.points) || 10
            }

            if (this.data.mode === 'edit') {
                await api.updateCourse(this.data.courseId, data)
                wx.showToast({ title: '修改成功，已回到草稿状态', icon: 'none' })
            } else {
                const userInfo = wx.getStorageSync('userInfo')
                data.teacherId = userInfo ? userInfo.id : 1
                const res = await api.createCourse(data)
                if (res && res.data) {
                    this.setData({ mode: 'edit', courseId: res.data.id })
                }
                wx.showToast({ title: '创建成功', icon: 'success' })
            }
            setTimeout(() => wx.navigateBack(), 1500)
        } catch (e) {
            wx.showToast({ title: '保存失败', icon: 'none' })
        } finally {
            this.setData({ submitting: false })
        }
    },

    async submitForReview() {
        if (this.data.mode !== 'edit') {
            wx.showToast({ title: '请先保存课程', icon: 'none' })
            return
        }
        wx.showModal({
            title: '提交审核',
            content: '提交后法务人员将审核此课程，确定吗？',
            success: async (res) => {
                if (res.confirm) {
                    try {
                        await api.submitCourseForReview(this.data.courseId)
                        wx.showToast({ title: '已提交审核', icon: 'success' })
                        setTimeout(() => wx.navigateBack(), 1500)
                    } catch (e) {
                        wx.showToast({ title: '提交失败', icon: 'none' })
                    }
                }
            }
        })
    },

    async deleteCourse() {
        if (this.data.mode !== 'edit') return
        wx.showModal({
            title: '删除课程',
            content: '删除后不可恢复，确定吗？',
            success: async (res) => {
                if (res.confirm) {
                    try {
                        await api.deleteCourse(this.data.courseId)
                        wx.showToast({ title: '已删除', icon: 'success' })
                        setTimeout(() => wx.navigateBack(), 1500)
                    } catch (e) {
                        wx.showToast({ title: '删除失败', icon: 'none' })
                    }
                }
            }
        })
    }
})
