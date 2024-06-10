document.addEventListener('DOMContentLoaded', function() {
    const categories = ["한식", "중식", "일식", "양식", "디저트", "주점", "패스트푸드", "기타"];
    categories.forEach(category => {
        createCategorySection(category);
        fetchDataByCategory(category);
    });
});



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

// 카테고리 섹션을 만드는 함수
function createCategorySection(category) {
    const container = document.getElementById('store-categories');
    const section = document.createElement('section');
    section.id = category;
    section.innerHTML = `
    <h2>${category}</h2>
        <div class="category-slider-container">
            <button onclick="slide('${category}', -1)" class="slider-button">‹</button>
            <div class="category-slider" id="slider-${category}"></div>
            <button onclick="slide('${category}', 1)" class="slider-button">›</button>
        </div>
    `;
    container.appendChild(section);
}

// 카테고리별로 데이터를 가져오는 함수
function fetchDataByCategory(category) {
    axios.get(`http://127.0.0.1:8000/api/stores/`)
    .then(response => {
        const stores = response.data.results;
            console.log('Fetched stores:', stores);  // 전체 데이터 로그
            // 매장 데이터를 카테고리별로 필터링
            const filteredStores = stores.filter(store => store.category === category);
            populateSlider(category, filteredStores);
        }).catch(error => console.error('Error:', error));
}

// 슬라이더에 매장 데이터를 채우는 함수
function populateSlider(category, stores) {
    const slider = document.getElementById(`slider-${category}`);
    if (slider) {
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
            slider.appendChild(card);
        });
    } else {
        console.error(`Slider for ${category} not found`);
    }
}

// 슬라이더를 이동시키는 함수
function slide(category, direction) {
    const slider = document.getElementById(`slider-${category}`);
    slider.scrollLeft += direction * 220;
}

// 레시피챗봇 토글버튼 추가
const recipeButton = document.getElementById('recipe-button');
const chatContainer = document.getElementById('chat-container');

recipeButton.addEventListener('click', function() {
    chatContainer.classList.toggle('active');
});

let currentSlide = 0;

//검색기능