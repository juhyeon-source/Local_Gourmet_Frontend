'use strict';

document.addEventListener('DOMContentLoaded', function() {
  // 페이지 로드 시 모든 스토어를 가져오지 않음
});

function searchStores() {
  const searchQuery = document.getElementById('store-search').value;
  if (searchQuery.length < 3) {
      return; // 최소 3글자 입력 후 검색 시작
  }

  axios.get(`http://127.0.0.1:8000/api/stores/?search=${searchQuery}`)
      .then(response => {
          const stores = response.data.results; // API 응답에 맞게 수정
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
          alert('Failed to fetch stores. Please check the console for more details.');
      });
}

document.getElementById('review-form').addEventListener('submit', postReview);

const reviewListElement = document.getElementById('review-list'); 
const prevButton = document.getElementById('prev-page'); 
const nextButton = document.getElementById('next-page'); 
const currentPageSpan = document.getElementById('current-page'); 

let currentPage = 1;

// function getStoreDetail() {
//   const storeId = getQueryParam('storeId');
// }

function getReviews(page) {
  axios.get(`http://127.0.0.1:8000/api/reviews/list/12/?page_size=${page}`)  
    .then(response => {
      console.log('API Response:', response);
      const reviewData = response.data.results;  
      updateReviewList(reviewData); 
      updatePagination(response.data);  
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
      reviewLink.href = "#";  
      reviewLink.textContent = `${review.store} - ${review.username} (${review.score}/5점)`;
      reviewLink.dataset.reviewId = review.id;  
      reviewLink.addEventListener('click', getReviewDetail);  
      listItem.appendChild(reviewLink); 
      reviewListElement.appendChild(listItem);  
    });
  }

function updatePagination(data) {
    currentPageSpan.textContent = `Page ${currentPage}`; 
    prevButton.disabled = currentPage === 1;  
    nextButton.disabled = !data.next; 
  }
  
  prevButton.addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;  
      getReviews(currentPage);  
    }
  });
  
  nextButton.addEventListener('click', () => {
    if (nextButton.disabled === false) { 
      currentPage++;  
      getReviews(currentPage);  
    }
  });

  getReviews(currentPage);

function getReviewDetail(event) {
    event.preventDefault(); 
    const reviewId = event.target.dataset.reviewId; 
    console.log(event)
    axios.get(`http://127.0.0.1:8000/api/reviews/${reviewId}/`)  
      .then(response => {
        const review = response.data;
        document.getElementById('review-id').textContent = review.id;
        document.getElementById('store-id').textContent = review.store_id;
        document.getElementById('store-name').textContent = review.store;
        document.getElementById('username').textContent = review.username;
        document.getElementById('score').textContent = review.score;
        document.getElementById('review-content').textContent = review.review_content;
        document.getElementById('image').textContent = review.image;
        document.getElementById('created-at').textContent = review.created_at;
        document.getElementById('updated-at').textContent = review.updated_at;
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        alert('Failed to fetch review details. Please check the console for more details.');
      });
  }

function postReview(event) {
  event.preventDefault(); // 폼 제출을 막음

  const formData = new FormData();
formData.append('store', document.getElementById('store').value);
formData.append('score', document.getElementById('score').value);
formData.append('image', document.getElementById('image').files);
formData.append('review_content', document.getElementById('review-content').value);

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
      alert('Failed to submit review. Please check the console for more details.');
  });
}

function addReviewToList(review) {
  const listItem = document.createElement('li');
  const reviewLink = document.createElement('a');
  reviewLink.href = "#";
  reviewLink.textContent = `${review.store} - ${review.username} (${review.score}/5점)`;
  reviewLink.dataset.reviewId = review.id;
  reviewLink.addEventListener('click', getReviewDetail);
  document.getElementById('review-list').appendChild(listItem);
}