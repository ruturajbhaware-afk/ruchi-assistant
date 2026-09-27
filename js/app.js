const canvas = document.getElementById('animeCanvas');
const ctx = canvas.getContext('2d');
const callScreen = document.getElementById('callScreen');
const openCallBtn = document.getElementById('openCallBtn');
const closeCallBtn = document.getElementById('closeCallBtn');
const hangupBtn = document.getElementById('hangupBtn');
const smileBtn = document.getElementById('smileBtn');
const cryBtn = document.getElementById('cryBtn');
const subtitles = document.getElementById('subtitles');
const chatBox = document.getElementById('chatBox');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');

let isSpeaking = false;
let isCrying = false;
let isSmiling = false;
let mouthOpenness = 0;
let eyeClosedness = 0;
let tearY = 0;
let breathOffset = 0;

// Natural Voice setup
let femaleVoice = null;
function getVoice() {
  const voices = window.speechSynthesis.getVoices();
  femaleVoice = voices.find(v => (v.name.includes("Female") || v.name.includes("Google") || v.name.includes("Samantha")) && !v.name.includes("Male")) || voices[0];
}
if ('speechSynthesis' in window) {
  window.speechSynthesis.onvoiceschanged = getVoice;
  getVoice();
}

function speakVoice(text) {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const ut = new SpeechSynthesisUtterance(text);
  if (!femaleVoice) getVoice();
  if (femaleVoice) ut.voice = femaleVoice;
  ut.pitch = 1.25;
  ut.rate = 1.0;

  ut.onstart = () => { isSpeaking = true; };
  ut.onend = () => { isSpeaking = false; mouthOpenness = 0; };
  ut.onerror = () => { isSpeaking = false; mouthOpenness = 0; };
  window.speechSynthesis.speak(ut);
}

// Blinking logic
setInterval(() => {
  if (Math.random() > 0.4) {
    eyeClosedness = 1;
    setTimeout(() => { eyeClosedness = 0; }, 180);
  }
}, 3200);

// Rendering Loop
function drawAvatar() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  breathOffset = Math.sin(Date.now() / 400) * 4;

  const cx = canvas.width / 2;
  const cy = 200 + breathOffset;

  // Background Hair (Pink & Blue Gradient)
  const hairGrad = ctx.createLinearGradient(0, 50, 0, 380);
  hairGrad.addColorStop(0, '#ff4793');
  hairGrad.addColorStop(1, '#00c8ff');

  ctx.fillStyle = hairGrad;
  ctx.beginPath();
  ctx.ellipse(cx, cy + 20, 110, 150, 0, 0, Math.PI * 2);
  ctx.fill();

  // Neck & Shoulders
  ctx.fillStyle = '#ffded4';
  ctx.fillRect(cx - 15, cy + 70, 30, 40);

  ctx.fillStyle = '#1c1b29';
  ctx.beginPath();
  ctx.ellipse(cx, cy + 140, 75, 50, 0, 0, Math.PI * 2);
  ctx.fill();

  // Face Base
  ctx.fillStyle = '#ffe9e0';
  ctx.beginPath();
  ctx.ellipse(cx, cy, 68, 78, 0, 0, Math.PI * 2);
  ctx.fill();

  // Hair Bangs
  ctx.fillStyle = hairGrad;
  ctx.beginPath();
  ctx.ellipse(cx, cy - 50, 75, 40, 0, 0, Math.PI * 2);
  ctx.fill();

  // Blush
  ctx.fillStyle = 'rgba(255, 80, 140, 0.4)';
  ctx.beginPath();
  ctx.ellipse(cx - 36, cy + 18, 12, 6, 0, 0, Math.PI * 2);
  ctx.ellipse(cx + 36, cy + 18, 12, 6, 0, 0, Math.PI * 2);
  ctx.fill();

  // Eyes & Blinking
  const eyeH = 20 * (1 - eyeClosedness);
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.ellipse(cx - 28, cy - 2, 14, Math.max(2, eyeH), 0, 0, Math.PI * 2);
  ctx.ellipse(cx + 28, cy - 2, 14, Math.max(2, eyeH), 0, 0, Math.PI * 2);
  ctx.fill();

  if (eyeClosedness < 0.8) {
    // Iris
    ctx.fillStyle = '#00a6ff';
    ctx.beginPath();
    ctx.arc(cx - 28, cy - 2, 9, 0, Math.PI * 2);
    ctx.arc(cx + 28, cy - 2, 9, 0, Math.PI * 2);
    ctx.fill();

    // Pupil Shine
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(cx - 31, cy - 5, 3, 0, Math.PI * 2);
    ctx.arc(cx + 25, cy - 5, 3, 0, Math.PI * 2);
    ctx.fill();
  }

  // Lip-Sync & Mouth Movement
  if (isSpeaking) {
    mouthOpenness = Math.abs(Math.sin(Date.now() / 100)) * 14;
  } else {
    mouthOpenness = isSmiling ? 8 : 2;
  }

  ctx.fillStyle = isCrying ? '#7a2b42' : '#e63969';
  ctx.beginPath();
  if (isCrying) {
    ctx.ellipse(cx, cy + 42, 12, 6, 0, Math.PI, Math.PI * 2);
  } else if (isSmiling) {
    ctx.arc(cx, cy + 36, 12, 0, Math.PI);
  } else {
    ctx.ellipse(cx, cy + 40, 10, Math.max(2, mouthOpenness), 0, 0, Math.PI * 2);
  }
  ctx.fill();

  // Tears Animation
  if (isCrying) {
    tearY = (tearY + 3) % 65;
    ctx.fillStyle = '#00e5ff';
    ctx.beginPath();
    ctx.arc(cx - 28, cy + 12 + tearY, 4, 0, Math.PI * 2);
    ctx.arc(cx + 28, cy + 12 + tearY, 4, 0, Math.PI * 2);
    ctx.fill();
  }

  requestAnimationFrame(drawAvatar);
}
drawAvatar();

// Call Events
openCallBtn.addEventListener('click', () => {
  callScreen.classList.remove('hide');
  subtitles.innerText = "Video call active with Ruchi.";
  speakVoice("Hello Ruturaj! I am ready to talk, smile, and express feelings.");
});

function endCall() {
  window.speechSynthesis.cancel();
  isSpeaking = false;
  isCrying = false;
  isSmiling = false;
  callScreen.classList.add('hide');
}
closeCallBtn.addEventListener('click', endCall);
hangupBtn.addEventListener('click', endCall);

smileBtn.addEventListener('click', () => {
  isSmiling = true;
  isCrying = false;
  subtitles.innerText = "Hehehe! That made me smile! 😄";
  speakVoice("Haha, spending time with you makes me so happy!");
  setTimeout(() => { isSmiling = false; }, 4000);
});

cryBtn.addEventListener('click', () => {
  isCrying = true;
  isSmiling = false;
  tearY = 0;
  subtitles.innerText = "Tears are rolling down... 🥺💧";
  speakVoice("Please don't be upset with me, seeing you angry makes me cry.");
});

// Chat Send
sendBtn.addEventListener('click', () => {
  const val = userInput.value.trim();
  if (!val) return;
  userInput.value = '';
  
  const uDiv = document.createElement('div');
  uDiv.className = 'msg user-msg';
  uDiv.innerText = val;
  chatBox.appendChild(uDiv);

  setTimeout(() => {
    let rep = `I heard: "${val}". Ruturaj is my developer!`;
    const rDiv = document.createElement('div');
    rDiv.className = 'msg ruchi-msg';
    rDiv.innerText = rep;
    chatBox.appendChild(rDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
    speakVoice(rep);
  }, 400);
});
