// 매장 상세 정보 보기 함수
// function getStoreDetail(event) {
//     event.preventDefault(); // 기본 링크 동작 방지
//     const storeId = event.target.dataset.storeId; // 클릭된 매장의 ID 얻어오기
//     console.log(event)
//     axios.get(`http://127.0.0.1:8000/api/stores/${storeId}/`)  // 지정된 매장 ID로 상세 정보 가져옴
//       .then(response => {
//         const store = response.data; // 매장 정보 추출
//         document.getElementById('store-id').textContent = store.id;
//         document.getElementById('store-name').textContent = store.store_name;
//         document.getElementById('store-category').textContent = store.category;
//         document.getElementById('store-phone').textContent = store.phone_number;
//         document.getElementById('store-address').textContent =
//           `${store.address.address_si} ${store.address.address_gu} ${store.address.address_detail}`;
//       })
//       .catch(error => {
//         console.error('Error fetching data:', error);
//       });
//   }

  function getStoreDetail() {
    axios.get(`http://127.0.0.1:8000/api/stores/1/`)  // 지정된 매장 ID로 상세 정보 가져옴
      .then(response => {
        const store = response.data; // 매장 정보 추출
        // document.getElementById('store-id').textContent = store.id;
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

// 페이지 로딩 시 초기 데이터 가져오기
getStoreDetail();