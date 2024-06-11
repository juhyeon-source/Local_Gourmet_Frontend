'use strict';

let loggedInUsername = null;

function getLoggedInUser() {
  const token = localStorage.getItem('access');
  if (!token) {
    console.error('로그인이 필요합니다.');
    return;
  }

  axios.get('http://127.0.0.1:8000/api/accounts/me/', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
    .then(response => {
      loggedInUsername = response.data.username;
      // 유저 정보를 성공적으로 가져오면 리뷰 디테일을 가져오는 함수 호출
      getStoreDetail();
    })
    .catch(error => {
      console.error('Error fetching logged-in user data:', error);
    });
}

function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  console.log(urlParams);
  console.log('storeId :', urlParams.get(param));
  return urlParams.get(param);
}

const storeId = getQueryParam('storeId');

function getStoreDetail() {
  if (!storeId) {
    console.error('storeId is missing in the URL');
    return;
  }

  axios.get(`http://127.0.0.1:8000/api/stores/${storeId}/`)
    .then(response => {
      const store = response.data;
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
window.onload = () => {
  getLoggedInUser();
  getStoreDetail();
  getReviews(storeId, currentPage);
};

const reviewListElement = document.getElementById('review-list');
const reviewPrevButton = document.getElementById('review-prev-page');
const reviewNextButton = document.getElementById('review-next-page');
const reviewCurrentPageSpan = document.getElementById('review-current-page');

let currentPage = 1;

function getReviews(storeId, page) {
  axios.get(`http://127.0.0.1:8000/api/reviews/list/${storeId}/?page_size=${page}`)
    .then(response => {
      const reviewData = response.data.results;
      updateReviewList(reviewData);
      updateReviewPagination(response.data, storeId);
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
    reviewLink.textContent = `${review.store} - ${review.username} (${review.score}/5점)`;
    reviewLink.href = `../reviews/reviews_detail.html?reviewId=${review.id}`;
    listItem.appendChild(reviewLink);

    if (review.username === loggedInUsername) {
      const editButton = document.createElement('button');
      editButton.textContent = 'Edit';
      editButton.onclick = () => goToEditReviewPage(review.id);
      listItem.appendChild(editButton);

      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'Delete';
      deleteButton.onclick = () => deleteReview(review.id);
      listItem.appendChild(deleteButton);
    }

    reviewListElement.appendChild(listItem);
  });
}

function goToEditReviewPage(reviewId) {
  window.location.href = `../reviews/reviews_edit.html?reviewId=${reviewId}`;
}

// 리뷰 삭제 함수
function deleteReview(reviewId) {
  const token = localStorage.getItem('access');
  axios.delete(`http://127.0.0.1:8000/api/reviews/${reviewId}/destroy/`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
    .then(response => {
      alert('리뷰가 성공적으로 삭제되었습니다.');
      getReviews(storeId, currentPage);
    })
    .catch(error => {
      console.error('Error deleting comment:', error);
      alert('리뷰 삭제에 실패했습니다. 자세한 내용은 콘솔을 확인하세요.');
    });
}

function updateReviewPagination(data, storeId) {
  reviewCurrentPageSpan.textContent = `Page ${currentPage}`;
  reviewPrevButton.disabled = currentPage === 1;
  reviewNextButton.disabled = !data.next;

  reviewPrevButton.onclick = () => {
      if (currentPage > 1) {
          currentPage--;
          getReviews(storeId, currentPage);
      }
  };

  reviewNextButton.onclick = () => {
      if (!reviewNextButton.disabled) {
          currentPage++;
          getReviews(storeId, currentPage);
      }
  };
}

getReviews(storeId, currentPage);
