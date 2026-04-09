const { request } = require('./request.js')

module.exports = {
    login: (data) => request('/user/login', 'POST', data),
    register: (data) => request('/user/register', 'POST', data),
    getUserInfo: (userId) => request('/user/info', 'GET', { userId }),

    getQuestions: (type, count) => request('/question/random', 'GET', { type, count }),
    checkAnswer: (userId, questionId, userAnswer) =>
        request('/question/check', 'POST', { userId, questionId, userAnswer }),

    getWrongList: (userId) => request('/wrong/list', 'GET', { userId }),
    removeWrong: (userId, questionId) =>
        request('/wrong/remove', 'DELETE', { userId, questionId }),

    startExam: (userId, questionCount) =>
        request('/exam/start', 'POST', { userId, questionCount }),
    submitExam: (examId, userAnswers) =>
        request('/exam/submit', 'POST', { examId, userAnswers }),
    getExamHistory: (userId) => request('/exam/history', 'GET', { userId }),

    getCourseList: (page, size) => request('/course/list', 'GET', { page, size }),
    getCourseDetail: (id) => request(`/course/detail/${id}`),
    getRecommend: () => request('/course/recommend'),

    recordStudy: (data) => request('/study/record', 'POST', data),
    getStudyOverview: (userId) => request('/study/overview', 'GET', { userId }),
    getCourseProgress: (userId) => request('/study/progress', 'GET', { userId }),

    getNotes: (userId, courseId) => request('/note/list', 'GET', { userId, courseId }),
    saveNote: (data) => request('/note/save', 'POST', data),
    deleteNote: (noteId) => request('/note/delete', 'DELETE', { noteId }),

    getNotices: (count) => request('/notice/latest', 'GET', { count }),

    askAI: (userId, question) => request('/ai/ask', 'POST', { userId, question }),
    getChatHistory: (userId) => request('/ai/history', 'GET', { userId })
}
