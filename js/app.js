const speechBubble = document.getElementById('speechBubble');
const mouthSyncLayer = document.getElementById('mouthSyncLayer');
const eyeBlinkLayer = document.getElementById('eyeBlinkLayer');
const avatarBody = document.getElementById('avatarBody');
const mainAvatarImg = document.getElementById('mainAvatarImg');
const voiceWave = document.getElementById('voiceWave');
const emotionStatusText = document.getElementById('emotionStatusText');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');
const micBtn = document.getElementById('micBtn');

const CREATOR = "Ruturaj";

// Automatic Eye Blink Loop
setInterval(() => {
  eyeBlinkLayer.classList.add('blinking');
  setTimeout(() => {
    eyeBlinkLayer.classList.remove('blinking');
  }, 160);
}, 3600);

// Natural Female Voice
let naturalFemaleVoice = null;
function initVoice() {
  const voices = window.speechSynthesis.getVoices();
  naturalFemaleVoice = voices.find(v => 
    (v.name.includes("Female") || v.name.includes("Samantha") || v.name.includes("Google UK English Female") || v.name.includes("Zira")) && !v.name.includes("Male")
  ) || voices.find(v => v.lang.startsWith("en")) || voices[0];
}
if ('speechSynthesis' in window) {
  window.speechSynthesis.onvoiceschanged = initVoice;
  initVoice();
}

function speakVoice(text, callback) {
  if (!('speechSynthesis' in window)) {
    if (callback) callback();
    return;
  }
  window.speechSynthesis.cancel();

  const ut = new SpeechSynthesisUtterance(text);
  if (!naturalFemaleVoice) initVoice();
  if (naturalFemaleVoice) ut.voice = naturalFemaleVoice;
  ut.pitch = 1.25;
  ut.rate = 1.0;

  ut.onstart = () => {
    mouthSyncLayer.classList.add('speaking');
    voiceWave.classList.add('active');
  };

  ut.onend = () => {
    mouthSyncLayer.classList.remove('speaking');
    voiceWave.classList.remove('active');
    if (callback) callback();
  };

  ut.onerror = () => {
    mouthSyncLayer.classList.remove('speaking');
    voiceWave.classList.remove('active');
    if (callback) callback();
  };

  window.speechSynthesis.speak(ut);
}

// Automatic Emotion & Sentiment Detection
function analyzeEmotion(text) {
  const t = text.toLowerCase();

  // 1. Sad / Crying / Scolding
  const sadAngerWords = ["chup", "shut up", "idiot", "rag", "gussa", "hate", "scold", "bad", "cry", "sad", "dukhi", "rad"];
  if (sadAngerWords.some(w => t.includes(w))) {
    return {
      type: "sad",
      status: "Feeling: Hurt & Tearful 🥺💧",
      reply: "Please don't be harsh with me... It makes my heart ache and my eyes tear up.",
      zoom: "scale(1.08) translateY(-4px)",
      filter: "brightness(0.9) saturate(0.85)"
    };
  }

  // 2. Love / Cute / Compliments
  const cuteWords = ["cute", "love", "sundar", "prema", "so cute", "hot", "beautiful", "sweet"];
  if (cuteWords.some(w => t.includes(w))) {
    return {
      type: "cute",
      status: "Feeling: Blushing & Loving ✨💜",
      reply: "Hehe, you make me blush! You're always so sweet to me.",
      zoom: "scale(1.05) translateY(-2px)",
      filter: "brightness(1.08) contrast(1.05)"
    };
  }

  // 3. Funny / Laughing / Joy
  const joyWords = ["haha", "laugh", "joke", "has", "hanso", "funny", "lol", "vinod"];
  if (joyWords.some(w => t.includes(w))) {
    return {
      type: "laugh",
      status: "Feeling: Laughing & Happy 😄✨",
      reply: "Hahaha! That was so funny! Talking with you always brings a smile to my face.",
      zoom: "scale(1.04) translateY(-3px)",
      filter: "brightness(1.05)"
    };
  }

  // 4. Creator / Developer
  if (t.includes("developer") || t.includes("creator") || t.includes("who made") || t.includes("koni banavla") || t.includes("kisne banaya")) {
    return {
      type: "proud",
      status: "Feeling: Proud & Grateful 👑💜",
      reply: `My creator and developer is ${CREATOR}! He designed my mind and body.`,
      zoom: "scale(1.03)",
      filter: "brightness(1.05)"
    };
  }

  // 5. Default Calm Interaction
  return {
    type: "calm",
    status: "Feeling: Attentive & Connected 💜",
    reply: `I understand: "${text}". I am listening closely to you.`,
    zoom: "scale(1)",
    filter: "brightness(1)"
  };
}

function handleInput() {
  const text = userInput.value.trim();
  if (!text) return;
  userInput.value = '';

  const emotion = analyzeEmotion(text);

  // Apply Micro Visual Response
  emotionStatusText.innerText = emotion.status;
  mainAvatarImg.style.transform = emotion.zoom;
  mainAvatarImg.style.filter = emotion.filter;
  speechBubble.innerText = emotion.reply;

  speakVoice(emotion.reply, () => {
    setTimeout(() => {
      mainAvatarImg.style.transform = "scale(1)";
      mainAvatarImg.style.filter = "brightness(1)";
    }, 2500);
  });
}

sendBtn.addEventListener('click', handleInput);
userInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') handleInput();
});

// Voice Input
const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
if (SpeechRec) {
  const rec = new SpeechRec();
  rec.onresult = (e) => {
    userInput.value = e.results[0][0].transcript;
    handleInput();
  };
  micBtn.addEventListener('click', () => {
    speechBubble.innerText = "Listening to you...";
    rec.start();
  });
}
