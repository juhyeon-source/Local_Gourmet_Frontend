document.addEventListener('DOMContentLoaded', function() {
    const categories = ["한식", "중식", "일식", "양식", "디저트", "주점", "패스트푸드", "기타"];
    categories.forEach(category => {
        createCategorySection(category);
        fetchDataByCategory(category, 1);
    });

    // 검색 버튼 이벤트 리스너 추가
    document.querySelector('.search-container button').addEventListener('click', searchStores);

    // 스크래퍼 데이터 가져오기
    fetchScrapperData();

    // 레시피챗봇 토글버튼 추가
    document.getElementById('recipe-button').addEventListener('click', () => {
    document.getElementById('chat-container').classList.toggle('active');
    });
});

// Review Create 버튼 클릭 시 리뷰 생성 페이지로 이동하는 함수
function createReview() {
    window.location.href = '../reviews/reviews_create.html';
}

let currentSearchPage = 1;
let totalSearchPages = 1;


function searchStores() {
    const searchQuery = document.getElementById('store-search').value;
    if (searchQuery.length < 2) return;

    currentSearchPage = 1;
    fetchSearchResults(searchQuery, currentSearchPage);
}

function fetchSearchResults(query, page) {
    axios.get(`https://www.sparta-local-gourmet.store/api/stores/?search=${query}&page=${page}`)
        .then(response => {
            const stores = response.data.results || response.data;
            totalSearchPages = Math.ceil(response.data.count / 4);
            populateSlider('search-results-container', stores);
        })
        .catch(error => {
            console.error('Error fetching stores:', error);
            alert('가게 목록을 불러오는 데 실패했습니다. 자세한 내용은 콘솔을 확인하세요.');
        });
}

function fetchScrapperData() {
    axios.get('https://www.sparta-local-gourmet.store/api/scrappers/?page=1')
        .then(response => {
            const scrappers = response.data.results || response.data;
            populateSlider('scrapper-slider', scrappers);
        })
        .catch(error => {
            console.error('Error fetching scrappers:', error);
            alert('스크래퍼 목록을 불러오는 데 실패했습니다. 자세한 내용은 콘솔을 확인하세요.');
        });
}

function populateSlider(containerId, items) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';

    if (items.length === 0) {
        container.innerHTML = '<p class="search-placeholder">검색 결과가 없습니다</p>';
    } else {
        items.forEach(item => {
            const card = createItemCard(item);
            container.appendChild(card);
        });
    }
}

function createItemCard(item) {
    const card = document.createElement('div');
    const imgItem = document.createElement('img');
    const itemLink = document.createElement('a');
    const itemName = document.createElement('p');

    imgItem.className = 'store-img';
    imgItem.src = item.image || 'path/to/default/image.jpg';
    itemName.className = 'store-name';
    itemName.textContent = item.store_name || item.title;
    itemLink.href = item.store_name ? `../stores/stores_detail.html?storeId=${item.id}` : item.url;
    itemLink.target = '_blank';
    card.className = 'card';

    itemLink.appendChild(imgItem);
    card.appendChild(itemLink);
    card.appendChild(itemName);

    return card;
}

function slide(containerId, direction) {
    const slider = document.getElementById(containerId);
    const scrollAmount = 220;
    const newScrollPosition = slider.scrollLeft + (direction * scrollAmount);

    animateScroll(slider, newScrollPosition);

    // 데이터 추가 로직
    const category = containerId.split('-')[1];
    const newPage = direction === 1 ? currentPage[category] + 1 : currentPage[category] - 1;
    if (newPage > 0) {
        fetchDataByCategory(category, newPage);
        currentPage[category] = newPage;
    }
}

function animateScroll(slider, endPosition) {
    const startPosition = slider.scrollLeft;
    const duration = 500;
    let startTime = null;

    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const run = ease(timeElapsed, startPosition, endPosition - startPosition, duration);
        slider.scrollLeft = run;
        if (timeElapsed < duration) requestAnimationFrame(animation);
    }

    function ease(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }

    requestAnimationFrame(animation);
}

function createCategorySection(category) {
    const container = document.getElementById('store-categories');
    const section = document.createElement('section');
    section.classList.add('category-section');
    section.innerHTML = `
        <h2 class="category-name">${category}</h2>
        <div class="slider-container">
            <button onclick="slide('slider-${category}', -1)" class="slider-button left">‹</button>
            <div class="slider" id="slider-${category}"></div>
            <button onclick="slide('slider-${category}', 1)" class="slider-button right">›</button>
        </div>
    `;
    container.appendChild(section);
    currentPage[category] = 1;
}

function fetchDataByCategory(category, page) {
    axios.get(`https://www.sparta-local-gourmet.store/api/stores/?page=${page}`)
        .then(response => {
            const stores = response.data.results;
            const filteredStores = filterStoresByCategory(stores, category);
            populateSlider(`slider-${category}`, filteredStores);
        })
        .catch(error => console.error('Error:', error));
}

function filterStoresByCategory(stores, category) {
    const storesWithImage = stores.filter(store => store.category === category && store.image);
    const storesWithoutImage = stores.filter(store => store.category === category && !store.image);
    return [...storesWithImage, ...storesWithoutImage];
}

const currentPage = {};
