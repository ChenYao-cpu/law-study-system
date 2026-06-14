const api = require('../../utils/api.js');

Page({
  data: {
    score: 0,
    notes: []
  },

  onLoad() {
    this.getScore();
    this.loadNotes();
  },

  onShow() {
    this.getScore();
    this.loadNotes();
  },

  getScore() {
    const userInfo = wx.getStorageSync('userInfo');

    if (userInfo) {
      this.setData({
        score: userInfo.totalScore || 0
      });
    }
  },

  // 读取笔记
  loadNotes() {
    const noteList = wx.getStorageSync('noteList') || [];

    this.setData({
      notes: noteList
    });

    console.log('读取笔记：', noteList);
  },

  // 新建笔记
  createNote() {
    wx.navigateTo({
      url: '/pages/note-edit/note-edit'
    });
  },

  // 查看/编辑笔记
  openNote(e) {
    const id = e.currentTarget.dataset.id;

    wx.navigateTo({
      url: `/pages/note-edit/note-edit?id=${id}`
    });
  },

  // 删除笔记
  deleteNote(e) {
    const id = e.currentTarget.dataset.id;

    wx.showModal({
      title: '提示',
      content: '确定删除这篇笔记吗？',

      success: (res) => {
        if (res.confirm) {

          let noteList = wx.getStorageSync('noteList') || [];

          noteList = noteList.filter(item => item.id != id);

          wx.setStorageSync('noteList', noteList);

          this.loadNotes();

          wx.showToast({
            title: '删除成功',
            icon: 'success'
          });
        }
      }
    });
  },

  goBack() {
    wx.reLaunch({
      url: '/pages/index/index'
    });
  }
});