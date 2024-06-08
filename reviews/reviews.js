<<<<<<< HEAD
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('load-more-reviews').addEventListener('click', loadMoreReviews);
    document.getElementById('create-review-button').addEventListener('click', createReview);
    document.getElementById('create-comment-button').addEventListener('click', createComment);

    loadReviews(1);
});

function loadReviews(page) {
    const reviewList = document.getElementById('review-list');
    axios.get(`http://127.0.0.1:8000/api/reviews/?page=${page}`)
        .then(response => {
            const reviews = response.data.results;
            reviews.forEach(review => {
                const reviewItem = document.createElement('div');
                reviewItem.classList.add('review-item');
                reviewItem.innerHTML = `<h3>${review.store.store_name}</h3><p>${review.review_content}</p><p>Rating: ${review.score}</p>`;
                reviewItem.addEventListener('click', () => showReviewDetails(review));
                reviewList.appendChild(reviewItem);
            });
            if (response.data.next) {
                document.getElementById('load-more-reviews').dataset.page = page + 1;
                document.getElementById('load-more-reviews').style.display = 'block';
            } else {
                document.getElementById('load-more-reviews').style.display = 'none';
            }
        })
        .catch(error => {
            console.error('Error loading reviews:', error);
        });
}

function loadMoreReviews() {
    const page = parseInt(this.dataset.page);
    loadReviews(page);
}

function showReviewDetails(review) {
    hideAllSections();
    document.getElementById('review-title-detail').textContent = review.store.store_name;
    document.getElementById('review-content-detail').textContent = review.review_content;
    document.getElementById('review-details-section').style.display = 'block';
    loadComments(review.id, 1);
}

function loadComments(reviewId, page) {
    const commentList = document.getElementById('comment-list');
    commentList.innerHTML = '';
    axios.get(`http://127.0.0.1:8000/api/reviews/${reviewId}/comments/?page=${page}`)
        .then(response => {
            const comments = response.data.results;
            comments.forEach(comment => {
                const commentItem = document.createElement('div');
                commentItem.classList.add('comment-item');
                commentItem.innerHTML = `<p>${comment.comment_content}</p>`;
                commentList.appendChild(commentItem);
            });
            if (response.data.next) {
                document.getElementById('create-comment-button').dataset.page = page + 1;
                document.getElementById('create-comment-button').style.display = 'block';
            } else {
                document.getElementById('create-comment-button').style.display = 'none';
            }
        })
        .catch(error => {
            console.error('Error loading comments:', error);
        });
}

function createComment() {
    const content = document.getElementById('comment-content').value;
    const reviewId = document.getElementById('review-details-section').dataset.reviewId;

    axios.post(`http://127.0.0.1:8000/api/reviews/${reviewId}/comment/`, { comment_content: content })
        .then(response => {
            alert('Comment successfully created.');
            loadComments(reviewId, 1);
        })
        .catch(error => {
            console.error('Error creating comment:', error);
            alert('Error creating comment.');
        });
}

function createReview() {
    const title = document.getElementById('review-title').value;
    const content = document.getElementById('review-content').value;

    axios.post('http://127.0.0.1:8000/api/reviews/create/', { store: title, review_content: content, score: '5' })
        .then(response => {
            alert('Review successfully created.');
            loadReviews(1);
        })
        .catch(error => {
            console.error('Error creating review:', error);
            alert('Error creating review.');
        });
}

function hideAllSections() {
    document.getElementById('reviews-section').style.display = 'none';
    document.getElementById('create-review-section').style.display = 'none';
    document.getElementById('review-details-section').style.display = 'none';
}
=======
'use strict';

const reviewListElement = document.getElementById('review-list'); 
const prevButton = document.getElementById('prev-page'); 
const nextButton = document.getElementById('next-page'); 
const currentPageSpan = document.getElementById('current-page'); 

let currentPage = 1;

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
>>>>>>> 5f7149b81666e654544418c6f709dad1a267ce98
