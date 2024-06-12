document.getElementById('sendButton').addEventListener('click', sendMessage);

document.getElementById('messageInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

let isLoading = false;

function showLoading() {
    const loadingElement = document.getElementById('loading');
    loadingElement.style.display = 'block';
}

function hideLoading() {
    const loadingElement = document.getElementById('loading');
    loadingElement.style.display = 'none';
}

function sendMessage() {
    const messageInput = document.getElementById('messageInput');
    const messageText = messageInput.value.trim();
    if (messageText === '') return;

    displayMessage(messageText, 'user');
    messageInput.value = '';
    messageInput.focus();

    generateMessage(messageText);
}

function generateMessage(userMessage) {
    if (isLoading) return;
    isLoading = true;
    showLoading();

    axios.post('http://3.38.191.229/api/chatbots/chatbot/', { message: userMessage })

        .then(response => {
            const aiResponse = response.data.message;
            displayMessage(aiResponse, 'ai');
        })
        .catch(error => {
            console.error('Error fetching response: ', error);
            displayMessage('Sorry, there was an error processing your message.', 'ai');
        })
        .finally(() => {
            isLoading = false;
            hideLoading();
        });
}

function displayMessage(message, type) {
    const chatMessages = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('chat-message', type);
    messageDiv.textContent = message;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}
