document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('prev').addEventListener('click', slidePrev);
    document.getElementById('next').addEventListener('click', slideNext);
    loadStores();
    loadReviews();
});


document.addEventListener('DOMContentLoaded', function() {
    const categories = ["Korean", "Chinese", "Japanese", "Western", "Dessert", "Pub", "FastFood", "Other"];
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


// 매장 데이터를 로드하고 표시하는 함수

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

function fetchDataByCategory(category) {
    axios.get(`http://127.0.0.1:8000/api/stores/?category=${category}&page_size=8`)
        .then(response => {
            const stores = response.data.results;
            populateSlider(category, stores);
        }).catch(error => console.error('Error:', error));
}

function populateSlider(category, stores) {
    const slider = document.getElementById(`slider-${category}`);
    stores.forEach(store => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `<h3>${store.store_name}</h3>`;
        slider.appendChild(card);
    });
}

function slide(category, direction) {
    const slider = document.getElementById(`slider-${category}`);
    slider.scrollLeft += direction * 220; // Adjust scroll amount if needed
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

