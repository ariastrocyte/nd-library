import './style.css'


function initTheme() {
  const themeToggleBtn = document.getElementById('theme-toggle');
  const themeToggleDarkIcon = document.getElementById('theme-toggle-dark-icon');
  const themeToggleLightIcon = document.getElementById('theme-toggle-light-icon');


  if (localStorage.getItem('color-theme') === 'dark' ||
    (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
    themeToggleLightIcon.classList.remove('hidden');
  } else {
    themeToggleDarkIcon.classList.remove('hidden');
  }

  themeToggleBtn.addEventListener('click', function () {
    themeToggleDarkIcon.classList.toggle('hidden');
    themeToggleLightIcon.classList.toggle('hidden');

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

  mobileMenuButton.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
  });
}

// 旋转木马！！
function initBooksCarousel() {

  const books = [
    {
      id: 1,
      title: "创伤与恢复",
      author: "朱迪思·赫尔曼",
      cover: "https://via.placeholder.com/200x300?text=创伤与恢复",
      rating: 4.5
    },
    {
      id: 2,
      title: "身体从未忘记",
      author: "贝塞尔·范德科尔克",
      cover: "https://via.placeholder.com/200x300?text=身体从未忘记",
      rating: 4.7
    },
    {
      id: 3,
      title: "情绪急救",
      author: "盖伊·温奇",
      cover: "https://via.placeholder.com/200x300?text=情绪急救",
      rating: 4.3
    },
    {
      id: 4,
      title: "被讨厌的勇气",
      author: "岸见一郎",
      cover: "https://via.placeholder.com/200x300?text=被讨厌的勇气",
      rating: 4.6
    },
    {
      id: 5,
      title: "心理急救",
      author: "约翰·多兰",
      cover: "https://via.placeholder.com/200x300?text=心理急救",
      rating: 4.4
    }
  ];

  const booksContainer = document.getElementById('books-container');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');

  let currentIndex = 0;

  // 书籍卡片
  function renderBooks() {
    booksContainer.innerHTML = books.map(book => `
            <div class="flex-shrink-0 w-64 mx-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105 cursor-pointer">
                <div class="p-6">
                    <img src="${book.cover}" alt="${book.title}" class="w-full h-48 object-cover rounded-lg mb-4">
                    <h3 class="text-lg font-semibold mb-2 text-gray-900 dark:text-white">${book.title}</h3>
                    <p class="text-gray-600 dark:text-gray-300 mb-2">${book.author}</p>
                    <div class="flex items-center">
                        <div class="flex text-yellow-400 mr-2">
                            ${'★'.repeat(Math.floor(book.rating))}${'☆'.repeat(5 - Math.floor(book.rating))}
                        </div>
                        <span class="text-sm text-gray-600 dark:text-gray-300">${book.rating}</span>
                    </div>
                </div>
            </div>
        `).join('');

    booksContainer.querySelectorAll('.cursor-pointer').forEach((card, index) => {
      card.addEventListener('click', () => {
        window.location.href = `book-detail.html?id=${books[index].id}`;
      });
    });
  }

  function updateCarousel() {
    const cardWidth = 288; // 64 * 4 + 16 * 2 (w-64 + mx-4)
    booksContainer.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
  }

  prevBtn.addEventListener('click', () => {
    currentIndex = currentIndex > 0 ? currentIndex - 1 : books.length - 1;
    updateCarousel();
  });

  nextBtn.addEventListener('click', () => {
    currentIndex = currentIndex < books.length - 1 ? currentIndex + 1 : 0;
    updateCarousel();
  });

  setInterval(() => {
    currentIndex = currentIndex < books.length - 1 ? currentIndex + 1 : 0;
    updateCarousel();
  }, 4000);

  renderBooks();
}

function checkLoginStatus() {
  const profileLink = document.getElementById('profile-link');
  const profileLinkMobile = document.getElementById('profile-link-mobile');
  const currentUser = localStorage.getItem('currentUser');

  function updateLink(element) {
    if (!element) return;

    if (currentUser) {
      element.textContent = '我的';
      element.href = 'profile.html';
      element.onclick = null;
    } else {
      element.textContent = '点击登录';
      element.href = '#';
      element.onclick = function (e) {
        e.preventDefault();
        window.location.href = 'login.html';
        return false;
      };
    }
  }

  updateLink(profileLink);
  updateLink(profileLinkMobile);
}

function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.animationPlayState = 'running';
      }
    });
  });

  document.querySelectorAll('.animate-slide-in-left, .animate-slide-in-right, .animate-fade-in').forEach((el) => {
    el.style.animationPlayState = 'paused';
    observer.observe(el);
  });
}


document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initMobileMenu();
  initBooksCarousel();
  checkLoginStatus();
  initScrollAnimations();
});
