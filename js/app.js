const chatContainer = document.getElementById('chatContainer');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');
const ruchiAvatar = document.getElementById('ruchiAvatar');
const ruchiStatusText = document.getElementById('ruchiStatusText');

function setExpression(emoji, status) {
  ruchiAvatar.innerHTML = `<span class="expression">${emoji}</span>`;
  ruchiStatusText.innerText = status;
}

function appendMessage(text, sender) {
  const msgDiv = document.createElement('div');
  msgDiv.className = `msg ${sender}-msg`;
  msgDiv.innerText = text;
  chatContainer.appendChild(msgDiv);
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

function handleSend() {
  const text = userInput.value.trim();
  if (!text) return;

  appendMessage(text, 'user');
  userInput.value = '';

  // Ruchi विचार करत आहे
  setExpression('🤔', 'रुची विचार करत आहे...');

  setTimeout(() => {
    // Ruchi उत्तर देत आहे
    setExpression('🗣️', 'रुची बोलत आहे...');
    appendMessage("मी तुमचे ऐकले! लवकरच मी आणखी हुशार होणार आहे. ✨", 'ruchi');
    
    setTimeout(() => {
      // पूर्ववत सामान्य भाव
      setExpression('😊', 'मी ऐकतेय, बोला...');
    }, 1500);
  }, 1000);
}

sendBtn.addEventListener('click', handleSend);
userInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') handleSend();
});
