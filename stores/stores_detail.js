function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  console.log(urlParams);
  console.log('storeId :', urlParams.get(param));
  return urlParams.get(param);
}

function getStoreDetail() {
  const storeId = getQueryParam('storeId'); // 쿼리 파라미터에서 storeId를 가져옴

  if (!storeId) {
    console.error('storeId is missing in the URL');
    return;
  }

  axios.get(`http://127.0.0.1:8000/api/stores/${storeId}/`) // 지정된 매장 ID로 상세 정보 가져옴
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

// 페이지가 로드될 때 getStoreDetail 함수를 호출
window.onload = getStoreDetail;
