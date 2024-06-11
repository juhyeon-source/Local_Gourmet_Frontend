'use strict';

function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

const reviewId = getQueryParam('reviewId');

function getReviewDetails() {
    const token = localStorage.getItem('access');
    if (!token) {
        console.error('로그인이 필요합니다.');
        alert('로그인이 필요합니다.');
        return;
    }
    

    axios.get(`http://127.0.0.1:8000/api/reviews/${reviewId}/`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
        .then(response => {
            console.log(response)
            const reviewContent = response.data.review_content;
            document.getElementById('review-content').value = reviewContent; 
            const reviewUsername = response.data.username; 
            console.log(reviewUsername) // juhyeonnn
            if (checkUserPermission(reviewUsername)) {
                document.getElementById('review-edit').style.display = 'block'; 
            } else {
                alert('이 댓글을 수정할 권한이 없습니다.');
                document.getElementById('review-content').disabled = true;
                document.querySelector('#review-edit input[type="submit"]').disabled = true;
            }
        })
        .catch(error => {
            console.error('Error fetching comment details:', error);
            alert('댓글 세부 정보를 가져오는 중 오류가 발생했습니다. 콘솔을 확인하세요.');
        });
}

function checkUserPermission(reviewUsername) {
    const loggedInUserId = getUserId(); 
    console.log(loggedInUserId)
    return loggedInUserId === reviewUsername;
}

// const loggedInUsername = "juhyeonnn"; 
// localStorage.setItem('username', loggedInUsername);


function getUserId() {
    console.log(localStorage)
    return localStorage.getItem('username');
}

document.getElementById('review-edit').addEventListener('submit', function(event) {
    event.preventDefault(); 

    const editedContent = document.getElementById('review-content').value.trim();

    if (editedContent === '') {
        alert('댓글 내용을 입력하세요.');
        return;
    }

    const token = localStorage.getItem('access');
    if (!token) {
        console.error('로그인이 필요합니다.');
        alert('로그인이 필요합니다.');
        return;
    }

    const formData = new FormData();
    formData.append('review_content', editedContent);

    axios.put(`http://127.0.0.1:8000/api/reviews/${reviewId}/update/`, formData, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
        .then(response => {
            alert('리뷰가 성공적으로 수정되었습니다.');
            displayReviewList();
        })
        .catch(error => {
            console.error('Error updating comment:', error);
            alert('리뷰 수정에 실패했습니다. 자세한 내용은 콘솔을 확인하세요.');
        });
});

function displayReviewList() {
    history.back();
}

window.onload = getReviewDetails;
