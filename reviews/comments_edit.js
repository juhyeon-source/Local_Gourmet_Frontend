'use strict';

function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

const commentId = getQueryParam('commentId');

function getCommentDetails() {
    const token = localStorage.getItem('access');
    if (!token) {
        console.error('로그인이 필요합니다.');
        alert('로그인이 필요합니다.');
        return;
    }
    

    axios.get(`http://ec2-3-38-191-229.ap-northeast-2.compute.amazonaws.com/api/reviews/comments/${commentId}/`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
        .then(response => {
            console.log(response)
            const commentContent = response.data.comment_content;
            console.log(commentContent)
            document.getElementById('comment-content').value = commentContent; 
        })
        .catch(error => {
            console.error('Error fetching comment details:', error);
            alert('댓글 세부 정보를 가져오는 중 오류가 발생했습니다. 콘솔을 확인하세요.');
        });
}


document.getElementById('comment-edit').addEventListener('submit', function(event) {
    event.preventDefault(); 

    const editedContent = document.getElementById('comment-content').value.trim();

    if (editedContent === '') {
        alert('댓글 내용을 입력하세요.');
        return;
    }

    console.log(localStorage)
    const token = localStorage.getItem('access');
    if (!token) {
        console.error('로그인이 필요합니다.');
        alert('로그인이 필요합니다.');
        return;
    }

    const formData = new FormData();
    formData.append('comment_content', editedContent);

    axios.put(`http://ec2-3-38-191-229.ap-northeast-2.compute.amazonaws.com/api/reviews/comments/${commentId}/update/`, formData, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
        .then(response => {
            alert('댓글이 성공적으로 수정되었습니다.');
            displayCommentList();
        })
        .catch(error => {
            console.error('Error updating comment:', error);
            alert('댓글 수정에 실패했습니다. 자세한 내용은 콘솔을 확인하세요.');
        });
});

function displayCommentList() {
    history.back();
}

window.onload = getCommentDetails;
