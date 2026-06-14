Page({
    data: {
        score: 0,
        id: '',
        title: '',
        date: '',
        content: ''
    },

    onLoad(options) {
        this.setData({
            id: options.id || '',
            title: decodeURIComponent(options.title || ''),
            date: options.date || '',
            content: decodeURIComponent(options.content || '')
        });
        this.getScore();
    },

    onShow() {
        this.getScore();
    },

    getScore() {
        const userInfo = wx.getStorageSync('userInfo');
        if (userInfo) {
            this.setData({
                score: userInfo.totalScore || 0
            });
        }
    },

    goBack() {
        wx.navigateBack();
    }
});
