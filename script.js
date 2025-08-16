function sendMessage() {
    const userInput = document.getElementById('userInput');
    const chatDisplay = document.getElementById('chatDisplay');
    const message = userInput.value.trim();
    
    if (message) {
        // Display user message
        const userDiv = document.createElement('div');
        userDiv.className = 'message user-message';
        userDiv.innerHTML = `<strong>You:</strong> ${message}`;
        chatDisplay.appendChild(userDiv);
        
        // Simulate AI response (replace with actual API call later)
        setTimeout(() => {
            const aiDiv = document.createElement('div');
            aiDiv.className = 'message ai-message';
            aiDiv.innerHTML = `<strong>AI:</strong> This is a demo response. API integration coming soon!`;
            chatDisplay.appendChild(aiDiv);
            chatDisplay.scrollTop = chatDisplay.scrollHeight;
        }, 1000);
        
        userInput.value = '';
        chatDisplay.scrollTop = chatDisplay.scrollHeight;
    }
}

// Allow Enter key to send message
document.getElementById('userInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});
