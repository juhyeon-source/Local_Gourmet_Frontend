'use strict';

function searchStores() {
    const searchQuery = document.getElementById('store-search').value;
    if (searchQuery.length < 2) {
        return; // 최소 2글자 입력 후 검색 시작
    }

    axios.get(`http://3.38.191.229/api/stores/?search=${searchQuery}`)
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

function postReview(event) {
    event.preventDefault(); // 폼 제출을 막음

    const formData = new FormData(event.target);
    const imageInput = document.getElementById('image');
    if (imageInput && imageInput.files && imageInput.files.length > 0) {
        formData.append('image', imageInput.files[0]);
    }

    const token = localStorage.getItem('access');
    if (!token) {
        alert('로그인이 필요합니다.');
        return;
    }

    axios.post('http://3.38.191.229/api/reviews/create/', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
        }
    })
        .then(response => {
            alert('리뷰가 성공적으로 제출되었습니다!');
            const newReview = response.data;
            // 리뷰 작성 후 매장 상세 페이지로 리디렉션
            const storeId = document.getElementById('store').value;
            window.location.href = `../stores/stores_detail.html?storeId=${storeId}`;
        })
        .catch(error => {
            console.error('Error posting review:', error);
            if (error.response && error.response.data) {
                console.error('Server response:', error.response.data);
            }
        });
}
