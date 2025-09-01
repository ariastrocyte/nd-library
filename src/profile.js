// profile.html
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

let currentUser = null;

function loadUserProfile() {
    currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if (!currentUser) {
        alert('请先登录');
        window.location.href = 'login.html';
        return;
    }

    displayUserInfo(currentUser);
    loadUserComments();
}

function displayUserInfo(user) {
    const avatar = document.getElementById('user-avatar');
    avatar.className = `w-20 h-20 bg-${user.avatarColor}-500 rounded-full flex items-center justify-center text-white text-2xl font-bold`;
    avatar.textContent = user.username.charAt(0).toUpperCase();

    document.getElementById('user-name').textContent = user.username;
    document.getElementById('user-age').textContent = `年龄：${user.age || '未设置'}`;

    const joinDate = new Date(user.joinDate).toLocaleDateString('zh-CN');
    document.getElementById('user-join-date').textContent = `加入时间：${joinDate}`;
    document.title = `${user.username}的个人中心 - 心理书评`;
}

function loadUserComments() {
    const commentsList = document.getElementById('my-comments-list');
    const commentsCount = document.getElementById('my-comments-count');
    const noComments = document.getElementById('no-comments');

    const userComments = currentUser.comments || [];

    commentsCount.textContent = `${userComments.length} 条评论`;

    if (userComments.length === 0) {
        commentsList.innerHTML = '';
        noComments.classList.remove('hidden');
        return;
    }

    noComments.classList.add('hidden');


    const sortedComments = [...userComments].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    commentsList.innerHTML = sortedComments.map(comment => `
        <div class="border-b border-gray-200 dark:border-gray-700 pb-4 mb-4 last:border-b-0">
            <div class="flex items-start justify-between">
                <div class="flex-1">
                    <div class="flex items-center space-x-2 mb-2">
                        <span class="text-sm font-medium text-blue-600 dark:text-blue-400">《${comment.bookTitle || '未知书籍'}》</span>
                        <span class="text-sm text-gray-500 dark:text-gray-400">${formatDate(comment.createdAt)}</span>
                    </div>
                    <p class="text-gray-700 dark:text-gray-300 leading-relaxed">${comment.content}</p>
                </div>
                <div class="ml-4 flex-shrink-0">
                    <button class="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300" onclick="viewBookDetail(${comment.bookId})">
                        查看书籍
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function viewBookDetail(bookId) {
    window.location.href = `book-detail.html?id=${bookId}`;
}


function showEditModal() {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    modal.innerHTML = `
        <div class="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h3 class="text-xl font-bold mb-4 text-gray-900 dark:text-white">编辑资料</h3>
            <div class="space-y-4">
                <div>
                    <label class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">用户名</label>
                    <input type="text" id="edit-username" value="${currentUser.username}" 
                        class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white">
                </div>
                
                <div>
                    <label class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">年龄</label>
                    <input type="number" id="edit-age" value="${currentUser.age || ''}" min="13" max="120"
                        class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white">
                </div>
                
                <div>
                    <label class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">头像颜色</label>
                    <div class="flex space-x-2">
                        <input type="radio" name="avatar-color" value="blue" id="edit-color-blue" class="hidden" ${currentUser.avatarColor === 'blue' ? 'checked' : ''}>
                        <label for="edit-color-blue" class="w-8 h-8 bg-blue-500 rounded-full cursor-pointer ring-2 ring-offset-2 ${currentUser.avatarColor === 'blue' ? 'ring-blue-500' : 'ring-transparent'} hover:scale-110 transition-transform"></label>
                        
                        <input type="radio" name="avatar-color" value="purple" id="edit-color-purple" class="hidden" ${currentUser.avatarColor === 'purple' ? 'checked' : ''}>
                        <label for="edit-color-purple" class="w-8 h-8 bg-purple-500 rounded-full cursor-pointer ring-2 ring-offset-2 ${currentUser.avatarColor === 'purple' ? 'ring-purple-500' : 'ring-transparent'} hover:scale-110 transition-transform"></label>
                        
                        <input type="radio" name="avatar-color" value="green" id="edit-color-green" class="hidden" ${currentUser.avatarColor === 'green' ? 'checked' : ''}>
                        <label for="edit-color-green" class="w-8 h-8 bg-green-500 rounded-full cursor-pointer ring-2 ring-offset-2 ${currentUser.avatarColor === 'green' ? 'ring-green-500' : 'ring-transparent'} hover:scale-110 transition-transform"></label>
                        
                        <input type="radio" name="avatar-color" value="pink" id="edit-color-pink" class="hidden" ${currentUser.avatarColor === 'pink' ? 'checked' : ''}>
                        <label for="edit-color-pink" class="w-8 h-8 bg-pink-500 rounded-full cursor-pointer ring-2 ring-offset-2 ${currentUser.avatarColor === 'pink' ? 'ring-pink-500' : 'ring-transparent'} hover:scale-110 transition-transform"></label>
                        
                        <input type="radio" name="avatar-color" value="orange" id="edit-color-orange" class="hidden" ${currentUser.avatarColor === 'orange' ? 'checked' : ''}>
                        <label for="edit-color-orange" class="w-8 h-8 bg-orange-500 rounded-full cursor-pointer ring-2 ring-offset-2 ${currentUser.avatarColor === 'orange' ? 'ring-orange-500' : 'ring-transparent'} hover:scale-110 transition-transform"></label>
                    </div>
                </div>
            </div>
            
            <div class="flex space-x-3 mt-6">
                <button id="cancel-edit" class="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300">
                    取消
                </button>
                <button id="save-edit" class="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                    保存
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);


    modal.querySelectorAll('input[name="avatar-color"]').forEach(input => {
        input.addEventListener('change', () => {
            modal.querySelectorAll('label[for^="edit-color-"]').forEach(label => {
                label.classList.remove('ring-blue-500', 'ring-purple-500', 'ring-green-500', 'ring-pink-500', 'ring-orange-500');
                label.classList.add('ring-transparent');
            });
            const selectedLabel = modal.querySelector(`label[for="edit-color-${input.value}"]`);
            selectedLabel.classList.remove('ring-transparent');
            selectedLabel.classList.add(`ring-${input.value}-500`);
        });
    });


    modal.querySelector('#cancel-edit').addEventListener('click', () => {
        document.body.removeChild(modal);
    });


    modal.querySelector('#save-edit').addEventListener('click', () => {
        const newUsername = modal.querySelector('#edit-username').value.trim();
        const newAge = modal.querySelector('#edit-age').value;
        const newAvatarColor = modal.querySelector('input[name="avatar-color"]:checked').value;

        if (!newUsername) {
            alert('用户名不能为空');
            return;
        }

        if (newUsername.length > 20) {
            alert('用户名不能超过20个字符');
            return;
        }

        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const userIndex = users.findIndex(u => u.id === currentUser.id);

        if (userIndex !== -1) {
            users[userIndex].username = newUsername;
            users[userIndex].age = newAge ? parseInt(newAge) : null;
            users[userIndex].avatarColor = newAvatarColor;

            localStorage.setItem('users', JSON.stringify(users));
            localStorage.setItem('currentUser', JSON.stringify(users[userIndex]));
            currentUser = users[userIndex];

            alert('资料更新成功！');
            document.body.removeChild(modal);
            displayUserInfo(currentUser);
        }
    });
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
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
    loadUserProfile();

    document.getElementById('edit-profile-btn').addEventListener('click', showEditModal);

    document.getElementById('logout-btn').addEventListener('click', () => {
        if (confirm('确定要退出登录吗？')) {
            localStorage.removeItem('currentUser');
            window.location.href = 'index.html';
        }
    });
});