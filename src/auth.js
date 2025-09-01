//login.html
document.addEventListener('DOMContentLoaded', () => {
    initializeTestData();
    initTabSwitcher();
    initForms();
    initAvatarColorSelector();
    initQuickLogin();
});

// 测试数据（整个项目都做完了可以删掉！
function initializeTestData() {
    const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
    if (existingUsers.length === 0) {
        const testUsers = [
            {
                id: 1,
                email: "test@example.com",
                username: "测试用户",
                password: "123456",
                avatarColor: "blue",
                gender: "female",
                age: 25,
                location: "北京",
                bio: "这是一个测试账号，用于开发调试",
                joinDate: new Date('2024-01-01').toISOString(),
                favorites: [],
                comments: [
                    {
                        id: 1001,
                        bookId: 1,
                        bookTitle: "创伤与恢复",
                        content: "这本书真的很有帮助！作者的专业知识和温暖的文字给了我很多启发。",
                        createdAt: "2024-08-15T10:00:00.000Z"
                    }
                ],
                ratings: []
            },
            {
                id: 2,
                email: "user2@example.com",
                username: "Alice",
                password: "123456",
                avatarColor: "purple",
                bio: "心理学爱好者，喜欢分享读书心得",
                joinDate: new Date('2024-02-01').toISOString(),
                favorites: [],
                comments: [
                    {
                        id: 1002,
                        bookId: 1,
                        bookTitle: "创伤与恢复",
                        content: "强烈推荐给所有关注心理健康的朋友！",
                        createdAt: "2024-08-16T14:30:00.000Z"
                    }
                ],
                ratings: []
            }
        ];

        localStorage.setItem('users', JSON.stringify(testUsers));
        console.log('测试数据已添加');
    }
}


function initTabSwitcher() {
    const loginTab = document.getElementById('login-tab');
    const registerTab = document.getElementById('register-tab');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    loginTab.addEventListener('click', () => {
        loginTab.classList.add('bg-white', 'dark:bg-gray-800', 'text-blue-600', 'dark:text-blue-400', 'shadow');
        loginTab.classList.remove('text-gray-600', 'dark:text-gray-300');
        registerTab.classList.remove('bg-white', 'dark:bg-gray-800', 'text-blue-600', 'dark:text-blue-400', 'shadow');
        registerTab.classList.add('text-gray-600', 'dark:text-gray-300');

        loginForm.classList.remove('hidden');
        registerForm.classList.add('hidden');
    });

    registerTab.addEventListener('click', () => {
        registerTab.classList.add('bg-white', 'dark:bg-gray-800', 'text-blue-600', 'dark:text-blue-400', 'shadow');
        registerTab.classList.remove('text-gray-600', 'dark:text-gray-300');
        loginTab.classList.remove('bg-white', 'dark:bg-gray-800', 'text-blue-600', 'dark:text-blue-400', 'shadow');
        loginTab.classList.add('text-gray-600', 'dark:text-gray-300');

        registerForm.classList.remove('hidden');
        loginForm.classList.add('hidden');
    });
}


function initAvatarColorSelector() {
    const colorOptions = document.querySelectorAll('input[name="avatar-color"]');
    colorOptions.forEach(option => {
        option.addEventListener('change', () => {
            colorOptions.forEach(opt => {
                const label = opt.parentElement;
                label.classList.remove('ring-2', 'ring-offset-2');
                label.classList.remove(`ring-${opt.value}-500`);
            });
            const selectedLabel = option.parentElement;
            selectedLabel.classList.add('ring-2', 'ring-offset-2', `ring-${option.value}-500`);
        });
    });
}

// form
function initForms() {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');


    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        handleLogin();
    });


    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        handleRegister();
    });
}

// 处理登录
function handleLogin() {
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;

    if (!email || !password) {
        alert('请填写完整的登录信息');
        return;
    }

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        alert('登录成功！');

        // 跳转到来源页面或首页
        const urlParams = new URLSearchParams(window.location.search);
        const returnUrl = urlParams.get('return') || 'index.html';
        window.location.href = returnUrl;
    } else {
        alert('邮箱或密码错误');
    }
}

// 处理注册
function handleRegister() {
    const email = document.getElementById('register-email').value.trim();
    const username = document.getElementById('register-username').value.trim();
    const password = document.getElementById('register-password').value;
    const passwordConfirm = document.getElementById('register-password-confirm').value;
    const avatarColor = document.querySelector('input[name="avatar-color"]:checked').value;
    const gender = document.getElementById('register-gender').value;
    const age = document.getElementById('register-age').value;
    const location = document.getElementById('register-location').value.trim();
    const bio = document.getElementById('register-bio').value.trim();

    // 基本验证
    if (!email || !username || !password || !passwordConfirm) {
        alert('请填写所有必填信息');
        return;
    }

    if (!isValidEmail(email)) {
        alert('请输入有效的邮箱地址');
        return;
    }

    if (username.length < 2 || username.length > 20) {
        alert('用户名长度应在2-20个字符之间');
        return;
    }

    if (password.length < 6) {
        alert('密码长度至少6位');
        return;
    }

    if (password !== passwordConfirm) {
        alert('两次输入的密码不一致');
        return;
    }

    // 检查邮箱是否已存在
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.some(u => u.email === email)) {
        alert('该邮箱已被注册');
        return;
    }

    // 检查用户名是否已存在
    if (users.some(u => u.username === username)) {
        alert('该用户名已被使用');
        return;
    }

    // 创建新用户
    const newUser = {
        id: Date.now(),
        email: email,
        username: username,
        password: password, // 实际项目中应该加密存储
        avatarColor: avatarColor,
        gender: gender,
        age: age ? parseInt(age) : null,
        location: location,
        bio: bio,
        joinDate: new Date().toISOString(),
        favorites: [],
        comments: [],
        ratings: []
    };

    // 保存用户
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('currentUser', JSON.stringify(newUser));

    alert('注册成功！欢迎加入我们');
    window.location.href = 'index.html';
}

// 快速登录（开发用）
function initQuickLogin() {
    document.getElementById('quick-login').addEventListener('click', () => {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        if (users.length > 0) {
            localStorage.setItem('currentUser', JSON.stringify(users[0]));
            alert('已登录测试账号');
            window.location.href = 'index.html';
        } else {
            alert('没有找到测试账号');
        }
    });
}

// 邮箱验证
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

