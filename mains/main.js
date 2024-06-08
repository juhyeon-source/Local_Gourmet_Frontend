document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('prev').addEventListener('click', slidePrev);
    document.getElementById('next').addEventListener('click', slideNext);
});

document.addEventListener('DOMContentLoaded', function() {
    const categories = ["한식", "중식", "일식", "양식", "디저트", "주점", "패스트푸드", "기타"];
    categories.forEach(category => {
        createCategorySection(category);
        fetchDataByCategory(category);
    });
});


    // 레시피 버튼 토글 기능 추가
    const recipeButton = document.getElementById('recipe-button');
    const chatContainer = document.getElementById('chat-container');

    recipeButton.addEventListener('click', function() {
        chatContainer.classList.toggle('active');
    });

let currentSlide = 0;

//검색기능


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
            const card = document.createElement('div');  // 카드 요소 생성
            const imgItem = document.createElement('img');  // 이미지 요소 생성
            const storeLink = document.createElement('a');  // 링크 요소 생성
            const storeName = document.createElement('p');  // 매장 이름 요소 생성
            
            imgItem.className = 'store-img';  // 이미지 클래스 추가
            imgItem.src = store.image // 이미지 URL 설정
            storeName.className = 'store-name';  // 매장 이름 클래스 추가
            storeName.textContent = store.store_name;  // 매장 이름 설정           
            storeLink.href = `stores_detail.html?storeId=${store.id}`;  // 링크 URL 설정
            storeLink.target = '_blank';  // 링크를 새 창에서 열기          
            card.className = 'card';  // 카드 클래스 추가
            
            // 링크에 이미지를 포함하고, 카드는 링크와 매장 이름을 포함
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
    slider.scrollLeft += direction * 220; // 스크롤 이동량을 조정 가능
}

// 이전 슬라이드로 이동
function slidePrev() {
    const reviewSlider = document.getElementById('review-slider');
    const reviewItems = document.querySelectorAll('.review-item');
    const itemWidth = reviewItems[0].offsetWidth + 20;
    currentSlide = Math.max(currentSlide - 1, 0);
    reviewSlider.style.transform = `translateX(-${currentSlide * itemWidth}px)`;
}

// 다음 슬라이드로 이동
function slideNext() {
    const reviewSlider = document.getElementById('review-slider');
    const reviewItems = document.querySelectorAll('.review-item');
    const itemWidth = reviewItems[0].offsetWidth + 20;
    currentSlide = Math.min(currentSlide + 1, reviewItems.length - 1);
    reviewSlider.style.transform = `translateX(-${currentSlide * itemWidth}px)`;
}

