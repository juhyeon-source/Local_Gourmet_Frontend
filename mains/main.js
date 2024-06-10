document.addEventListener('DOMContentLoaded', function() {
    const categories = ["한식", "중식", "일식", "양식", "디저트", "주점", "패스트푸드", "기타"];
    categories.forEach(category => {
        createCategorySection(category);
        fetchDataByCategory(category, 1); // 페이지네이션을 위해 첫 페이지 데이터를 불러옴
    });


    // 검색 버튼 이벤트 리스너 추가
    const searchButton = document.querySelector('.search-container button');
    searchButton.addEventListener('click', function() {
        searchStores();
    });

    // 새로고침 버튼 이벤트 리스너 추가
    const reloadButton = document.getElementById('reload-button');
    reloadButton.addEventListener('click', function() {
        reloadStores();
    });
});

// 검색 기능
function searchStores() {
    const searchQuery = document.getElementById('store-search').value;
    if (searchQuery.length < 2) {
        return; // 최소 2글자 입력 후 검색 시작
    }
    axios.get(`http://127.0.0.1:8000/api/stores/?search=${searchQuery}`)
        .then(response => {
            const stores = response.data; // API 응답에 맞게 수정
            console.log('Fetched stores:', stores); // 전체 데이터 로그
            const storeCategory = document.getElementById('search-results-slider');
            storeCategory.innerHTML = ''; // 이전 검색 결과 초기화
            if (storeCategory) {
                stores.forEach(store => {
                    const card = document.createElement('div'); // 카드 요소 생성
                    const imgItem = document.createElement('img'); // 이미지 요소 생성
                    const storeLink = document.createElement('a'); // 링크 요소 생성
                    const storeName = document.createElement('p'); // 매장 이름 요소 생성
                    imgItem.className = 'store-img'; // 이미지 클래스 추가
                    imgItem.src = store.image || 'path/to/default/image.jpg'; // 이미지 URL 설정, 기본 이미지 추가
                    storeName.className = 'store-name'; // 매장 이름 클래스 추가
                    storeName.textContent = store.store_name; // 매장 이름 설정
                    storeLink.href = `../stores/stores_detail.html?storeId=${store.id}`; // 링크 URL 설정
                    storeLink.target = '_blank'; // 링크를 새 창에서 열기
                    card.className = 'card'; // 카드 클래스 추가
                    // 링크에 이미지를 포함하고, 카드는 링크와 매장 이름을 포함
                    storeLink.appendChild(imgItem);
                    card.appendChild(storeLink);
                    card.appendChild(storeName);
                    storeCategory.appendChild(card);
                });
            } else {
                console.error(`Slider for ${searchQuery} not found`);
            }
        })
        .catch(error => {
            console.error('Error fetching stores:', error);
            alert('가게 목록을 불러오는 데 실패했습니다. 자세한 내용은 콘솔을 확인하세요.');
        });
}


//         // 무한 스크롤 효과를 위해 초기 스크롤 위치를 중간으로 설정
//         slider.scrollLeft = slider.scrollWidth / 2;
//     }

//     // 카테고리 섹션이 검색 결과 아래로 보이도록 위치 조정
//     const categorySectionsContainer = document.getElementById('category-sections-container');
//     categorySectionsContainer.style.top = `${slider.offsetHeight + 30}px`;
// }


// 현재 페이지를 저장할 객체
const currentPage = {};



// 카테고리 섹션을 생성하는 함수
function createCategorySection(category) {
    const container = document.getElementById('store-categories');
    const section = document.createElement('section');
    section.classList.add('category-section'); // class 추가
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
        const filteredStoresWithImage = stores.filter(store => store.category === category && store.image);
        const filteredStoresWithoutImage = stores.filter(store => store.category === category && !store.image);
        const filteredStores = [...filteredStoresWithImage, ...filteredStoresWithoutImage];
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
            imgItem.src = store.image || 'path/to/default/image.jpg'; // 이미지가 없을 경우 기본 이미지 사용
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

    // 자연스러운 스크롤 애니메이션
    const startPosition = slider.scrollLeft;
    const endPosition = startPosition + direction * scrollAmount;
    const duration = 500; // 애니메이션 지속 시간 (밀리초)
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

    // 슬라이더가 끝에 도달했을 때 무한 스크롤 효과를 유지
    if (endPosition <= 0) {
        slider.scrollLeft += slider.scrollWidth / 2;
    } else if (endPosition >= slider.scrollWidth - slider.clientWidth) {
        slider.scrollLeft -= slider.scrollWidth / 2;
    }
    // 페이지네이션 처리
    currentPage[category] += direction;
    if (currentPage[category] < 1) {
        currentPage[category] = 1;
    }

    fetchDataByCategory(category, currentPage[category]); // 새로운 데이터를 불러옴

    // 카테고리 섹션이 검색 결과 아래로 보이도록 위치 조정
    const categorySectionsContainer = document.getElementById('category-sections-container');
    categorySectionsContainer.style.top = `${slider.offsetHeight + 30}px`;
}


// 슬라이더를 위한 새 데이터를 가져오는 함수
function fetchNewDataForSlider(category) {
    axios.get(`http://127.0.0.1:8000/api/stores/`)
    .then(response => {
        const stores = response.data.results;
        const filteredStoresWithImage = stores.filter(store => store.category === category && store.image);
        const filteredStoresWithoutImage = stores.filter(store => store.category === category && !store.image);
        const filteredStores = [...filteredStoresWithImage, ...filteredStoresWithoutImage];
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