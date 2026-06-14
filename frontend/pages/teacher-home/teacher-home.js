const api = require('../../utils/api.js')

Page({
    data: {
        userInfo: null,
        currentDate: ''
    },

    onLoad() {
        console.log('=== teacher-home onLoad 被调用 ===')
        const userInfo = wx.getStorageSync('userInfo')
        console.log('storage userInfo:', JSON.stringify(userInfo))

        // 接受 admin 或 teacher 角色
        if (!userInfo || (userInfo.role !== 'teacher' && userInfo.role !== 'admin')) {
            wx.redirectTo({ url: '/pages/login/login' })
            return
        }

        this.setData({ userInfo })
        this.setCurrentDate()
    },

    onShow() {
        console.log('=== teacher-home onShow 被调用 ===')
        const userInfo = wx.getStorageSync('userInfo')
        if (userInfo) {
            this.setData({ userInfo })
        }
    },

    setCurrentDate() {
        const now = new Date()
        const year = now.getFullYear()
        const month = now.getMonth() + 1
        const day = now.getDate()
        const weekDays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
        const weekDay = weekDays[now.getDay()]

        this.setData({
            currentDate: `${year}年${month}月${day}日 ${weekDay}`
        })
    },

    goBack() {
        wx.navigateTo({ url: '/pages/login/login' })
    },

    // 切换到党员学习端
    switchToParty() {
        wx.switchTab({
            url: '/pages/index/index',
            fail: () => {
                wx.showToast({ title: '切换失败', icon: 'none' })
            }
        })
    },

    goPage(e) {
        const url = e.currentTarget.dataset.url
        wx.navigateTo({
            url: url,
            fail: (err) => {
                console.error('跳转失败:', err)
                wx.showToast({ title: '页面跳转失败: ' + JSON.stringify(err), icon: 'none' })
            }
        })
    }
})
