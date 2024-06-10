'use strict';

function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  console.log(urlParams);
  console.log('storeId :', urlParams.get(param));
  return urlParams.get(param);
}

const storeId = getQueryParam('storeId');

function getStoreDetail() {
  const storeId = getQueryParam('storeId'); // 쿼리 파라미터에서 storeId를 가져옴

  if (!storeId) {
    console.error('storeId is missing in the URL');
    return;
  }

  axios.get(`http://127.0.0.1:8000/api/stores/${storeId}/`) // 지정된 매장 ID로 상세 정보 가져옴
    .then(response => {
      const store = response.data; // 매장 정보 추출
      // document.getElementById('store-id').textContent = store.id;
      document.getElementById('store-name').textContent = store.store_name;
      document.getElementById('store-category').textContent = store.category;
      document.getElementById('store-phone').textContent = store.phone_number;
      document.getElementById('store-address').textContent =
        `${store.address.address_si} ${store.address.address_gu} ${store.address.address_detail}`;
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });
}

// 페이지가 로드될 때 getStoreDetail 함수를 호출
window.onload = getStoreDetail;

document.addEventListener('DOMContentLoaded', function () {
  getReviews(currentPage); // 페이지 로드 시 리뷰 목록 가져오기
});

const reviewListElement = document.getElementById('review-list');
const reviewPrevButton = document.getElementById('review-prev-page');
const reviewNextButton = document.getElementById('review-next-page');
const reviewCurrentPageSpan = document.getElementById('review-current-page');

let currentPage = 1;

function getReviews(page) {
  axios.get(`http://127.0.0.1:8000/api/reviews/list/${storeId}/?page_size=${page}`)
    .then(response => {
      const reviewData = response.data.results;
      updateReviewList(reviewData);
      updateReviewPagination(response.data);
    })
    .catch(error => {
      console.error('Error fetching data:', error);
      alert('Failed to fetch data. Please check the console for more details.');
    });
}

function updateReviewList(reviewData) {
  reviewListElement.innerHTML = '';
  reviewData.forEach(review => {
    const listItem = document.createElement('li');
    const reviewLink = document.createElement('a');
    reviewLink.href = `../reviews/reviews_detail.html?reviewId=${review.id}`; // 리뷰 상세 페이지로 링크 설정
    reviewLink.textContent = `${review.store} - ${review.username} (${review.score}/5점)`;
    listItem.appendChild(reviewLink);
    reviewListElement.appendChild(listItem);
  });
}

function updateReviewPagination(data) {
  reviewCurrentPageSpan.textContent = `Page ${currentPage}`;
  reviewPrevButton.disabled = currentPage === 1;
  reviewNextButton.disabled = !data.next;
}

reviewPrevButton.addEventListener('click', () => {
  if (currentPage > 1) {
    currentPage--;
    getReviews(currentPage);
  }
});

reviewNextButton.addEventListener('click', () => {
  if (!reviewNextButton.disabled) {
    currentPage++;
    getReviews(currentPage);
  }
});

getReviews(currentPage);
