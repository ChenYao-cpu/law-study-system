const api = require('../../utils/api.js')

Page({
  data: {
    notes: [],
    showEdit: false,
    editNote: null,
    title: '',
    content: ''
  },

  onLoad() {
    this.loadNotes()
  },

  async loadNotes() {
    const userInfo = wx.getStorageSync('userInfo')

    try {
      const res = await api.getNotes(userInfo.id)
      this.setData({ notes: res.data || [] })
    } catch (err) {
      wx.showToast({ title: '加载失败', icon: 'none' })
    }
  },

  showAddNote() {
    this.setData({
      showEdit: true,
      editNote: null,
      title: '',
      content: ''
    })
  },

  showEditNote(e) {
    const note = e.currentTarget.dataset.note
    this.setData({
      showEdit: true,
      editNote: note,
      title: note.title,
      content: note.content
    })
  },

  hideEdit() {
    this.setData({ showEdit: false })
  },

  onTitleInput(e) {
    this.setData({ title: e.detail.value })
  },

  onContentInput(e) {
    this.setData({ content: e.detail.value })
  },

  async saveNote() {
    if (!this.data.title || !this.data.content) {
      wx.showToast({ title: '请填写标题和内容', icon: 'none' })
      return
    }

    const userInfo = wx.getStorageSync('userInfo')
    const noteData = {
      userId: userInfo.id,
      title: this.data.title,
      content: this.data.content
    }

    if (this.data.editNote) {
      noteData.id = this.data.editNote.id
    }

    try {
      await api.saveNote(noteData)
      wx.showToast({ title: '保存成功', icon: 'success' })
      this.hideEdit()
      this.loadNotes()
    } catch (err) {
      wx.showToast({ title: '保存失败', icon: 'none' })
    }
  },

  async deleteNote(e) {
    const noteId = e.currentTarget.dataset.id

    wx.showModal({
      title: '确认删除',
      content: '确定要删除这条笔记吗？',
      success: async (res) => {
        if (res.confirm) {
          try {
            await api.deleteNote(noteId)
            wx.showToast({ title: '删除成功', icon: 'success' })
            this.loadNotes()
          } catch (err) {
            wx.showToast({ title: '删除失败', icon: 'none' })
          }
        }
      }
    })
  }
})
