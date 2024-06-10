'use strict';

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

// 댓글 가져오는 함수
function getComments(reviewId, page) {
    axios.get(`http://127.0.0.1:8000/api/reviews/${reviewId}/comments/?page_size=${page}`)
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
        // if (comment.user_id === loggedInUserId) {
            const editButton = document.createElement('button');
            editButton.textContent = 'Edit';
            // editButton.onclick = () => editComment(comment.id);
            listItem.appendChild(editButton);

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.onclick = () => deleteComment(comment.id);
            listItem.appendChild(deleteButton);
        // }
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
    // comments_edit.html 페이지로 이동
    window.location.href = `comments_edit.html?commentId=${commentId}`;
}

// 페이지가 로드될 때 getReviewDetail 함수를 호출
window.onload = getReviewDetail;
