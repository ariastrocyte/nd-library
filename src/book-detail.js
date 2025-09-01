//book-detail.html
const booksData = [
    {
        id: 1,
        title: "创伤与恢复",
        author: "朱迪思·赫尔曼",
        cover: "https://via.placeholder.com/200x300?text=创伤与恢复",
        description: "这是一本关于创伤治疗的权威著作，帮助读者理解和处理心理创伤。作者朱迪思·赫尔曼是创伤研究领域的先驱，她在书中详细阐述了创伤的本质、影响以及恢复的过程。本书不仅提供了理论框架，更重要的是为创伤幸存者及其支持者提供了实用的康复策略。",
        wechatReadLink: "https://weread.qq.com/fake-link-1"
    },
    {
        id: 2,
        title: "身体从未忘记",
        author: "贝塞尔·范德科尔克",
        cover: "https://via.placeholder.com/200x300?text=身体从未忘记",
        description: "探索创伤如何影响身体和大脑，以及如何通过各种治疗方法实现康复。作者通过大量临床案例和科学研究，展示了创伤不仅影响心理，更会在身体中留下印记。书中介绍了多种创新的治疗方法，包括EMDR、瑜伽、戏剧治疗等。",
        wechatReadLink: "https://weread.qq.com/fake-link-2"
    },
    {
        id: 3,
        title: "情绪急救",
        author: "盖伊·温奇",
        cover: "https://via.placeholder.com/200x300?text=情绪急救",
        description: "处理日常情绪问题的实用指南。就像我们会为身体伤口进行急救一样，心理创伤也需要及时的情绪急救。作者提供了针对拒绝、孤独、失败等常见情绪伤害的具体应对策略。",
        wechatReadLink: "https://weread.qq.com/fake-link-3"
    }
];


function initTheme() {
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeToggleDarkIcon = document.getElementById('theme-toggle-dark-icon');
    const themeToggleLightIcon = document.getElementById('theme-toggle-light-icon');

    if (!themeToggleBtn) return;

    if (localStorage.getItem('color-theme') === 'dark' ||
        (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
        if (themeToggleLightIcon) themeToggleLightIcon.classList.remove('hidden');
    } else {
        if (themeToggleDarkIcon) themeToggleDarkIcon.classList.remove('hidden');
    }

    themeToggleBtn.addEventListener('click', function () {
        if (themeToggleDarkIcon) themeToggleDarkIcon.classList.toggle('hidden');
        if (themeToggleLightIcon) themeToggleLightIcon.classList.toggle('hidden');

        if (document.documentElement.classList.contains('dark')) {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('color-theme', 'light');
        } else {
            document.documentElement.classList.add('dark');
            localStorage.setItem('color-theme', 'dark');
        }
    });
}

function initMobileMenu() {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }
}

function checkLoginStatus() {
    const profileLink = document.getElementById('profile-link');
    const currentUser = localStorage.getItem('currentUser');

    if (currentUser) {
        profileLink.textContent = '我的';
        profileLink.href = 'profile.html';
        profileLink.onclick = null;
    } else {
        profileLink.textContent = '点击登录';
        profileLink.href = '#';
        profileLink.onclick = function (e) {
            e.preventDefault();
            window.location.href = 'login.html';
            return false;
        };
    }
}


let currentBook = null;

function loadBookDetail() {
    const urlParams = new URLSearchParams(window.location.search);
    const bookId = parseInt(urlParams.get('id')) || 1;

    currentBook = booksData.find(book => book.id === bookId);

    if (!currentBook) {
        alert('书籍不存在');
        window.location.href = 'index.html';
        return;
    }

    displayBookInfo(currentBook);
    loadComments();
}

function displayBookInfo(book) {
    document.getElementById('book-cover').src = book.cover;
    document.getElementById('book-cover').alt = book.title;
    document.getElementById('book-title').textContent = book.title;
    document.getElementById('book-author').textContent = `作者：${book.author}`;
    document.getElementById('book-description').textContent = book.description;
    document.getElementById('wechat-link').href = book.wechatReadLink;


    document.title = `${book.title} - 心理书评`;
}


function loadComments() {
    const commentsList = document.getElementById('comments-list');
    const commentsCount = document.getElementById('comments-count');

    const allUsers = JSON.parse(localStorage.getItem('users') || '[]');
    let allComments = [];

    allUsers.forEach(user => {
        if (user.comments) {
            const bookComments = user.comments
                .filter(comment => comment.bookId === currentBook.id)
                .map(comment => ({
                    ...comment,
                    username: user.username,
                    avatarColor: user.avatarColor
                }));
            allComments.push(...bookComments);
        }
    });

    allComments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    commentsCount.textContent = `${allComments.length} 条评论`;

    if (allComments.length === 0) {
        commentsList.innerHTML = '<div class="text-center py-8 text-gray-500 dark:text-gray-400">还没有人评论，快来抢沙发吧！</div>';
        return;
    }

    commentsList.innerHTML = allComments.map(comment => `
        <div class="border-b border-gray-200 dark:border-gray-700 pb-4 mb-4 last:border-b-0">
            <div class="flex items-start space-x-3">
                <div class="w-10 h-10 bg-${comment.avatarColor}-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                    ${comment.username.charAt(0).toUpperCase()}
                </div>
                <div class="flex-1 min-w-0">
                    <div class="flex items-center space-x-2 mb-2">
                        <span class="font-semibold text-gray-900 dark:text-white">${comment.username}</span>
                        <span class="text-sm text-gray-500 dark:text-gray-400">${formatDate(comment.createdAt)}</span>
                    </div>
                    <p class="text-gray-700 dark:text-gray-300 leading-relaxed">${comment.content}</p>
                </div>
            </div>
        </div>
    `).join('');
}

function submitComment() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if (!currentUser) {
        alert('请先登录');
        window.location.href = 'login.html';
        return;
    }

    const commentInput = document.getElementById('comment-input');
    const content = commentInput.value.trim();

    if (!content) {
        alert('请输入评论内容');
        return;
    }

    if (content.length > 500) {
        alert('评论内容不能超过500字');
        return;
    }

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex(u => u.id === currentUser.id);

    if (userIndex !== -1) {
        if (!users[userIndex].comments) users[userIndex].comments = [];

        users[userIndex].comments.push({
            id: Date.now(),
            bookId: currentBook.id,
            bookTitle: currentBook.title,
            content: content,
            createdAt: new Date().toISOString()
        });

        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('currentUser', JSON.stringify(users[userIndex]));

        commentInput.value = '';
        loadComments();
        alert('评论发表成功！');
    }
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;

    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return '刚刚';
    if (minutes < 60) return `${minutes}分钟前`;
    if (hours < 24) return `${hours}小时前`;
    if (days < 7) return `${days}天前`;

    return date.toLocaleDateString('zh-CN');
}

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initMobileMenu();
    checkLoginStatus();
    loadBookDetail();

    const submitBtn = document.getElementById('submit-comment');
    if (submitBtn) {
        submitBtn.addEventListener('click', submitComment);
    }
    const commentInput = document.getElementById('comment-input');
    if (commentInput) {
        commentInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                submitComment();
            }
        });
    }
});