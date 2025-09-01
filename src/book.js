//书籍总分类页面
const booksData = [
    {
        id: 1,
        title: "创伤与恢复",
        author: "朱迪思·赫尔曼",
        cover: "https://via.placeholder.com/200x300?text=创伤与恢复",
        rating: 4.5,
        categories: ["trauma", "development"],
        description: "这是一本关于创伤治疗的权威著作...",
        publishYear: "2015"
    },
    {
        id: 2,
        title: "身体从未忘记",
        author: "贝塞尔·范德科尔克",
        cover: "https://via.placeholder.com/200x300?text=身体从未忘记",
        rating: 4.7,
        categories: ["trauma", "emotion"],
        description: "探索创伤如何影响身体和大脑...",
        publishYear: "2014"
    },
    {
        id: 3,
        title: "情绪急救",
        author: "盖伊·温奇",
        cover: "https://via.placeholder.com/200x300?text=情绪急救",
        rating: 4.3,
        categories: ["emotion", "anxiety"],
        description: "处理日常情绪问题的实用指南...",
        publishYear: "2013"
    },
    {
        id: 4,
        title: "被讨厌的勇气",
        author: "岸见一郎",
        cover: "https://via.placeholder.com/200x300?text=被讨厌的勇气",
        rating: 4.6,
        categories: ["relationship", "development"],
        description: "基于阿德勒心理学的人际关系指南...",
        publishYear: "2013"
    },
    {
        id: 5,
        title: "心理急救",
        author: "约翰·多兰",
        cover: "https://via.placeholder.com/200x300?text=心理急救",
        rating: 4.4,
        categories: ["anxiety", "trauma"],
        description: "应对心理危机的实用工具...",
        publishYear: "2018"
    },
    {
        id: 6,
        title: "非暴力沟通",
        author: "马歇尔·卢森堡",
        cover: "https://via.placeholder.com/200x300?text=非暴力沟通",
        rating: 4.8,
        categories: ["relationship", "emotion"],
        description: "学会用心倾听和表达的沟通方式...",
        publishYear: "2009"
    }
];

const categoryNames = {
    'trauma': '创伤治疗',
    'emotion': '情绪管理',
    'relationship': '人际关系',
    'anxiety': '焦虑抑郁',
    'development': '个人成长'
};


let currentCategory = 'all';
let currentSearchTerm = '';


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


function filterBooks() {
    let filteredBooks = [...booksData];


    if (currentCategory !== 'all') {
        filteredBooks = filteredBooks.filter(book =>
            book.categories.includes(currentCategory)
        );
    }


    if (currentSearchTerm) {
        filteredBooks = filteredBooks.filter(book =>
            book.title.toLowerCase().includes(currentSearchTerm.toLowerCase()) ||
            book.author.toLowerCase().includes(currentSearchTerm.toLowerCase())
        );
    }

    renderBooks(filteredBooks);
}

function renderBooks(books) {
    const grid = document.getElementById('books-grid');
    const noResults = document.getElementById('no-results');
    const countElement = document.getElementById('books-count');

    if (books.length === 0) {
        grid.innerHTML = '';
        noResults.classList.remove('hidden');
        countElement.textContent = '未找到相关书籍';
        return;
    }

    noResults.classList.add('hidden');
    countElement.textContent = `共 ${books.length} 本书籍`;

    grid.innerHTML = books.map(book => `
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer book-card" data-book-id="${book.id}">
            <div class="p-6">
                <div class="aspect-w-3 aspect-h-4 mb-4">
                    <img src="${book.cover}" alt="${book.title}" class="w-full h-48 object-cover rounded-lg">
                </div>
                
                <h3 class="text-lg font-semibold mb-2 text-gray-900 dark:text-white line-clamp-2">${book.title}</h3>
                <p class="text-gray-600 dark:text-gray-300 mb-2">${book.author}</p>
                <p class="text-sm text-gray-500 dark:text-gray-400 mb-3">出版年份：${book.publishYear}</p>
                
                <!-- Rating -->
                <div class="flex items-center mb-3">
                    <div class="flex text-yellow-400 mr-2">
                        ${'★'.repeat(Math.floor(book.rating))}${'☆'.repeat(5 - Math.floor(book.rating))}
                    </div>
                    <span class="text-sm text-gray-600 dark:text-gray-300">${book.rating}</span>
                </div>
                
                <!-- Categories -->
                <div class="flex flex-wrap gap-1 mb-3">
                    ${book.categories.map(cat =>
        `<span class="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900/30 text-purple-700 dark:text-blue-300 rounded-full">${categoryNames[cat] || cat}</span>`
    ).join('')}
                </div>
                
                <!-- Description -->
                <p class="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-4">${book.description}</p>
                
                <!-- Action Button -->
                <button class="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md transition-colors text-sm font-medium">
                    查看详情
                </button>
            </div>
        </div>
    `).join('');


    document.querySelectorAll('.book-card').forEach(card => {
        card.addEventListener('click', () => {
            const bookId = card.dataset.bookId;
            window.location.href = `book-detail.html?id=${bookId}`;
        });
    });
}


function initCategoryFilters() {
    const categoryButtons = document.querySelectorAll('.category-btn');

    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            const category = button.dataset.category;


            categoryButtons.forEach(btn => {
                if (btn === button) {
                    btn.className = 'category-btn w-full text-left px-4 py-2 rounded-md bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium transition-colors';
                } else {
                    btn.className = 'category-btn w-full text-left px-4 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors';
                }
            });

            currentCategory = category;
            filterBooks();
        });
    });
}


function initSearch() {
    const searchInput = document.getElementById('search-input');

    searchInput.addEventListener('input', (e) => {
        currentSearchTerm = e.target.value.trim();
        filterBooks();
    });


    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            currentSearchTerm = e.target.value.trim();
            filterBooks();
        }
    });
}


document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initMobileMenu();
    checkLoginStatus();
    initCategoryFilters();
    initSearch();
    filterBooks();
});