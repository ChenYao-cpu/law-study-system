App({
    globalData: {
        userId: null,
        baseUrl: 'http://localhost:8080/api'
    },

    onLaunch() {
        const userInfo = wx.getStorageSync('userInfo')
        if (userInfo) {
            this.globalData.userId = userInfo.id
        }
    }
})
