document.addEventListener('DOMContentLoaded', function() {
    const categories = ["한식", "중식", "일식", "양식", "디저트", "주점", "패스트푸드", "기타"];
    categories.forEach(category => {
        createCategorySection(category);
        fetchDataByCategory(category, 1); // 페이지네이션을 위해 첫 페이지 데이터를 불러옴
    });

    // 새로고침 버튼 이벤트 리스너 추가
    const reloadButton = document.getElementById('reload-button');
    reloadButton.addEventListener('click', function() {
        reloadStores();
    });
});

// 현재 페이지를 저장할 객체
const currentPage = {};

// 카테고리 섹션을 생성하는 함수
function createCategorySection(category) {
    const container = document.getElementById('store-categories');
    const section = document.createElement('section');
    section.id = category;
    section.innerHTML = `
    <h2>${category}</h2>
        <div class="category-slider-container">
            <button onclick="slide('${category}', -1)" class="slider-button left">‹</button>
            <div class="category-slider" id="slider-${category}"></div>
            <button onclick="slide('${category}', 1)" class="slider-button right">›</button>
        </div>
    `;
    container.appendChild(section);
    currentPage[category] = 1; // 각 카테고리의 현재 페이지를 1로 초기화
}

// 카테고리별로 데이터를 가져오는 함수 (페이지네이션 적용)
function fetchDataByCategory(category, page) {
    axios.get(`http://127.0.0.1:8000/api/stores/?page=${page}`)
    .then(response => {
        const stores = response.data.results;
        const filteredStores = stores.filter(store => store.category === category);
        populateSlider(category, filteredStores);
    }).catch(error => console.error('Error:', error));
}

// 슬라이더를 데이터로 채우는 함수
function populateSlider(category, stores) {
    const slider = document.getElementById(`slider-${category}`);
    if (slider) {
        slider.innerHTML = ''; // 기존 내용을 초기화
        stores.forEach(store => {
            const card = document.createElement('div');
            const imgItem = document.createElement('img');
            const storeLink = document.createElement('a');
            const storeName = document.createElement('p');

            imgItem.className = 'store-img';
            imgItem.src = store.image;
            storeName.className = 'store-name';
            storeName.textContent = store.store_name;
            storeLink.href = `../stores/stores_detail.html?storeId=${store.id}`;
            storeLink.target = '_blank';
            card.className = 'card';

            storeLink.appendChild(imgItem);
            card.appendChild(storeLink);
            card.appendChild(storeName);
            slider.appendChild(card);
        });

        // 무한 스크롤 효과를 위해 초기 스크롤 위치를 중간으로 설정
        slider.scrollLeft = slider.scrollWidth / 2;
    } else {
        console.error(`Slider for ${category} not found`);
    }
}

// 슬라이드 버튼을 클릭할 때 호출되는 함수 (페이지네이션 적용)
function slide(category, direction) {
    const slider = document.getElementById(`slider-${category}`);
    const scrollAmount = 220;
    const newScrollPosition = slider.scrollLeft + (direction * scrollAmount);

    // 무한 스크롤 효과 유지
    if (newScrollPosition <= 0) {
        slider.scrollLeft += slider.scrollWidth / 2;
    } else if (newScrollPosition >= slider.scrollWidth - slider.clientWidth) {
        slider.scrollLeft -= slider.scrollWidth / 2;
    }

    slider.scrollLeft += direction * scrollAmount;

    // 페이지네이션 처리
    currentPage[category] += direction;
    if (currentPage[category] < 1) {
        currentPage[category] = 1;
    }

    fetchDataByCategory(category, currentPage[category]); // 새로운 데이터를 불러옴
}

// 슬라이더를 위한 새 데이터를 가져오는 함수
function fetchNewDataForSlider(category) {
    axios.get(`http://127.0.0.1:8000/api/stores/`)
    .then(response => {
        const stores = response.data.results;
        const filteredStores = stores.filter(store => store.category === category);
        populateSlider(category, filteredStores);
    }).catch(error => console.error('Error fetching new data:', error));
}

// 전체 매장을 새로고침하는 함수
function reloadStores() {
    const categories = ["한식", "중식", "일식", "양식", "디저트", "주점", "패스트푸드", "기타"];
    categories.forEach(category => {
        fetchDataByCategory(category, 1); // 첫 페이지로 초기화
    });
}











// 레시피챗봇 토글버튼 추가
const recipeButton = document.getElementById('recipe-button');
const chatContainer = document.getElementById('chat-container');

recipeButton.addEventListener('click', function() {
    chatContainer.classList.toggle('active');
});

let currentSlide = 0;


// 검색 기능
function searchStores(query) {
    if (!query) {
        displaySearchMessage("검색을 통해 매장을 조회할 수 있습니다");
        return;
    }

    axios.get(`http://127.0.0.1:8000/api/stores/?search=${query}`)
        .then(response => {
            const stores = response.data.results;
            if (stores.length > 0) {
                displaySearchResults(stores);
            } else {
                displaySearchMessage("검색 결과가 없습니다");
            }
        })
        .catch(error => {
            console.error('Error:', error);
            displaySearchMessage("검색 중 오류가 발생했습니다");
        });
}

function displaySearchResults(stores) {
    const resultsContainer = document.getElementById('search-results');
    resultsContainer.innerHTML = ''; // 기존 내용을 초기화

    stores.forEach(store => {
        const card = document.createElement('div');
        const imgItem = document.createElement('img');
        const storeLink = document.createElement('a');
        const storeName = document.createElement('p');

        imgItem.className = 'store-img';
        imgItem.src = store.image;
        storeName.className = 'store-name';
        storeName.textContent = store.store_name;
        storeLink.href = `stores_detail.html?storeId=${store.id}`;
        storeLink.target = '_blank';
        card.className = 'card';

        storeLink.appendChild(imgItem);
        card.appendChild(storeLink);
        card.appendChild(storeName);
        resultsContainer.appendChild(card);
    });
}

function displaySearchMessage(message) {
    const resultsContainer = document.getElementById('search-results');
    resultsContainer.innerHTML = `<p>${message}</p>`;
}
//검색기능