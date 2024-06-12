'use strict';

let loggedInUserId = null;
let loggedInUsername = null;

document.addEventListener('DOMContentLoaded', function () {
    getLoggedInUser(); // 로그인된 유저 정보를 가져오기
});

function getLoggedInUser() {
    const token = localStorage.getItem('access');
    if (!token) {
        console.error('로그인이 필요합니다.');
        return;
    }

    axios.get('https://www.sparta-local-gourmet.store/api/accounts/me/', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
        .then(response => {
            loggedInUserId = response.data.id;
            loggedInUsername = response.data.username;
            localStorage.setItem('username', loggedInUsername);
            // 유저 정보를 성공적으로 가져오면 리뷰 디테일을 가져오는 함수 호출
            getReviewDetail();
        })
        .catch(error => {
            console.error('Error fetching logged-in user data:', error);
        });
}

// URL에서 reviewId를 추출하는 함수
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

const reviewId = getQueryParam('reviewId');

// 리뷰 상세 정보를 가져오는 함수
function getReviewDetail() {
    if (!reviewId) {
        console.error('reviewId is missing in the URL');
        return;
    }

    axios.get(`https://www.sparta-local-gourmet.store/api/reviews/${reviewId}/`)
        .then(response => {
            const review = response.data;
            document.getElementById('store-name').textContent = review.store;
            document.getElementById('username').textContent = review.username;
            document.getElementById('score').textContent = review.score;
            document.getElementById('review-content').textContent = review.review_content;
            document.getElementById('image').innerHTML = `<img src="${review.image}" alt="리뷰 이미지" width="200">`;
            document.getElementById('created-at').textContent = review.created_at;
            document.getElementById('updated-at').textContent = review.updated_at;

            if (review.username === loggedInUsername) {
                const reviewButtons = document.getElementById('review-buttons');
                if (!document.getElementById('edit-button') && !document.getElementById('delete-button')) {
                    const editButton = document.createElement('button');
                    editButton.id = 'edit-button';
                    editButton.textContent = 'Edit';
                    editButton.onclick = () => goToEditReviewPage(review.id);
                    reviewButtons.appendChild(editButton);

                    const deleteButton = document.createElement('button');
                    deleteButton.id = 'delete-button';
                    deleteButton.textContent = 'Delete';
                    deleteButton.onclick = () => deleteReview(review.id);
                    reviewButtons.appendChild(deleteButton);
                }
            }

            // 댓글 가져오기
            getComments(review.id, 1); // 첫 페이지의 댓글을 가져옴
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            alert('Failed to fetch review details. Please check the console for more details.');
        });
}

function goToEditReviewPage(reviewId) {
    window.location.href = `reviews_edit.html?reviewId=${reviewId}`;
}

// 리뷰 삭제 함수
function deleteReview(reviewId) {
    const token = localStorage.getItem('access');
    axios.delete(`https://www.sparta-local-gourmet.store/api/reviews/${reviewId}/destroy/`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
        .then(response => {
            // 여기서 storeId를 가져오는 함수 호출 필요
            const storeId = getStoreIdFromReviewDetail();
            getReviews(storeId, currentPage);
            alert('리뷰가 성공적으로 삭제되었습니다.');
        })
        .catch(error => {
            console.error('Error deleting review:', error);
            alert('리뷰 삭제에 실패했습니다. 자세한 내용은 콘솔을 확인하세요.');
        });
}

function getReviews(storeId, page) {
    axios.get(`https://www.sparta-local-gourmet.store/api/reviews/list/${storeId}/?page_size=${page}`)
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

// storeId를 가져오는 함수
function getStoreIdFromReviewDetail() {
    return getQueryParam('storeId');
}

// 댓글 가져오는 함수
function getComments(reviewId, page) {
    axios.get(`https://www.sparta-local-gourmet.store/api/reviews/${reviewId}/comments/?page_size=${page}`)
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

const commentListElement = document.getElementById('comment-contents');
const commentPrevButton = document.getElementById('comment-prev-page');
const commentNextButton = document.getElementById('comment-next-page');
const commentPageSpan = document.getElementById('comment-current-page');

let commentCurrentPage = 1;

function updateCommentList(commentsData) {
    commentsData.sort((a, b) => b.id - a.id);
    commentListElement.innerHTML = '';
    commentsData.forEach(comment => {
        const listItem = document.createElement('p');
        listItem.textContent = `${comment.username}: ${comment.comment_content}`;
        if (comment.username === loggedInUsername) {
            const editButton = document.createElement('button');
            editButton.textContent = 'Edit';
            editButton.onclick = () => goToEditCommentPage(comment.id);
            listItem.appendChild(editButton);

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.onclick = () => deleteComment(comment.id);
            listItem.appendChild(deleteButton);
        }
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

// 댓글 '수정' 버튼 클릭 시 comments_edit.html로 이동하는 함수
function goToEditCommentPage(commentId) {
    window.location.href = `comments_edit.html?commentId=${commentId}`;
}

// 댓글 삭제 함수
function deleteComment(commentId) {
    const token = localStorage.getItem('access');
    axios.delete(`https://www.sparta-local-gourmet.store/api/reviews/comments/${commentId}/destroy/`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
        .then(response => {
            alert('댓글이 성공적으로 삭제되었습니다.');
            // 댓글 목록을 다시 로드
            getComments(reviewId, commentCurrentPage);
        })
        .catch(error => {
            console.error('Error deleting comment:', error);
            alert('댓글 삭제에 실패했습니다. 자세한 내용은 콘솔을 확인하세요.');
        });
}

// 페이지가 로드될 때 getLoggedInUser 함수를 호출
window.onload = getLoggedInUser;

document.getElementById('comment-form').addEventListener('submit', function (event) {
    event.preventDefault();

    const commentContent = document.getElementById('comment-content').value.trim();

    if (commentContent === '') {
        alert('댓글 내용을 입력하세요.');
        return;
    }

    const token = localStorage.getItem('access');

    const formData = new FormData();
    formData.append('comment_content', commentContent);

    axios.post(`https://www.sparta-local-gourmet.store/api/reviews/${reviewId}/comment/`, formData, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
        }
    })
        .then(response => {
            alert('댓글이 성공적으로 등록되었습니다.');
            document.getElementById('comment-content').value = '';
            getComments(reviewId, commentCurrentPage);
        })
        .catch(error => {
            console.error('Error creating comment:', error);
            alert('댓글 등록에 실패했습니다. 자세한 내용은 콘솔을 확인하세요.');
        });
});
