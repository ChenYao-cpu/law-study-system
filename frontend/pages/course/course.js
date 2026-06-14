const api = require('../../utils/api.js');

Page({
    data: {
        categories: [
            { id: -1, name: '全部' },
            { id: 0, name: '序言' },
            { id: 1, name: '第一章' },
            { id: 2, name: '第二章' },
            { id: 3, name: '第三章' },
            { id: 4, name: '第四章' },
            { id: 5, name: '第五章' },
            { id: 6, name: '第六章' },
            { id: 7, name: '第七章' }
        ],
        currentCategory: -1,
        courses: [],
        filteredCourses: [],
        currentCourse: null,
        score: 0,
        canDrag: false,
        isFirstWatch: true,
        videoContext: null,
        videoDuration: 0,
        saveTimer: null,
        currentProgress: 0
    },

    onLoad() {
        this.getScore();
        this.loadCourses();
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

    loadCourses() {
        const courses = [
            { id: 1, title: '序言', chapter: 0, cover: '/images/course-covers/preface.png', videoUrl: 'https://mycoursevideos-1436507439.cos.ap-chengdu.myqcloud.com/%E5%BA%8F%E8%A8%80.mp4', duration: '03:46', points: 10, progress: 0, watched: false },
            { id: 2, title: '第一章 总则', chapter: 1, cover: '/images/course-covers/p1.png', videoUrl: 'https://mycoursevideos-1436507439.cos.ap-chengdu.myqcloud.com/%E7%AC%AC%E4%B8%80%E7%AB%A0.mp4', duration: '05:46', points: 15, progress: 0, watched: false },
            { id: 3, title: '第二章 民族团结', chapter: 2, cover: '/images/course-covers/p2.png', videoUrl: 'https://mycoursevideos-1436507439.cos.ap-chengdu.myqcloud.com/%E7%AC%AC%E4%BA%8C%E7%AB%A0.mp4', duration: '06:37', points: 15, progress: 0, watched: false },
            { id: 4, title: '第三章 文化传承', chapter: 3, cover: '/images/course-covers/p3.png', videoUrl: 'https://mycoursevideos-1436507439.cos.ap-chengdu.myqcloud.com/%E7%AC%AC%E4%B8%89%E7%AB%A0.mp4', duration: '05:37', points: 15, progress: 0, watched: false },
            { id: 5, title: '第四章 经济发展', chapter: 4, cover: '/images/course-covers/p4.png', videoUrl: 'https://mycoursevideos-1436507439.cos.ap-chengdu.myqcloud.com/%E7%AC%AC%E5%9B%9B%E7%AB%A0.mp4', duration: '04:48', points: 15, progress: 0, watched: false },
            { id: 6, title: '第五章 社会保障', chapter: 5, cover: '/images/course-covers/p5.png', videoUrl: 'https://mycoursevideos-1436507439.cos.ap-chengdu.myqcloud.com/%E7%AC%AC%E4%BA%94%E7%AB%A0.mp4', duration: '07:18', points: 15, progress: 0, watched: false },
            { id: 7, title: '第六章 法律责任', chapter: 6, cover: '/images/course-covers/p6.png', videoUrl: 'https://mycoursevideos-1436507439.cos.ap-chengdu.myqcloud.com/%E7%AC%AC%E5%85%AD%E7%AB%A0.mp4', duration: '04:17', points: 15, progress: 0, watched: false },
            { id: 8, title: '第七章 附则', chapter: 7, cover: '/images/course-covers/p7.png', videoUrl: 'https://mycoursevideos-1436507439.cos.ap-chengdu.myqcloud.com/%E7%AC%AC%E4%B8%83%E7%AB%A0.mp4', duration: '02:36', points: 15, progress: 0, watched: false }
        ];

        const progressData = wx.getStorageSync('courseProgress') || {};
        if (progressData.progress) {
            courses.forEach(course => {
                const saved = progressData.progress[course.id];
                if (saved) {
                    course.progress = saved.progress || 0;
                    course.watched = saved.watched || false;
                }
            });
        }

        this.setData({ courses: courses, filteredCourses: courses });
    },

    selectCategory(e) {
        const categoryId = e.currentTarget.dataset.id;
        this.setData({ currentCategory: categoryId });

        if (categoryId === -1) {
            this.setData({ filteredCourses: this.data.courses });
        } else {
            const filtered = this.data.courses.filter(course => course.chapter === categoryId);
            this.setData({ filteredCourses: filtered });
        }
    },

    playCourse(e) {
        const course = e.currentTarget.dataset.course;
        const savedProgress = this.getSavedProgress(course.id);

        this.setData({
            currentCourse: {
                ...course,
                progress: savedProgress.progress || 0,
                watched: savedProgress.watched || false
            },
            canDrag: savedProgress.watched || false,
            isFirstWatch: !savedProgress.watched,
            currentProgress: savedProgress.progress || 0
        });

        setTimeout(() => {
            this.videoContext = wx.createVideoContext('courseVideo', this);
        }, 100);
    },

    // 返回上一级
    goBack() {
        if (this.videoContext) {
            this.videoContext.pause();
        }

        if (this.saveTimer) {
            clearTimeout(this.saveTimer);
        }

        if (this.data.currentCourse) {
            this.setData({ currentCourse: null });
        } else {
            wx.reLaunch({
                url: '/pages/index/index'
            });
        }
    },

    // ✅ 新增：点击退出/返回首页的方法
    goHome() {
        if (this.videoContext) {
            this.videoContext.pause();
        }
        if (this.saveTimer) {
            clearTimeout(this.saveTimer);
        }
        // 直接返回首页
        wx.reLaunch({
            url: '/pages/index/index'
        });
    },

    videoPlay() {
        const savedProgress = this.getSavedProgress(this.data.currentCourse.id);
        if (savedProgress.currentTime > 0 && this.videoContext) {
            this.videoContext.seek(savedProgress.currentTime);
        }
    },

    videoPause() {
        if (this.data.currentCourse) {
            this.saveProgress(
                this.data.currentCourse.id,
                this.data.currentProgress / 100 * this.videoDuration,
                this.videoDuration,
                this.data.currentCourse.watched
            );
        }
    },

    videoTimeUpdate(e) {
        const currentTime = e.detail.currentTime;
        const duration = e.detail.duration;

        if (duration > 0) {
            this.videoDuration = duration;
            const progress = Math.floor((currentTime / duration) * 100);
            this.setData({ currentProgress: progress });

            if (duration > 0 && currentTime / duration > 0.5) {
                this.setData({ canDrag: true });
            }

            if (this.saveTimer) {
                clearTimeout(this.saveTimer);
            }

            this.saveTimer = setTimeout(() => {
                this.saveProgress(
                    this.data.currentCourse.id,
                    currentTime,
                    duration,
                    this.data.currentCourse.watched
                );
            }, 1000);
        }
    },

    videoEndFinish() {
        const courseId = this.data.currentCourse.id;

        if (!this.data.currentCourse.watched) {
            wx.showToast({
                title: `学习完成 +${this.data.currentCourse.points}积分`,
                icon: 'success'
            });

            this.updateCourseStatus(courseId, true);
            this.addScore(this.data.currentCourse.points);

            this.saveProgress(courseId, this.videoDuration, this.videoDuration, true);

            this.setData({
                'currentCourse.watched': true,
                'currentCourse.progress': 100,
                isFirstWatch: false,
                currentProgress: 100
            });
        } else {
            wx.showToast({
                title: '视频播放完成',
                icon: 'none'
            });

            this.saveProgress(courseId, this.videoDuration, this.videoDuration, true);
        }
    },

    videoError(e) {
        console.error('视频加载失败:', e.detail.errMsg);
        wx.showToast({
            title: '视频加载失败',
            icon: 'none'
        });
    },

    getSavedProgress(courseId) {
        const progressData = wx.getStorageSync('courseProgress') || {};
        if (progressData.progress && progressData.progress[courseId]) {
            return progressData.progress[courseId];
        }
        return { currentTime: 0, duration: 0, progress: 0, watched: false };
    },

    saveProgress(courseId, currentTime, duration, watched) {
        const progressData = wx.getStorageSync('courseProgress') || {};
        if (!progressData.progress) {
            progressData.progress = {};
        }

        const progress = duration > 0 ? Math.floor((currentTime / duration) * 100) : 0;

        progressData.progress[courseId] = {
            currentTime: currentTime,
            duration: duration,
            progress: progress,
            watched: watched,
            lastWatchTime: new Date().getTime()
        };

        wx.setStorageSync('courseProgress', progressData);
    },

    updateCourseStatus(courseId, watched) {
        const courses = this.data.courses.map(course => {
            if (course.id === courseId) {
                return { ...course, watched: watched, progress: 100 };
            }
            return course;
        });

        this.setData({ courses: courses });
    },

    addScore(points) {
        const userInfo = wx.getStorageSync('userInfo');
        if (userInfo) {
            userInfo.totalScore = (userInfo.totalScore || 0) + points;
            wx.setStorageSync('userInfo', userInfo);
            this.setData({ score: userInfo.totalScore });
        }
    },

    onUnload() {
        if (this.videoContext) {
            this.videoContext.pause();
        }

        if (this.saveTimer) {
            clearTimeout(this.saveTimer);
        }
    }
});