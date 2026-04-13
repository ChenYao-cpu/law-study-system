const api = require('../../utils/api.js')
const app = getApp()

Page({
    data: {
        username: '',
        password: '',
        isRegister: false
    },

    onUsernameInput(e) {
        this.setData({ username: e.detail.value })
    },

    onPasswordInput(e) {
        this.setData({ password: e.detail.value })
    },

    toggleMode() {
        this.setData({ isRegister: !this.data.isRegister })
    },

    async handleLogin() {
        const { username, password } = this.data

        if (!username || !password) {
            wx.showToast({ title: '请输入用户名和密码', icon: 'none' })
            return
        }

        try {
            const res = await api.login({ username, password })

            if (res.code === 200) {
                wx.setStorageSync('userInfo', res.data)
                app.globalData.userInfo = res.data

                wx.showToast({ title: '登录成功', icon: 'success' })

                setTimeout(() => {
                    wx.switchTab({ url: '/pages/index/index' })
                }, 1500)
            } else {
                wx.showToast({ title: res.msg || '登录失败', icon: 'none' })
            }
        } catch (err) {
            wx.showToast({ title: '网络错误', icon: 'none' })
        }
    },

    async handleRegister() {
        const { username, password } = this.data

        if (!username || !password) {
            wx.showToast({ title: '请输入用户名和密码', icon: 'none' })
            return
        }

        try {
            const res = await api.register({ username, password, nickname: username })

            if (res.code === 200) {
                wx.showToast({ title: '注册成功', icon: 'success' })
                this.setData({ isRegister: false })
            } else {
                wx.showToast({ title: res.msg || '注册失败', icon: 'none' })
            }
        } catch (err) {
            wx.showToast({ title: '网络错误', icon: 'none' })
        }
    },

    handleSubmit() {
        if (this.data.isRegister) {
            this.handleRegister()
        } else {
            this.handleLogin()
        }
    },

    handleWechatLogin() {
        wx.getUserProfile({
            desc: '用于完善用户资料',
            success: (res) => {
                const userInfo = res.userInfo
                wx.login({
                    success: (loginRes) => {
                        this.setData({
                            username: 'wx_' + loginRes.code.substring(0, 10),
                            password: loginRes.code
                        })
                        this.handleLogin()
                    }
                })
            }
        })
    }
})
