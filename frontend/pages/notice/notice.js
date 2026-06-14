const api = require('../../utils/api.js');

Page({
    data: {
        score: 0,
        notices: [
            {
                id: 1,
                title: '关于学习民族团结促进法的通知',
                date: '2026-5-25',
                content: '各位同学：\n\n为了深入学习贯彻《民族团结促进法》，提高广大师生的民族团结意识，现就相关学习事项通知如下：\n\n一、学习时间安排\n本学期第1-16周为集中学习期，请各位同学按时完成线上课程学习。\n\n二、学习要求\n1. 完成所有视频课程观看\n2. 参与在线答题练习\n3. 参加期末考试\n\n三、考核标准\n总成绩由平时成绩（40%）和期末成绩（60%）组成。\n\n特此通知。\n\n教务处\n2026年5月25日'
            },
            {
                id: 2,
                title: '第一章学习要点解读',
                date: '2026-5-20',
                content: '第一章：总则\n\n学习要点：\n\n一、立法目的\n为了加强民族团结，促进各民族共同繁荣发展，维护国家统一和社会和谐稳定。\n\n二、基本原则\n1. 坚持民族平等\n2. 坚持民族团结\n3. 坚持民族区域自治\n4. 坚持各民族共同团结奋斗、共同繁荣发展\n\n三、适用范围\n适用于中华人民共和国领域内的民族团结促进工作。\n\n四、政府职责\n各级人民政府应当将民族团结促进工作纳入国民经济和社会发展规划。'
            },
            {
                id: 3,
                title: '学习打卡活动开始啦！',
                date: '2026-5-17',
                content: '亲爱的同学们：\n\n为了鼓励大家积极参与民族团结促进法学习，我们特别推出"每日打卡"活动！\n\n【活动时间】\n2026年5月17日 - 2026年6月17日\n\n【参与方式】\n每天登录学习系统，完成当日学习任务即可打卡成功。\n\n【奖励机制】\n连续打卡7天：获得"学习达人"勋章\n连续打卡30天：获得额外积分奖励\n连续打卡60天：获得精美纪念品\n\n【注意事项】\n1. 每日23:59前完成打卡\n2. 打卡中断需重新开始计算\n3. 最终解释权归活动组织方所有\n\n快来参加吧！\n\n学习系统运营团队\n2026年5月17日'
            }
        ]
    },

    onLoad() {
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
        wx.reLaunch({
            url: '/pages/index/index'
        });
    },

    viewDetail(e) {
        const id = e.currentTarget.dataset.id;
        const notice = this.data.notices.find(item => item.id === id);
        wx.navigateTo({
            url: `/pages/notice-detail/notice-detail?id=${id}&title=${encodeURIComponent(notice.title)}&date=${notice.date}&content=${encodeURIComponent(notice.content)}`
        });
    }
});
