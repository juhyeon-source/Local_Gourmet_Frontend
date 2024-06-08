'use strict';

document.addEventListener('DOMContentLoaded', function () {
  // 페이지 로드 시 모든 스토어를 가져오지 않음
  getReviews(currentPage); // 페이지 로드 시 리뷰 목록 가져오기
});

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

const reviewListElement = document.getElementById('review-list');
const reviewPrevButton = document.getElementById('review-prev-page');
const reviewNextButton = document.getElementById('review-next-page');
const reviewCurrentPageSpan = document.getElementById('review-current-page');

let currentPage = 1;

function getReviews(page) {
  axios.get(`http://127.0.0.1:8000/api/reviews/list/12/?page=${page}`)
    .then(response => {
      console.log('API Response:', response);
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
    reviewLink.href = "#";
    reviewLink.textContent = `${review.store} - ${review.username} (${review.score}/5점)`;
    reviewLink.dataset.reviewId = review.id;
    reviewLink.addEventListener('click', getReviewDetail);
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

function getReviewDetail(event) {
  event.preventDefault();
  const reviewId = event.target.dataset.reviewId;
  axios.get(`http://127.0.0.1:8000/api/reviews/${reviewId}/`)
    .then(response => {
      const review = response.data;
      document.getElementById('review-id').textContent = review.id;
      document.getElementById('store-id').textContent = review.store_id;
      document.getElementById('store-name').textContent = review.store;
      document.getElementById('username').textContent = review.username;
      document.getElementById('score').textContent = review.score;
      document.getElementById('review-content').textContent = review.review_content;
      document.getElementById('image').innerHTML = `<img src="${review.image}" alt="리뷰 이미지" width="200">`;
      document.getElementById('created-at').textContent = review.created_at;
      document.getElementById('updated-at').textContent = review.updated_at;

      // 댓글 가져오기
      getComments(review.id, 1); // 첫 페이지의 댓글을 가져옴
    })
    .catch(error => {
      console.error('Error fetching data:', error);
      alert('Failed to fetch review details. Please check the console for more details.');
    });
}

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

function addReviewToList(review) {
  const listItem = document.createElement('li');
  const reviewLink = document.createElement('a');
  reviewLink.href = "#";
  reviewLink.textContent = `${review.store} - ${review.username} (${review.score}/5점)`;
  reviewLink.dataset.reviewId = review.id;
  reviewLink.addEventListener('click', getReviewDetail);
  listItem.appendChild(reviewLink);
  reviewListElement.appendChild(listItem);
}

// 댓글 가져오는 함수
function getComments(reviewId, page) {
  axios.get(`http://127.0.0.1:8000/api/reviews/${reviewId}/comments/?page=${page}`)
    .then(response => {
      const commentsData = response.data.results;
      updateCommentList(commentsData);
      updateCommentPagination(response.data, reviewId);
    })
    .catch(error => {
      console.error('Error fetching comments:', error);
      alert('Failed to fetch comments. Please check the console for more details.');
    });
}

const commentListElement = document.getElementById('comment-list');
const commentPrevButton = document.getElementById('comment-prev-page');
const commentNextButton = document.getElementById('comment-next-page');
const commentPageSpan = document.getElementById('comment-current-page');

let commentCurrentPage = 1;

function updateCommentList(commentsData) {
  commentListElement.innerHTML = '';
  commentsData.forEach(comment => {
    const listItem = document.createElement('li');
    listItem.textContent = `${comment.username}: ${comment.comment_content}`;
    commentListElement.appendChild(listItem);
  });
}

function updateCommentPagination(data, reviewId) {
  commentPageSpan.textContent = `Page ${commentCurrentPage}`;
  commentPrevButton.disabled = commentCurrentPage === 1;
  commentNextButton.disabled = !data.next;

  commentPrevButton.onclick = () => {
    if (commentCurrentPage > 1) {
      commentCurrentPage--;
      getComments(reviewId, commentCurrentPage);
    }
  };

  commentNextButton.onclick = () => {
    if (!commentNextButton.disabled) {
      commentCurrentPage++;
      getComments(reviewId, commentCurrentPage);
    }
  };
}
