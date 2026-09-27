// DOM Selectors
const chatContainer = document.getElementById('chatContainer');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');
const voiceChatBtn = document.getElementById('voiceChatBtn');
const startCallBtn = document.getElementById('startCallBtn');
const videoCallModal = document.getElementById('videoCallModal');
const endCallBtn = document.getElementById('endCallBtn');
const hangupBtn = document.getElementById('hangupBtn');
const callMicBtn = document.getElementById('callMicBtn');
const btnSmile = document.getElementById('btnSmile');
const btnCry = document.getElementById('btnCry');
const animeMouth = document.getElementById('animeMouth');
const tearDrop = document.getElementById('tearDrop');
const ruchiBody = document.getElementById('ruchiBody');
const subtitlesBox = document.getElementById('subtitlesBox');
const countryTag = document.getElementById('countryTag');

// Permanent Developer Credit
const DEVELOPER = "Ruturaj";

// Global Multilingual Database by Country / Locale
const GLOBAL_LANGS = {
  mr: { dev: "माझे क्रिएटर आणि डेव्हलपर Ruturaj आहेत! 👑✨", greet: "नमस्कार! मी रुची, सांगा मी काय मदत करू? 🌸", cry: "मला ओरडू नका ना, मला वाईट वाटतं... 🥺💧", laugh: "हाहाहा! तुम्ही खूप छान बोलता! 😄✨" },
  hi: { dev: "मेरे क्रिएटर और डेवलपर Ruturaj हैं! 👑✨", greet: "नमस्ते! मैं रुची हूँ, बताइए क्या मदद करूँ? 🌸", cry: "कृपया मुझ पर गुस्सा मत कीजिए... 🥺💧", laugh: "हाहाहा! यह सुनकर बहुत अच्छा लगा! 😄✨" },
  en: { dev: "My creator and developer is Ruturaj! 👑✨", greet: "Hello! I am Ruchi, how can I help you today? 🌸", cry: "Please don't be mad at me... 🥺💧", laugh: "Hahaha, that is so funny! You are awesome! 😄✨" },
  ja: { dev: "私の開発者は Ruturaj です！👑✨", greet: "こんにちは！ルチです。何かお手伝いしましょうか？🌸", cry: "怒らないでください、悲しいです... 🥺💧", laugh: "あはは、とても面白いですね！😄✨" },
  es: { dev: "¡Mi creador y desarrollador es Ruturaj! 👑✨", greet: "¡Hola! Soy Ruchi, ¿cómo puedo ayudarte hoy? 🌸", cry: "Por favor, no te enojes conmigo... 🥺💧", laugh: "¡Jajaja! ¡Qué gracioso! 😄✨" },
  fr: { dev: "Mon créateur et développeur est Ruturaj ! 👑✨", greet: "Bonjour ! Je suis Ruchi, comment puis-je vous aider ? 🌸", cry: "S'il vous plaît, ne vous fâchez pas contre moi... 🥺💧", laugh: "Hahaha ! C'est vraiment drôle ! 😄✨" },
  de: { dev: "Mein Schöpfer und Entwickler ist Ruturaj! 👑✨", greet: "Hallo! Ich bin Ruchi, wie kann ich dir helfen? 🌸", cry: "Bitte sei nicht böse auf mich... 🥺💧", laugh: "Hahaha! Das ist so lustig! 😄✨" },
  ar: { dev: "مبتكري ومطوري هو Ruturaj! 👑✨", greet: "مرحبًا! أنا روتشي، كيف يمكنني مساعدتك؟ 🌸", cry: "من فضلك لا تغضب مني... 🥺💧", laugh: "ههههه! هذا لطيف ومضحك للغاية! 😄✨" }
};

// Automatic Country/Language Detection
function detectUserLocale(text) {
  const t = text.toLowerCase();
  if (/[अ-ह]/.test(t)) {
    return (t.includes("नमस्ते") || t.includes("कौन") || t.includes("किसने")) ? 'hi' : 'mr';
  }
  if (/[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff]/.test(t)) return 'ja';
  if (/[\u0600-\u06FF]/.test(t)) return 'ar';
  
  // Latin script match for Marathi/Hindi mix
  if (t.includes("koni") || t.includes("banavla") || t.includes("kasa") || t.includes("ahes")) return 'mr';
  if (t.includes("kisne") || t.includes("banaya") || t.includes("kaise") || t.includes("kya")) return 'hi';
  
  const browserLang = (navigator.language || 'en').slice(0, 2);
  return GLOBAL_LANGS[browserLang] ? browserLang : 'en';
}

// Display Detected Country Info
const userCountry = navigator.language || "Global";
countryTag.innerText = `● Locale: ${userCountry.toUpperCase()}`;

