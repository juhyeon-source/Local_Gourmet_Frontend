'use strict';

// 웹 페이지 요소 변수 선언
const storeListElement = document.getElementById('store-list'); // 매장 목록을 보여주는 HTML 요소
const prevButton = document.getElementById('prev-page'); // 이전 페이지 버튼
const nextButton = document.getElementById('next-page'); // 다음 페이지 버튼
const currentPageSpan = document.getElementById('current-page'); // 현재 페이지 번호 표시

// 현재 페이지 번호 (초기값 1)
let currentPage = 1;

// 매장 목록 데이터 가져오기 함수
function getStores(page) {
  axios.post(`http://127.0.0.1:8000/api/stores/?page=${page}`)  // 지정된 페이지의 매장 데이터를 API로 가져옴
    .then(response => {
      console.log('API Response:', response);
      const storeData = response.data.results;  // 응답 데이터에서 매장 목록 추출
      updateStoreList(storeData);  // 매장 목록 업데이트 함수 호출
      updatePagination(response.data);  // 페이지 번호 정보 업데이트 함수 호출
    })
    .catch(error => {
      console.error('Error fetching data:', error); // 데이터 가져오기 에러 처리
    });
}

// 매장 목록 업데이트 함수
function updateStoreList(storeData) {
  storeListElement.innerHTML = '';  // 기존 매장 목록 내용 제거
  storeData.forEach(store => {
    const listItem = document.createElement('li');  // 매장 목록 아이템 생성
    const storeLink = document.createElement('a');  // 매장 이름 링크 생성
    storeLink.href = "#";  // 링크 클릭 시 페이지 이동 방지
    storeLink.textContent = store.store_name;  // 매장 이름 표시
    storeLink.dataset.storeId = store.id;  // 매장 ID 데이터 속성으로 저장
    storeLink.addEventListener('click', getStoreDetail);  // 매장 링크 클릭 이벤트 리스너 등록
    listItem.appendChild(storeLink);  // 매장 링크를 목록 아이템에 추가
    storeListElement.appendChild(listItem);  // 목록 아이템을 매장 목록 요소에 추가
  });
}

// 페이지 번호 정보 업데이트 함수
function updatePagination(data) {
  currentPageSpan.textContent = `Page ${currentPage}`;  // 현재 페이지 번호 표시
  prevButton.disabled = currentPage === 1;  // 첫 페이지일 경우 이전 버튼 비활성화
  nextButton.disabled = !data.next;  // 다음 페이지 데이터가 없을 경우 다음 버튼 비활성화
}

// 이벤트 리스너 (한 번만 등록)
prevButton.addEventListener('click', () => {
  if (currentPage > 1) {
    currentPage--;  // 현재 페이지 번호를 1 감소
    getStores(currentPage);  // 감소된 페이지 번호로 매장 데이터 다시 가져옴
  }
});

nextButton.addEventListener('click', () => {
  if (nextButton.disabled === false) { // Next 버튼이 활성화 상태일 경우만 실행
    currentPage++;  // 현재 페이지 번호를 1 증가
    getStores(currentPage);  // 증가된 페이지 번호로 매장 데이터 다시 가져옴
  }
});

// 페이지 로딩 시 초기 데이터 가져오기
getStores(currentPage);

// 매장 상세 정보 보기 함수
function getStoreDetail(event) {
  event.preventDefault(); // 기본 링크 동작 방지
  const storeId = event.target.dataset.storeId; // 클릭된 매장의 ID 얻어오기
  console.log(event)
  axios.get(`http://127.0.0.1:8000/api/stores/${storeId}/`)  // 지정된 매장 ID로 상세 정보 가져옴
    .then(response => {
      const store = response.data; // 매장 정보 추출
      document.getElementById('store-id').textContent = store.id;
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