const BASE_URL = 'http://localhost:8080/api'

function request(url, method = 'GET', data = {}) {
    return new Promise((resolve, reject) => {
        wx.request({
            url: `${BASE_URL}${url}`,
            method,
            data,
            header: {
                'Content-Type': 'application/json'
            },
            success: (res) => {
                if (res.statusCode === 200) {
                    resolve(res.data)
                } else {
                    reject(res)
                }
            },
            fail: (err) => {
                wx.showToast({
                    title: '网络请求失败',
                    icon: 'none'
                })
                reject(err)
            }
        })
    })
}

module.exports = { request }
