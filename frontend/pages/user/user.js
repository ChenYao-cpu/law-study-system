const api = require('../../utils/api.js')

Page({
  data: {
    isLogin: false,
    userInfo: {},
    identityRoles: [],
    isAdmin: false,
    score: 0,
    treeImg: '/images/tree/tree1.png',
    treeLevel: 1,
    treeExp: 0,
    treeMaxExp: 100,
    isGrowing: false,
    watering: false
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 2 })
    }
    this.checkLoginStatus()
    this.loadTreeData()
  },

  checkLoginStatus() {
    const userInfo = wx.getStorageSync('userInfo')
    if (userInfo && userInfo.id) {
      // 解析 identity JSON 字段
      let identityRoles = []
      if (userInfo.identity) {
        try {
          const identityObj = typeof userInfo.identity === 'string'
            ? JSON.parse(userInfo.identity)
            : userInfo.identity
          if (identityObj.party_member) identityRoles.push({ key: 'party_member', label: '党员' })
          if (identityObj.admin) identityRoles.push({ key: 'admin', label: '管理员' })
          if (identityObj.legal_officer) identityRoles.push({ key: 'legal_officer', label: '法务人员' })
        } catch (e) {
          // identity 解析失败时用 role 兜底
          if (userInfo.role === 'admin' || userInfo.role === 'teacher') {
            identityRoles.push({ key: 'admin', label: '管理员' })
          } else if (userInfo.role === 'legal_officer') {
            identityRoles.push({ key: 'legal_officer', label: '法务人员' })
          } else {
            identityRoles.push({ key: 'party_member', label: '党员' })
          }
        }
      } else {
        // 没有 identity 字段时用 role 兜底
        if (userInfo.role === 'admin' || userInfo.role === 'teacher') {
          identityRoles.push({ key: 'admin', label: '管理员' })
          identityRoles.push({ key: 'party_member', label: '党员' })
        } else if (userInfo.role === 'legal_officer') {
          identityRoles.push({ key: 'legal_officer', label: '法务人员' })
        } else {
          identityRoles.push({ key: 'party_member', label: '党员' })
        }
      }

      // 是否拥有管理员身份
      const isAdmin = identityRoles.some(r => r.key === 'admin')

      this.setData({
        isLogin: true,
        userInfo: userInfo,
        identityRoles: identityRoles,
        isAdmin: isAdmin,
        score: userInfo.totalScore || 0
      })
    } else {
      this.setData({ isLogin: false, identityRoles: [] })
    }
  },

  loadTreeData() {
    const treeData = wx.getStorageSync('treeData')
    if (treeData) {
      this.setData({
        treeLevel: treeData.level || 1,
        treeExp: treeData.exp || 0,
        treeMaxExp: treeData.maxExp || 100
      })
    }
  },

  goToLogin() {
    wx.navigateTo({ url: '/pages/login/login' })
  },

  switchToAdmin() {
    wx.reLaunch({ url: '/pages/teacher-home/teacher-home' })
  },

  navTo(e) {
    const url = e.currentTarget.dataset.url
    if (url) {
      wx.navigateTo({ url })
    }
  },

  feedTree() {
    if (this.data.watering) return

    const userInfo = wx.getStorageSync('userInfo')
    if (!userInfo || userInfo.totalScore < 10) {
      wx.showToast({ title: '积分不足', icon: 'none' })
      return
    }

    this.setData({ watering: true })

    setTimeout(() => {
      // 扣除积分
      userInfo.totalScore -= 10
      wx.setStorageSync('userInfo', userInfo)

      // 增加树的经验值
      let newExp = this.data.treeExp + 20
      let newLevel = this.data.treeLevel
      let newMaxExp = this.data.treeMaxExp

      // 升级逻辑（10级为最高级）
      if (newExp >= newMaxExp && newLevel < 10) {
        newExp = 0
        newLevel += 1
        newMaxExp = Math.floor(newMaxExp * 1.5)
        wx.showToast({ title: `恭喜升级到${newLevel}级！`, icon: 'success' })
      } else if (newLevel >= 10) {
        // 已满级，只增加经验但不升级
        newExp = Math.min(newExp, newMaxExp)
        wx.showToast({ title: '已达到最高等级！', icon: 'success' })
      } else {
        wx.showToast({ title: '浇灌成功！', icon: 'success' })
      }

      // 保存知识树数据
      wx.setStorageSync('treeData', {
        level: newLevel,
        exp: newExp,
        maxExp: newMaxExp
      })

      this.setData({
        isGrowing: true,
        treeExp: newExp,
        treeLevel: newLevel,
        treeMaxExp: newMaxExp,
        watering: false,
        userInfo: userInfo
      })

      setTimeout(() => {
        this.setData({ isGrowing: false })
      }, 500)
    }, 1000)
  },

  logout() {
    wx.showModal({
      title: '提示',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          wx.removeStorageSync('userInfo')
          wx.removeStorageSync('treeData')
          this.setData({
            isLogin: false,
            userInfo: {},
            score: 0,
            treeLevel: 1,
            treeExp: 0,
            treeMaxExp: 100
          })
          wx.showToast({ title: '已退出登录', icon: 'success' })
        }
      }
    })
  }
})