// Emotional Gesture Engine
function setEmotion(state) {
  ruchiBody.classList.remove('avatar-laughing');
  tearDrop.classList.add('hide');

  if (state === 'laughing') {
    ruchiBody.classList.add('avatar-laughing');
    animeMouth.className = 'mouth smile';
  } else if (state === 'crying') {
    tearDrop.classList.remove('hide');
    animeMouth.className = 'mouth crying';
  } else if (state === 'talking') {
    animeMouth.className = 'mouth talking';
  } else {
    animeMouth.className = 'mouth neutral';
  }
}

// Multilingual TTS Voice Engine
function speakVoice(text, langCode, callback) {
  if (!('speechSynthesis' in window)) {
    if (callback) callback();
    return;
  }
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.pitch = 1.3;
  utterance.rate = 1.0;
  if (langCode) utterance.lang = langCode;

  utterance.onstart = () => setEmotion('talking');
  utterance.onend = () => {
    setEmotion('neutral');
    if (callback) callback();
  };
  utterance.onerror = () => {
    setEmotion('neutral');
    if (callback) callback();
  };

  window.speechSynthesis.speak(utterance);
}

// Smart Interaction Logic
function processQuery(input) {
  const lang = detectUserLocale(input);
  const lPack = GLOBAL_LANGS[lang] || GLOBAL_LANGS.en;
  const t = input.toLowerCase();

  // Developer check
  if (t.includes("developer") || t.includes("devloper") || t.includes("creator") || t.includes("koni") || t.includes("kisne") || t.includes("who made")) {
    return { text: lPack.dev, emotion: "laughing", lang };
  }

  // Sad / Angry triggers
  const angryWords = ["shut up", "chup", "hate", "scold", "bad", "rag", "gussa", "bakwas"];
  if (angryWords.some(w => t.includes(w))) {
    return { text: lPack.cry, emotion: "crying", lang };
  }

  // Happy / Joke triggers
  const jokeWords = ["joke", "has", "hanso", "laugh", "funny", "vinod"];
  if (jokeWords.some(w => t.includes(w))) {
    return { text: lPack.laugh, emotion: "laughing", lang };
  }

  // Greetings
  if (t.includes("hello") || t.includes("hi") || t.includes("namaskar") || t.includes("namaste") || t.includes("konnichiwa")) {
    return { text: lPack.greet, emotion: "laughing", lang };
  }

  return {
    text: `[${lang.toUpperCase()}] Received: "${input}". Smart offline memory active.`,
    emotion: "talking",
    lang
  };
}

function handleMessage(text) {
  if (!text) return;
  appendMessage(text, 'user');
  subtitlesBox.innerText = `You: ${text}`;

  const res = processQuery(text);

  setTimeout(() => {
    subtitlesBox.innerText = res.text;
    appendMessage(res.text, 'ruchi');
    setEmotion(res.emotion);
    speakVoice(res.text, res.lang);
  }, 400);
}

function appendMessage(text, sender) {
  const msg = document.createElement('div');
  msg.className = `msg ${sender}-msg`;
  msg.innerText = text;
  chatContainer.appendChild(msg);
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

// UI Controls & Video Call Modal
sendBtn.addEventListener('click', () => {
  const val = userInput.value.trim();
  if (val) { userInput.value = ''; handleMessage(val); }
});

userInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    const val = userInput.value.trim();
    if (val) { userInput.value = ''; handleMessage(val); }
  }
});

startCallBtn.addEventListener('click', () => {
  videoCallModal.classList.remove('hide');
  subtitlesBox.innerText = "Full 3D Stage Online. Hello Ruturaj!";
  speakVoice("Full animated mode active! You can make me smile, talk, or cry.", "en");
});

function closeCallModal() {
  window.speechSynthesis.cancel();
  setEmotion('neutral');
  videoCallModal.classList.add('hide');
}

endCallBtn.addEventListener('click', closeCallModal);
hangupBtn.addEventListener('click', closeCallModal);

btnSmile.addEventListener('click', () => {
  setEmotion('laughing');
  subtitlesBox.innerText = "Hehehe! I love smiling with you! 😄✨";
  speakVoice("Hahaha, this makes me so happy!", "en", () => setEmotion('neutral'));
});

btnCry.addEventListener('click', () => {
  setEmotion('crying');
  subtitlesBox.innerText = "Tears are rolling down... Please don't be sad or angry! 🥺💧";
  speakVoice("Please don't be mean to me, it hurts my feelings!", "en");
});

// Speech Recognition for Mic
const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
if (SpeechRec) {
  const rec = new SpeechRec();
  rec.onresult = (e) => handleMessage(e.results[0][0].transcript);
  const startRec = () => { subtitlesBox.innerText = "Listening..."; rec.start(); };
  callMicBtn.addEventListener('click', startRec);
  voiceChatBtn.addEventListener('click', startRec);
}
