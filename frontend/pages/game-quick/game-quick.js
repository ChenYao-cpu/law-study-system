const questionBank = require('../../utils/question-bank.js')
const { wsManager } = require('../../utils/websocket.js')

Page({
    data: {
        score: 0,
        questions: [],
        currentIndex: 0,
        totalQuestions: 10,
        answered: false,
        selectedAnswer: null,
        correctAnswer: null,
        optionLabels: ['A', 'B', 'C', 'D'],

        showResult: false,
        correctCount: 0,
        wrongCount: 0,

        opponentInfo: null,
        isMatching: false,
        matchSuccess: false,
        isBattleStarted: false,
        countdown: 5,
        matchTime: 0,
        matchTimer: null,

        currentUserAnswerCount: 0,
        currentOpponentAnswerCount: 0,
        userAnswers: [],
        opponentAnswers: [],
        userScore: 0,
        opponentScore: 0,
        isWin: false,
        isDraw: false,

        victoryPoints: 0,
        speedBonus: 0,
        streakBonus: 0,
        newMedals: [],

        battleTime: 0,
        battleTimer: null,
        opponentTimer: null,
        bothFinished: false,

        allMedals: [],
        winReward: 20,
        matchCost: 5,

        battleId: null
    },

    onLoad(options) {
        const userInfo = wx.getStorageSync('userInfo')
        if (!userInfo || !userInfo.id) {
            wx.redirectTo({ url: '/pages/login/login' })
            return
        }

        this.setData({
            score: userInfo.totalScore || 0
        })

        // 从后端同步最新积分
        this.refreshScoreFromServer()
        this.loadAllMedals()

        // 初始化WebSocket连接
        this.initWebSocket(userInfo.id)

        // 注册WebSocket消息处理器
        this.registerWebSocketHandlers()

        // 检查是否是好友邀请
        if (options.battleId && options.invite) {
            console.log('收到好友邀请，battleId:', options.battleId)

            this.setData({
                isInvited: true,
                battleId: options.battleId,
                fromUserId: options.fromUserId
            })

            wx.showModal({
                title: '好友邀请',
                content: '好友邀请你进行法条对战，接受挑战吗？',
                confirmText: '接受挑战',
                cancelText: '拒绝',
                success: (res) => {
                    if (res.confirm) {
                        console.log('接受好友邀请，开始匹配')
                        this.startMatching({ currentTarget: { dataset: { type: 'invite' } } })
                    } else {
                        wx.navigateBack()
                    }
                }
            })
        }
    },

    async refreshScoreFromServer() {
        const userInfo = wx.getStorageSync('userInfo')
        if (!userInfo || !userInfo.id) return
        try {
            const api = require('../../utils/api.js')
            const res = await api.getUserInfo(userInfo.id)
            if (res.code === 200 && res.data) {
                const fresh = { ...userInfo, totalScore: res.data.totalScore || 0 }
                wx.setStorageSync('userInfo', fresh)
                this.setData({ score: fresh.totalScore || 0 })
            }
        } catch (e) {}
    },

    onShow() {
    },

    onUnload() {
        if (this.data.countdownTimer) clearInterval(this.data.countdownTimer)
        if (this.data.battleTimer) clearInterval(this.data.battleTimer)
        if (this.data.opponentTimer) clearInterval(this.data.opponentTimer)
        if (this.data.matchTimer) clearInterval(this.data.matchTimer)

        // 不断开WebSocket，因为其他页面可能还需要
    },

    onShareAppMessage() {
        const userInfo = wx.getStorageSync('userInfo')
        const battleId = 'battle_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)

        return {
            title: '来和我进行法条对战吧！',
            path: '/pages/game-quick/game-quick?battleId=' + battleId + '&invite=1&fromUserId=' + (userInfo.id || ''),
            imageUrl: '/images/logo-smu.png'
        }
    },

    // 初始化WebSocket
    initWebSocket(userId) {
        wsManager.connect(userId).then(() => {
            console.log('WebSocket连接成功')
        }).catch(err => {
            console.error('WebSocket连接失败，降级为AI对战模式:', err)
            // 如果连接失败，可以在这里提示用户
            wx.showToast({
                title: '网络对战不可用，将使用AI对战',
                icon: 'none',
                duration: 2000
            })
        })
    },

    // 注册WebSocket消息处理器
    registerWebSocketHandlers() {
        // 匹配成功
        wsManager.on('MATCH_SUCCESS', (data) => {
            console.log('匹配成功:', data)
            clearInterval(this.data.matchTimer)

            this.setData({
                opponentInfo: data.opponent,
                matchSuccess: true,
                isBattleStarted: false,
                countdown: 5,
                questions: data.questions,
                battleId: data.battleId
            })

            wx.hideLoading()
            this.startCountdown()
        })

        // 匹配中状态
        wsManager.on('MATCH_STATUS', (data) => {
            console.log('匹配状态:', data)
        })

        // 对手答题
        wsManager.on('OPPONENT_ANSWER', (data) => {
            console.log('对手答题:', data)
            const { questionIndex, answerIndex, isCorrect } = data

            const opponentAnswers = [...this.data.opponentAnswers]
            opponentAnswers[questionIndex] = {
                questionIndex: questionIndex,
                answerIndex: answerIndex,
                isCorrect: isCorrect
            }

            const opponentScore = opponentAnswers.filter(a => a && a.isCorrect).length

            this.setData({
                opponentAnswers: opponentAnswers,
                currentOpponentAnswerCount: questionIndex + 1,
                opponentScore: opponentScore
            })

            this.checkBothFinished()
        })

        // 对手完成
        wsManager.on('OPPONENT_FINISHED', (data) => {
            console.log('对手已完成')
        })

        // 对战结束
        wsManager.on('BATTLE_FINISHED', (data) => {
            console.log('对战结束:', data)
            this.showBattleResult(data)
        })
    },

    loadAllMedals() {
        const allMedals = [
            {
                code: 'battle_master',
                name: '对战王者',
                desc: '对战答题正确率80%以上',
                iconClass: 'icon-jifen1',
                condition: (correctCount) => correctCount >= 8
            },
            {
                code: 'battle_expert',
                name: '法条精英',
                desc: '对战答题正确率60%以上',
                iconClass: 'icon-fatiao1',
                condition: (correctCount) => correctCount >= 6
            },
            {
                code: 'speed_champion',
                name: '极速冠军',
                desc: '30秒内完成10题对战',
                iconClass: 'icon-shandianxia',
                condition: (correctCount, battleTime) => battleTime <= 30
            },
            {
                code: 'perfect_score',
                name: '满分达人',
                desc: '对战10题全对',
                iconClass: 'icon-star-ai',
                condition: (correctCount) => correctCount === 10
            },
            {
                code: 'comeback_king',
                name: '逆袭之王',
                desc: '答对7题且战胜对手',
                iconClass: 'icon-darenrenzheng',
                condition: (correctCount, isWin) => correctCount >= 7 && isWin
            }
        ]

        this.setData({ allMedals })
    },

    startMatching(e) {
        const type = e ? e.currentTarget.dataset.type : 'random'

        console.log('开始匹配，类型:', type)

        this.setData({ isMatching: true, matchTime: 0 })

        wx.showLoading({ title: '匹配中...' })

        this.setData({
            matchTimer: setInterval(() => {
                const matchTime = this.data.matchTime + 1
                if (matchTime > 9) {
                    clearInterval(this.data.matchTimer)
                }
                this.setData({ matchTime })
            }, 1000)
        })

        // 通过WebSocket发送匹配请求

            console.log('使用WebSocket进行真实玩家匹配')
            wsManager.startMatching()
    },


    cancelMatching() {
        console.log('取消匹配，返回大厅')

        // 通过WebSocket取消匹配
        if (wsManager.isConnected) {
            wsManager.cancelMatching()
        }

        /* 清除所有计时器 */
        if (this.data.matchTimer) {
            clearInterval(this.data.matchTimer)
        }
        if (this.data.countdownTimer) {
            clearInterval(this.data.countdownTimer)
        }
        if (this.data.battleTimer) {
            clearInterval(this.data.battleTimer)
        }
        if (this.data.opponentTimer) {
            clearInterval(this.data.opponentTimer)
        }

        /* 返回匹配大厅 */
        this.setData({
            isMatching: false,
            matchSuccess: false,
            isBattleStarted: false,
            showResult: false,
            matchTime: 0,
            countdown: 5,
            opponentInfo: null,
            questions: [],
            currentIndex: 0,
            userAnswers: [],
            opponentAnswers: [],
            currentUserAnswerCount: 0,
            currentOpponentAnswerCount: 0,
            userScore: 0,
            opponentScore: 0
        })
    },


    startCountdown() {
        if (this.data.countdownTimer) clearInterval(this.data.countdownTimer)

        this.setData({
            countdownTimer: setInterval(() => {
                const countdown = this.data.countdown - 1
                if (countdown <= 0) {
                    clearInterval(this.data.countdownTimer)
                    this.startBattle()
                    return
                }
                this.setData({ countdown })
            }, 1000)
        })
    },

    startBattle() {
        const questions = this.generateQuestions()
        this.setData({
            questions: questions,
            currentIndex: 0,
            correctCount: 0,
            wrongCount: 0,
            answered: false,
            selectedAnswer: null,
            correctAnswer: null,
            showResult: false,
            isBattleStarted: true,
            currentUserAnswerCount: 0,
            currentOpponentAnswerCount: 0,
            userAnswers: new Array(questions.length).fill(null),
            opponentAnswers: [],
            userScore: 0,
            opponentScore: 0,
            isWin: false,
            isDraw: false,
            victoryPoints: 0,
            speedBonus: 0,
            streakBonus: 0,
            newMedals: [],
            battleTime: 0,
            bothFinished: false
        })

        if (this.data.battleTimer) clearInterval(this.data.battleTimer)
        this.setData({
            battleTimer: setInterval(() => {
                this.setData({
                    battleTime: this.data.battleTime + 1
                })
            }, 1000)
        })

        console.log('开始对战，等待WebSocket消息同步对手状态')

    },

    checkBothFinished() {
        const userFinished = this.data.userAnswers.filter(a => a !== null).length >= this.data.totalQuestions
        const opponentFinished = this.data.currentOpponentAnswerCount >= this.data.totalQuestions

        if (userFinished && opponentFinished && !this.data.bothFinished) {
            this.setData({ bothFinished: true })

            setTimeout(() => {
                this.showFinalResult()
            }, 500)
        }
    },

    generateQuestions() {
        const allQuestions = questionBank.single
        const shuffled = [...allQuestions].sort(() => Math.random() - 0.5)
        const selected = shuffled.slice(0, this.data.totalQuestions)

        return selected.map((q, index) => {
            const correctIndex = q.options.findIndex(opt => {
                const letter = opt.charAt(0)
                return letter === q.answer
            })

            return {
                id: index,
                content: q.question,
                options: q.options,
                correctIndex: correctIndex,
                analysis: q.analysis
            }
        })
    },

    selectAnswer(e) {
        const index = e.currentTarget.dataset.index
        const question = this.data.questions[this.data.currentIndex]
        const isCorrect = (index === question.correctIndex)

        const answerRecord = {
            questionIndex: this.data.currentIndex,
            questionContent: question.content,
            userAnswer: index,
            correctAnswer: question.correctIndex,
            isCorrect: isCorrect,
            userAnswerText: question.options[index],
            correctAnswerText: question.options[question.correctIndex]
        }

        const userAnswers = [...this.data.userAnswers]

        /* 如果之前已经回答过这道题，需要减少之前的计分 */
        if (userAnswers[this.data.currentIndex] !== null) {
            const previousAnswer = userAnswers[this.data.currentIndex]
            if (previousAnswer.isCorrect) {
                this.setData({
                    correctCount: this.data.correctCount - 1
                })
            } else {
                this.setData({
                    wrongCount: this.data.wrongCount - 1
                })
            }
        }

        userAnswers[this.data.currentIndex] = answerRecord

        const answeredCount = userAnswers.filter(a => a !== null).length

        this.setData({
            answered: true,
            selectedAnswer: index,
            correctAnswer: question.correctIndex,
            correctCount: isCorrect ? this.data.correctCount + 1 : this.data.correctCount,
            wrongCount: isCorrect ? this.data.wrongCount : this.data.wrongCount + 1,
            currentUserAnswerCount: answeredCount,
            userAnswers: userAnswers,
            userScore: isCorrect ? this.data.userScore + 1 : this.data.userScore
        })

        // 通过WebSocket发送答案（如果在对战中）
        if (wsManager.isConnected && this.data.isBattleStarted) {
            wsManager.submitAnswer(this.data.currentIndex, index)
        }

        this.checkBothFinished()
    },


    prevQuestion() {
        if (this.data.currentIndex > 0) {
            const prevIndex = this.data.currentIndex - 1
            const prevAnswer = this.data.userAnswers[prevIndex]

            this.setData({
                currentIndex: prevIndex,
                answered: prevAnswer !== null,
                selectedAnswer: prevAnswer ? prevAnswer.userAnswer : null,
                correctAnswer: prevAnswer ? prevAnswer.correctAnswer : null
            })
        }
    },

    nextQuestion() {
        if (this.data.currentIndex < this.data.questions.length - 1) {
            const nextIndex = this.data.currentIndex + 1
            const nextAnswer = this.data.userAnswers[nextIndex]

            this.setData({
                currentIndex: nextIndex,
                answered: nextAnswer !== null,
                selectedAnswer: nextAnswer ? nextAnswer.userAnswer : null,
                correctAnswer: nextAnswer ? nextAnswer.correctAnswer : null
            })
        }
    },

    showFinalResult() {
        if (this.data.battleTimer) clearInterval(this.data.battleTimer)
        if (this.data.opponentTimer) clearInterval(this.data.opponentTimer)

        const userScore = this.data.correctCount * 10
        const opponentScore = this.data.opponentAnswers.filter(a => a.isCorrect).length * 10

        const isWin = userScore > opponentScore
        const isDraw = userScore === opponentScore

        let victoryPoints = 0
        let speedBonus = 0
        let streakBonus = 0
        let newMedals = []

        if (isWin) {
            victoryPoints = 5
            speedBonus = Math.floor(Math.random() * 3) + 1
            streakBonus = Math.floor(Math.random() * 2)
        }

        this.data.allMedals.forEach(medal => {
            if (medal.condition(this.data.correctCount, this.data.battleTime, isWin)) {
                newMedals.push({
                    code: medal.code,
                    name: medal.name,
                    iconClass: medal.iconClass
                })
            }
        })

        const totalPoints = victoryPoints + speedBonus + streakBonus

        let newScore = this.data.score + totalPoints

        const userInfo = wx.getStorageSync('userInfo')
        if (userInfo) {
            userInfo.totalScore = newScore
            wx.setStorageSync('userInfo', userInfo)
        }

        this.setData({
            showResult: true,
            userScore: userScore,
            opponentScore: opponentScore,
            isWin: isWin,
            isDraw: isDraw,
            victoryPoints: victoryPoints,
            speedBonus: speedBonus,
            streakBonus: streakBonus,
            newMedals: newMedals,
            score: newScore
        })
    },

    goBack() {
        if (this.data.battleTimer) clearInterval(this.data.battleTimer)
        if (this.data.opponentTimer) clearInterval(this.data.opponentTimer)
        if (this.data.matchTimer) clearInterval(this.data.matchTimer)
        wx.navigateBack()
    },

    restartBattle() {
        this.setData({
            showResult: false,
            isBattleStarted: false,
            matchSuccess: false,
            opponentInfo: null
        })
        this.startMatching()
    },

    backToHall() {
        this.setData({
            showResult: false,
            isBattleStarted: false,
            matchSuccess: false,
            opponentInfo: null,
            isMatching: false
        })
    }
})
