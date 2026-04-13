App({
    onLaunch() {
        const userInfo = wx.getStorageSync('userInfo')
        if (userInfo) {
            this.globalData.userInfo = userInfo
        }
    },
    globalData: {
        userInfo: null,
        baseUrl: 'http://localhost:8080/api'
    }
})
