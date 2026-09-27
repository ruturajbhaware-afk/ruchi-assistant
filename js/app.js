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

const animeLips = document.getElementById('animeLips');
const tearsWrap = document.getElementById('tearsWrap');
const charBody = document.getElementById('charBody');
const subtitlesBox = document.getElementById('subtitlesBox');

const CREATOR_NAME = "Ruturaj";

// Natural Female Voice Selector
let naturalVoice = null;
function initVoice() {
  const voices = window.speechSynthesis.getVoices();
  naturalVoice = voices.find(v => 
    (v.name.includes("Female") || v.name.includes("Samantha") || v.name.includes("Google UK English Female") || v.name.includes("Zira")) && !v.name.includes("Male")
  ) || voices.find(v => v.lang.startsWith("en")) || voices[0];
}
if ('speechSynthesis' in window) {
  window.speechSynthesis.onvoiceschanged = initVoice;
  initVoice();
}

// Lip-Sync Voice Player
function speakWithLipSync(text, callback) {
  if (!('speechSynthesis' in window)) {
    if (callback) callback();
    return;
  }

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  if (!naturalVoice) initVoice();
  if (naturalVoice) utterance.voice = naturalVoice;

  utterance.pitch = 1.25;
  utterance.rate = 1.0;

  // Real-time lip-sync start and end
  utterance.onstart = () => {
    animeLips.className = 'dynamic-lips talking';
  };

  utterance.onend = () => {
    animeLips.className = 'dynamic-lips neutral';
    if (callback) callback();
  };

  utterance.onerror = () => {
    animeLips.className = 'dynamic-lips neutral';
    if (callback) callback();
  };

  window.speechSynthesis.speak(utterance);
}

// Emotion State Controller
function setAvatarEmotion(emotion) {
  charBody.classList.remove('char-laugh');
  tearsWrap.classList.add('hide');

  if (emotion === 'laugh') {
    charBody.classList.add('char-laugh');
    animeLips.className = 'dynamic-lips smile';
  } else if (emotion === 'cry') {
    tearsWrap.classList.remove('hide');
    animeLips.className = 'dynamic-lips crying';
  } else if (emotion === 'talk') {
    animeLips.className = 'dynamic-lips talking';
  } else {
    animeLips.className = 'dynamic-lips neutral';
  }
}

// Response & Intent Engine
function getResponse(query) {
  const q = query.toLowerCase();

  if (q.includes("developer") || q.includes("creator") || q.includes("koni banavla") || q.includes("who made")) {
    return {
      text: `My creator and developer is ${CREATOR_NAME}. He created and brought me to life!`,
      emotion: 'laugh'
    };
  }

  const harshWords = ["shut up", "chup", "hate", "scold", "bad", "rag", "stupid", "idiot"];
  if (harshWords.some(w => q.includes(w))) {
    return {
      text: "Please do not shout at me... It makes my eyes fill with tears.",
      emotion: 'cry'
    };
  }

  if (q.includes("smile") || q.includes("laugh") || q.includes("joke") || q.includes("has") || q.includes("happy")) {
    return {
      text: "Hahaha, you have such a wonderful sense of humor! I am smiling with you.",
      emotion: 'laugh'
    };
  }

  return {
    text: `I heard you say: "${query}". I am active and ready for your next word.`,
    emotion: 'talk'
  };
}

function handleInput(text) {
  if (!text) return;
  appendMessage(text, 'user');
  subtitlesBox.innerText = `You: ${text}`;

  const res = getResponse(text);

  setTimeout(() => {
    subtitlesBox.innerText = res.text;
    appendMessage(res.text, 'ruchi');
    setAvatarEmotion(res.emotion);
    speakWithLipSync(res.text, () => {
      if (res.emotion !== 'cry') setAvatarEmotion('neutral');
    });
  }, 350);
}

function appendMessage(text, sender) {
  const msg = document.createElement('div');
  msg.className = `msg ${sender}-msg`;
  msg.innerText = text;
  chatContainer.appendChild(msg);
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Event Bindings
sendBtn.addEventListener('click', () => {
  const val = userInput.value.trim();
  if (val) { userInput.value = ''; handleInput(val); }
});

userInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    const val = userInput.value.trim();
    if (val) { userInput.value = ''; handleInput(val); }
  }
});

startCallBtn.addEventListener('click', () => {
  videoCallModal.classList.remove('hide');
  subtitlesBox.innerText = "Connecting video stage...";
  speakWithLipSync("Hello Ruturaj! Live video is now online. Notice my eyes blinking and lips moving as I speak.");
});

function closeCall() {
  window.speechSynthesis.cancel();
  setAvatarEmotion('neutral');
  videoCallModal.classList.add('hide');
}

endCallBtn.addEventListener('click', closeCall);
hangupBtn.addEventListener('click', closeCall);

btnSmile.addEventListener('click', () => {
  setAvatarEmotion('laugh');
  subtitlesBox.innerText = "Hehehe! I am so happy!";
  speakWithLipSync("Hahaha, thank you for making me smile!", () => setAvatarEmotion('neutral'));
});

btnCry.addEventListener('click', () => {
  setAvatarEmotion('cry');
  subtitlesBox.innerText = "Tears are rolling down...";
  speakWithLipSync("Please don't be upset with me, I am crying...");
});

// Mic Input
const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
if (SpeechRec) {
  const rec = new SpeechRec();
  rec.onresult = (e) => handleInput(e.results[0][0].transcript);
  const startRec = () => { subtitlesBox.innerText = "Listening..."; rec.start(); };
  callMicBtn.addEventListener('click', startRec);
  voiceChatBtn.addEventListener('click', startRec);
}
