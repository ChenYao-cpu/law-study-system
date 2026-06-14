const { BASE_URL } = require('./config.js')

function request(url, method = 'GET', data = {}, header = {}) {
    return new Promise((resolve, reject) => {
        console.log('================= API 请求 =================')
        console.log('请求URL:', `${BASE_URL}${url}`)
        console.log('请求方法:', method)
        console.log('请求数据:', data)

        wx.request({
            url: `${BASE_URL}${url}`,
            method,
            data,
            timeout: 30000,  // 30秒超时（AI回答需要时间）
            header: {
                'Content-Type': 'application/json',
                ...header
            },
            success: (res) => {
                console.log('================= API 响应 =================')
                console.log('statusCode:', res.statusCode)
                console.log('返回数据:', res.data)

                // 尝试解析响应，即使 HTTP 状态码不是 200
                if (res.statusCode === 200) {
                    resolve(res.data)
                } else if (res.statusCode === 500 && res.data && res.data.msg) {
                    // 后端返回了业务错误（Result.error），仍然 resolve 让调用方处理
                    resolve(res.data)
                } else {
                    console.error('请求失败，statusCode:', res.statusCode)
                    reject(new Error('服务器响应异常: ' + res.statusCode))
                }
            },
            fail: (err) => {
                console.error('================= 网络请求失败 =================')
                console.error('错误信息:', err)

                // 不在这里弹 modal，让调用方自行处理错误展示
                reject(err)
            }
        })
    })
}

module.exports = { request }
