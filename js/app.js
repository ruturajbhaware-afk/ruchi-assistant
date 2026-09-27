const chatContainer = document.getElementById('chatContainer');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');
const ruchiAvatar = document.getElementById('ruchiAvatar');
const ruchiStatusText = document.getElementById('ruchiStatusText');

// Permanent Developer Memory
const DEV_INFO = {
  name: "Ruturaj",
  role: "Creator & Developer",
  responses: {
    mr: "माझे क्रिएटर आणि डेव्हलपर Ruturaj आहेत! त्यांनीच मला तयार केले आहे. 👑✨",
    hi: "मेरे क्रिएटर और डेवलपर Ruturaj हैं! उन्होंने ही मुझे बनाया है। 👑✨",
    en: "My creator and developer is Ruturaj! He built and designed me. 👑✨"
  }
};

function detectLang(text) {
  const t = text.toLowerCase();
  if (/[अ-ह]/.test(t)) {
    if (t.includes("कौन") || t.includes("किसने") || t.includes("बनाया") || t.includes("नमस्ते")) return 'hi';
    return 'mr';
  }
  return 'en';
}

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

function getReply(query) {
  const q = query.toLowerCase();
  const lang = detectLang(query);

  // Developer check across keywords
  const devKeywords = ["developer", "creator", "banavla", "banavle", "who made", "owner", "malak", "kon ahe"];
  if (devKeywords.some(k => q.includes(k))) {
    return { text: DEV_INFO.responses[lang] || DEV_INFO.responses.mr, emoji: "👑" };
  }

  // Basic multilingual greetings
  if (q.includes("namaskar") || q.includes("hello") || q.includes("hi") || q.includes("नमस्ते")) {
    const greet = {
      mr: "नमस्कार! मी तुमची Ruchi, बोला काय मदत करू? 🌸",
      hi: "नमस्ते! मैं आपकी Ruchi, बताइए क्या मदद करूँ? 🌸",
      en: "Hello! I am Ruchi, how can I help you? 🌸"
    };
    return { text: greet[lang] || greet.mr, emoji: "🥰" };
  }

  return null;
}

function handleSend() {
  const text = userInput.value.trim();
  if (!text) return;

  appendMessage(text, 'user');
  userInput.value = '';

  setExpression('🤔', 'विचार करत आहे...');

  setTimeout(() => {
    const match = getReply(text);
    if (match) {
      setExpression(match.emoji, 'बोलत आहे...');
      appendMessage(match.text, 'ruchi');
    } else {
      setExpression('🌸', 'बोलत आहे...');
      appendMessage(`"${text}" - हे मी लक्षात ठेवले आहे! लवकरच API द्वारे पूर्ण उत्तर मिळेल.`, 'ruchi');
    }

    setTimeout(() => {
      setExpression('😊', 'मी ऐकतेय, बोला...');
    }, 1500);
  }, 600);
}

sendBtn.addEventListener('click', handleSend);
userInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') handleSend();
});
