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