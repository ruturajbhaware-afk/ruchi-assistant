const chatContainer = document.getElementById('chatContainer');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');
const ruchiAvatar = document.getElementById('ruchiAvatar');
const ruchiStatusText = document.getElementById('ruchiStatusText');

// Detect conversation language style
function detectLanguage(text) {
  const t = text.toLowerCase();

  // Pure Devanagari Hindi vs Marathi
  if (/[अ-ह]/.test(t)) {
    if (t.includes("नमस्ते") || t.includes("कौन") || t.includes("किसने") || t.includes("बनाया") || t.includes("कैसी")) {
      return 'hi';
    }
    return 'mr';
  }

  // Romanized Hindi / Hinglish
  const hiWords = ["kaun", "kisne", "banaya", "kaisa", "kaisi", "kya", "mera", "meri", "namaste", "bhai", "karo"];
  if (hiWords.some(w => t.split(/\s+/).includes(w))) {
    return 'hi_latin';
  }

  // Romanized Marathi / Marlish (English + Marathi mix)
  const mrWords = ["koni", "kon", "kasa", "kashi", "ahes", "ahe", "banavla", "banavle", "tula", "majha", "kay", "sang", "bol"];
  if (mrWords.some(w => t.split(/\s+/).includes(w))) {
    return 'mr_latin';
  }

  // Default English
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

function getSmartReply(text) {
  const t = text.toLowerCase();
  const lang = detectLanguage(text);

  // 1. Developer / Creator questions (Handles misspellings like devloper)
  if (t.includes("developer") || t.includes("devloper") || t.includes("creator") || 
      t.includes("koni banavla") || t.includes("kisne banaya") || t.includes("who made")) {
    
    if (lang === 'mr') return { text: "माझे क्रिएटर आणि डेव्हलपर Ruturaj आहेत! त्यांनीच मला बनवले आहे. 👑✨", emoji: "👑" };
    if (lang === 'mr_latin') return { text: "Majhe developer Ruturaj ahet! Tyannich mala create kela ahe. 👑✨", emoji: "👑" };
    if (lang === 'hi') return { text: "मेरे डेवलपर Ruturaj हैं! उन्होंने ही मुझे बनाया है। 👑✨", emoji: "👑" };
    if (lang === 'hi_latin') return { text: "Mere developer Ruturaj hain! Unhone hi mujhe banaya hai. 👑✨", emoji: "👑" };
    return { text: "My creator and developer is Ruturaj! He built and trained me. 👑✨", emoji: "👑" };
  }

  // 2. Name questions
  if (t.includes("name") || t.includes("nav") || t.includes("naam") || t.includes("who are you") || t.includes("tu kon")) {
    if (lang === 'mr') return { text: "माझे नाव Ruchi AI आहे! मी तुमची स्मार्ट AI मैत्रीण आहे. 🌸", emoji: "🥰" };
    if (lang === 'mr_latin') return { text: "Majha nav Ruchi AI ahe! Mi tumchi personal AI friend ahe. 🌸", emoji: "🥰" };
    if (lang === 'hi') return { text: "मेरा नाम Ruchi AI है! मैं आपकी AI दोस्त हूँ। 🌸", emoji: "🥰" };
    if (lang === 'hi_latin') return { text: "Mera naam Ruchi AI hai! Main aapki AI dost hoon. 🌸", emoji: "🥰" };
    return { text: "I am Ruchi AI, your personal modern AI assistant! 🌸", emoji: "🥰" };
  }

  // 3. Greetings
  if (t.includes("hi") || t.includes("hello") || t.includes("hey") || t.includes("namaskar") || t.includes("namaste")) {
    if (lang === 'mr') return { text: "नमस्कार! बोला, मी काय मदत करू? 🌸", emoji: "😊" };
    if (lang === 'mr_latin') return { text: "Namaskar! Bola, mi tumhala kay madat karu? 🌸", emoji: "😊" };
    if (lang === 'hi') return { text: "नमस्ते! बताइए, मैं आपकी क्या मदद कर सकती हूँ? 🌸", emoji: "😊" };
    if (lang === 'hi_latin') return { text: "Namaste! Batayein, main aapki kya help kar sakti hoon? 🌸", emoji: "😊" };
    return { text: "Hello! How can I help you today? 🌸", emoji: "😊" };
  }

  // 4. Default Fallback response in the matched language
  if (lang === 'mr') return { text: `मला समजले: "${text}". लवकरच मी आणखी उत्तरे देईन!`, emoji: "✨" };
  if (lang === 'mr_latin') return { text: `Mala samajla: "${text}". Lavkarch mi tumhala yacha purna uttar dein!`, emoji: "✨" };
  if (lang === 'hi') return { text: `मुझे समझ आया: "${text}". जल्द ही मैं इसका पूरा जवाब दूँगी!`, emoji: "✨" };
  if (lang === 'hi_latin') return { text: `Mujhe samajh aaya: "${text}". Bahut jald main iska full answer doongi!`, emoji: "✨" };
  return { text: `Understood: "${text}". I will be able to answer this once Gemini API is connected!`, emoji: "✨" };
}

function handleSend() {
  const text = userInput.value.trim();
  if (!text) return;

  appendMessage(text, 'user');
  userInput.value = '';

  setExpression('🤔', 'Thinking...');

  setTimeout(() => {
    const res = getSmartReply(text);
    setExpression(res.emoji, 'Speaking...');
    appendMessage(res.text, 'ruchi');

    setTimeout(() => {
      setExpression('😊', 'Listening...');
    }, 1500);
  }, 500);
}

sendBtn.addEventListener('click', handleSend);
userInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') handleSend();
});
