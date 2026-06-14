const api = require('../../utils/api.js');

Page({

  data: {
    score: 0,
    noteId: null,
    noteTitle: '',
    noteContent: '',
    images: [],
    selectedFont: '微软雅黑',
    selectedFontFamily: '"Microsoft YaHei", sans-serif',
    selectedColor: '#000000',
    showToolbar: false,
    fontList: [
      { name: '宋体', fontFamily: '"SimSun", serif' },
      { name: '黑体', fontFamily: '"SimHei", sans-serif' },
      { name: '楷体', fontFamily: '"KaiTi", serif' },
      { name: '仿宋', fontFamily: '"FangSong", serif' },
      { name: '微软雅黑', fontFamily: '"Microsoft YaHei", sans-serif' }
    ],
    colorList: [
      '#000000',
      '#FF0000',
      '#0000FF',
      '#00AA00',
      '#FF8800',
      '#800080'
    ]
  },

  onLoad(options) {
    this.getScore();

    // 编辑模式
    if (options.id) {
      const noteList = wx.getStorageSync('noteList') || [];
      const note = noteList.find(item => item.id == options.id);

      if (note) {
        this.setData({
          noteId: note.id,
          noteTitle: note.title,
          noteContent: note.content,
          images: note.images || [],
          selectedFont: note.font || '微软雅黑',
          selectedFontFamily: note.fontFamily || '"Microsoft YaHei", sans-serif',
          selectedColor: note.color || '#000000'
        });
      }
    }
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

  // 标题输入
  onTitleInput(e) {
    this.setData({
      noteTitle: e.detail.value
    });
  },

  // 内容输入
  onContentInput(e) {
    this.setData({
      noteContent: e.detail.value
    });
  },

  // 返回
  goBack() {
    wx.navigateBack({
      delta: 1
    });
  },

  // 工具栏
  toggleToolbar() {
    this.setData({
      showToolbar: !this.data.showToolbar
    });
  },
  // 显示字体选择器
  showFontPicker() {
    this.setData({
      showFontModal: true
    });
  },
  // 关闭字体选择器
  closeFontModal() {
    this.setData({
      showFontModal: false
    });
  },

  // 显示颜色选择器
  showColorPicker() {
    this.setData({
      showColorModal: true
    });
  },

  // 关闭颜色选择器
  closeColorModal() {
    this.setData({
      showColorModal: false
    });
  },
  stopPropagation() {
    // 空方法，用于阻止弹窗关闭
  },
  selectFont(e) {
    const fontName = e.currentTarget.dataset.font;
    const fontItem = this.data.fontList.find(item => item.name === fontName);

    if (fontItem) {
      this.setData({
        selectedFont: fontItem.name,
        selectedFontFamily: fontItem.fontFamily
      });
      wx.showToast({
        title: '字体已切换',
        icon: 'success'
      });
    }
  },


  // 选择颜色
  selectColor(e) {
    const color = e.currentTarget.dataset.color;
    this.setData({
      selectedColor: color
    });
    wx.showToast({
      title: '颜色已切换',
      icon: 'success'
    });
  },

  // 添加图片
  addImage() {
    wx.chooseMedia({
      count: 9,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const tempFiles = res.tempFiles.map(item => item.tempFilePath);
        this.setData({
          images: this.data.images.concat(tempFiles)
        });
      }
    });
  },

  // 删除图片
  deleteImage(e) {
    const index = e.currentTarget.dataset.index;
    let images = this.data.images;
    images.splice(index, 1);
    this.setData({
      images
    });
  },

  // 保存笔记
  saveNote() {
    const title = this.data.noteTitle.trim();
    const content = this.data.noteContent.trim();

    if (!title) {
      wx.showToast({
        title: '请输入标题',
        icon: 'none'
      });
      return;
    }

    if (!content) {
      wx.showToast({
        title: '请输入内容',
        icon: 'none'
      });
      return;
    }

    let noteList = wx.getStorageSync('noteList') || [];

    // 编辑
    if (this.data.noteId) {
      noteList = noteList.map(item => {
        if (item.id == this.data.noteId) {
          item.title = title;
          item.content = content;
          item.images = this.data.images;
          item.font = this.data.selectedFont;
          item.fontFamily = this.data.selectedFontFamily;
          item.color = this.data.selectedColor;
        }
        return item;
      });
    } else {
      // 新建
      const newNote = {
        id: Date.now(),
        title: title,
        content: content,
        images: this.data.images,
        font: this.data.selectedFont,
        fontFamily: this.data.selectedFontFamily,
        color: this.data.selectedColor,
        createTime: new Date().toLocaleString()
      };
      noteList.unshift(newNote);
    }

    wx.setStorageSync('noteList', noteList);
    wx.showToast({
      title: '保存成功',
      icon: 'success'
    });

    setTimeout(() => {
      wx.navigateBack({
        delta: 1
      });
    }, 1000);
  }
});
