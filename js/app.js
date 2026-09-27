const speechBubble = document.getElementById('speechBubble');
const mouthOverlay = document.getElementById('mouthOverlay');
const voiceWave = document.getElementById('voiceWave');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');
const micBtn = document.getElementById('micBtn');

const CREATOR = "Ruturaj";

// Emotion replies
const EMOTIONS = {
  happy: "I am so happy to be here with you! 💜",
  thinking: "Hmm, let me think about that for a second...",
  cute: "Hehe, do you really think I'm cute? Thank you! ✨",
  sad: "Please don't say that, it makes my heart feel heavy... 🥺",
  surprised: "Whoa! Really? That totally surprised me!",
  laughing: "Hahaha! That was hilarious! You always make me laugh! 😄"
};

let femaleVoice = null;
function loadVoice() {
  const voices = window.speechSynthesis.getVoices();
  femaleVoice = voices.find(v => (v.name.includes("Female") || v.name.includes("Samantha") || v.name.includes("Zira")) && !v.name.includes("Male")) || voices[0];
}
if ('speechSynthesis' in window) {
  window.speechSynthesis.onvoiceschanged = loadVoice;
  loadVoice();
}

function speakText(text) {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();

  const ut = new SpeechSynthesisUtterance(text);
  if (!femaleVoice) loadVoice();
  if (femaleVoice) ut.voice = femaleVoice;
  ut.pitch = 1.3;
  ut.rate = 1.0;

  ut.onstart = () => {
    mouthOverlay.classList.add('active');
    voiceWave.classList.add('active');
  };

  ut.onend = () => {
    mouthOverlay.classList.remove('active');
    voiceWave.classList.remove('active');
  };

  ut.onerror = () => {
    mouthOverlay.classList.remove('active');
    voiceWave.classList.remove('active');
  };

  window.speechSynthesis.speak(ut);
}

function triggerEmotion(type) {
  const reply = EMOTIONS[type] || "I'm right here with you! 💜";
  speechBubble.innerText = reply;
  speakText(reply);
}

function handleInput() {
  const val = userInput.value.trim();
  if (!val) return;
  userInput.value = '';

  const q = val.toLowerCase();
  let botReply = `I heard: "${val}". Ruturaj is my creator! 💜`;

  if (q.includes("developer") || q.includes("creator") || q.includes("koni banavla") || q.includes("who made")) {
    botReply = `My creator and developer is ${CREATOR}! He designed and built me. 💜`;
    triggerEmotion('cute');
    return;
  }

  speechBubble.innerText = botReply;
  speakText(botReply);
}

sendBtn.addEventListener('click', handleInput);
userInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') handleInput();
});

// Mic Input
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
