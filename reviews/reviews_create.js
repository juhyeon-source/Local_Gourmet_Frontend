'use strict';

function searchStores() {
    const searchQuery = document.getElementById('store-search').value;
    if (searchQuery.length < 2) {
        return; // 최소 2글자 입력 후 검색 시작
    }

    axios.get(`http://127.0.0.1:8000/api/stores/?search=${searchQuery}`)
        .then(response => {
            const stores = response.data; // API 응답에 맞게 수정
            const storeSelect = document.getElementById('store');
            storeSelect.innerHTML = ''; // 기존 옵션 제거
            stores.forEach(store => {
                const option = document.createElement('option');
                option.value = store.id;
                option.textContent = store.store_name; // 적절한 필드명을 사용
                storeSelect.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Error fetching stores:', error);
            alert('가게 목록을 불러오는 데 실패했습니다. 자세한 내용은 콘솔을 확인하세요.');
        });
}

document.getElementById('review-form').addEventListener('submit', postReview);

function postReview(event) {
    event.preventDefault(); // 폼 제출을 막음

    const formData = new FormData(event.target);
    const imageInput = document.getElementById('image');
    if (imageInput && imageInput.files && imageInput.files.length > 0) {
        formData.append('image', imageInput.files[0]);
    }

    axios.post('http://127.0.0.1:8000/api/reviews/create/', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
        .then(response => {
            alert('Review submitted successfully!');
            const newReview = response.data;
            addReviewToList(newReview); // 새 리뷰를 목록에 추가
            event.target.reset(); // 폼 초기화
        })
        .catch(error => {
            console.error('Error posting review:', error);
            if (error.response && error.response.data) {
                console.error('Server response:', error.response.data);
            }
        });
}

// 리뷰를 목록에 추가하는 함수
function addReviewToList(review) {
    const listItem = document.createElement('li');
    const reviewLink = document.createElement('a');
    reviewLink.href = "#";
    reviewLink.textContent = `${review.store} - ${review.username} (${review.score}/5점)`;
    reviewLink.dataset.reviewId = review.id;
    reviewLink.addEventListener('click', getReviewDetail);
    const reviewList = document.getElementById('review-list'); // review-list 요소 가져오기
    reviewList.appendChild(listItem); // 리뷰를 목록에 추가
    listItem.appendChild(reviewLink); // 리뷰 링크를 리스트 아이템에 추가
}
