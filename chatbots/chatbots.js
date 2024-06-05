// 'sendButton' 버튼을 클릭하면 sendMessage 함수 실행
document.getElementById('sendButton').addEventListener('click', sendMessage);

// 'messageInput' 입력 필드에서 Enter 키를 누르면 sendMessage 함수 실행
document.getElementById('messageInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

let isLoading = false; // 메시지가 로딩 중인지 여부를 나타내는 변수

// 로딩 아이콘을 표시하는 함수
function showLoading() {
    const loadingElement = document.getElementById('loading');
    loadingElement.style.display = 'block'; // 로딩 아이콘을 표시
}

// 로딩 아이콘을 숨기는 함수
function hideLoading() {
    const loadingElement = document.getElementById('loading');
    loadingElement.style.display = 'none'; // 로딩 아이콘을 숨김
}

// 사용자가 메시지를 입력하고 전송하는 함수
function sendMessage() {
    const messageInput = document.getElementById('messageInput'); // 입력 필드 가져오기
    const messageText = messageInput.value.trim(); // 입력된 메시지 가져오기 및 공백 제거
    if (messageText === '') return; // 메시지가 비어 있으면 함수 종료

    displayMessage(messageText, 'user'); // 입력된 메시지를 채팅창에 사용자 메시지로 표시
    messageInput.value = ''; // 입력 필드를 초기화
    messageInput.focus(); // 입력 필드에 포커스

    generateMessage(messageText); // 서버에 메시지를 보내고 응답을 받아 처리
}

// 서버에 메시지를 보내고 AI 응답을 받는 함수
function generateMessage(userMessage) {
    if (isLoading) return; // 이미 로딩 중이면 함수를 실행하지 않음
    isLoading = true; // 로딩 상태로 설정
    showLoading(); // 로딩 아이콘 표시

    axios.post('http://127.0.0.1:8000/api/chatbots/chatbot/', { message: userMessage }) // 서버에 POST 요청
        .then(response => {
            const aiResponse = response.data.message; // 서버로부터 응답 받음
            displayMessage(aiResponse, 'ai'); // AI의 응답을 채팅창에 표시
        })
        .catch(error => {
            console.error('Error fetching response: ', error); // 오류 발생 시 콘솔에 출력
            displayMessage('Sorry, there was an error processing your message.', 'ai'); // 오류 메시지를 채팅창에 표시
        })
        .finally(() => {
            isLoading = false; // 로딩 상태 해제
            hideLoading(); // 로딩 아이콘 숨김
        });
}

// 메시지를 채팅창에 표시하는 함수
function displayMessage(message, type) {
    const chatMessages = document.getElementById('chatMessages'); // 채팅 메시지 영역 가져오기
    const messageDiv = document.createElement('div'); // 새로운 div 요소 생성
    messageDiv.classList.add('chat-message', type); // 메시지 타입에 따라 클래스 추가 (user 또는 ai)
    messageDiv.textContent = message; // 메시지 내용 설정
    chatMessages.appendChild(messageDiv); // 채팅 메시지 영역에 추가
    chatMessages.scrollTop = chatMessages.scrollHeight; // 새 메시지가 추가될 때마다 스크롤을 맨 아래로 이동
}
