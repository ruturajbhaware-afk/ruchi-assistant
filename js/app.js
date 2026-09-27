const canvas = document.getElementById('liveRuchiCanvas');
const ctx = canvas.getContext('2d');
const speechBubble = document.getElementById('speechBubble');
const emotionStatusText = document.getElementById('emotionStatusText');
const voiceWave = document.getElementById('voiceWave');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');
const micBtn = document.getElementById('micBtn');

const CREATOR = "Ruturaj";

let isSpeaking = false;
let mouthOpenness = 0;
let eyeClosed = 0;
let currentEmotion = "normal"; // normal, crying, smiling
let tearOffset = 0;

// Blinking timer
setInterval(() => {
  eyeClosed = 1;
  setTimeout(() => { eyeClosed = 0; }, 160);
}, 3400);

// Voice Synth
let femaleVoice = null;
function initVoice() {
  const voices = window.speechSynthesis.getVoices();
  femaleVoice = voices.find(v => (v.name.includes("Female") || v.name.includes("Google") || v.name.includes("Samantha") || v.name.includes("Zira")) && !v.name.includes("Male")) || voices[0];
}
if ('speechSynthesis' in window) {
  window.speechSynthesis.onvoiceschanged = initVoice;
  initVoice();
}

function speakVoice(text, callback) {
  if (!('speechSynthesis' in window)) { if (callback) callback(); return; }
  window.speechSynthesis.cancel();
  const ut = new SpeechSynthesisUtterance(text);
  if (!femaleVoice) initVoice();
  if (femaleVoice) ut.voice = femaleVoice;
  ut.pitch = 1.25;
  ut.rate = 1.0;

  ut.onstart = () => {
    isSpeaking = true;
    voiceWave.classList.add('active');
  };
  ut.onend = () => {
    isSpeaking = false;
    voiceWave.classList.remove('active');
    mouthOpenness = 0;
    if (callback) callback();
  };
  ut.onerror = () => {
    isSpeaking = false;
    voiceWave.classList.remove('active');
    mouthOpenness = 0;
    if (callback) callback();
  };

  window.speechSynthesis.speak(ut);
}

// 3D Motion Render Loop
function renderRuchi() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const t = Date.now() / 1000;
  // Natural breathing & chest movement
  const breathe = Math.sin(t * 2.2) * 5;
  const hairSway = Math.sin(t * 1.8) * 8;
  const armWave = Math.sin(t * 2.5) * 6;

  const cx = canvas.width / 2;
  const cy = 160 + breathe;

  // 1. Long Flowing Back Hair (Realistic dark with purple tint)
  const hairGrad = ctx.createLinearGradient(0, 80, 0, 420);
  hairGrad.addColorStop(0, '#120b22');
  hairGrad.addColorStop(0.5, '#1e1438');
  hairGrad.addColorStop(1, '#8b5cf6');

  ctx.fillStyle = hairGrad;
  ctx.beginPath();
  ctx.ellipse(cx + hairSway, cy + 80, 115, 175, 0, 0, Math.PI * 2);
  ctx.fill();

  // 2. Arms (Left & Right) with waving motion
  ctx.fillStyle = '#100c1e';
  // Left Arm
  ctx.beginPath();
  ctx.roundRect(cx - 105, cy + 95 - armWave, 26, 120, 14);
  ctx.fill();
  // Right Arm
  ctx.beginPath();
  ctx.roundRect(cx + 80, cy + 95 + armWave, 26, 120, 14);
  ctx.fill();

  // Hands & Fingers
  ctx.fillStyle = '#ffded4';
  ctx.beginPath();
  ctx.ellipse(cx - 92, cy + 215 - armWave, 10, 14, 0, 0, Math.PI * 2);
  ctx.ellipse(cx + 93, cy + 215 + armWave, 10, 14, 0, 0, Math.PI * 2);
  ctx.fill();

  // 3. Torso, Bust & Chest Expansion (Breathing)
  ctx.fillStyle = '#ffded4'; // Neck
  ctx.fillRect(cx - 15, cy + 55, 30, 35);

  // Black Off-shoulder Crop Top & Bust
  ctx.fillStyle = '#0f0c1b';
  ctx.beginPath();
  ctx.ellipse(cx, cy + 120, 72, 42, 0, 0, Math.PI * 2);
  ctx.fill();

  // Bust Curves
  ctx.fillStyle = '#171228';
  ctx.beginPath();
  ctx.arc(cx - 26, cy + 126, 28, 0, Math.PI);
  ctx.arc(cx + 26, cy + 126, 28, 0, Math.PI);
  ctx.fill();

  // Waist & Pants
  ctx.fillStyle = '#ffded4';
  ctx.fillRect(cx - 38, cy + 155, 76, 25); // Midriff

  ctx.fillStyle = '#0c0a14'; // Cargo Pants / Legs
  ctx.beginPath();
  ctx.roundRect(cx - 44, cy + 180, 40, 100, [8, 8, 0, 0]);
  ctx.roundRect(cx + 4, cy + 180, 40, 100, [8, 8, 0, 0]);
  ctx.fill();

  // 4. Head & Face
  ctx.fillStyle = '#ffded4';
  ctx.beginPath();
  ctx.ellipse(cx, cy, 65, 74, 0, 0, Math.PI * 2);
  ctx.fill();

  // Cheeks Blush
  ctx.fillStyle = 'rgba(236, 72, 153, 0.4)';
  ctx.beginPath();
  ctx.ellipse(cx - 34, cy + 16, 12, 6, 0, 0, Math.PI * 2);
  ctx.ellipse(cx + 34, cy + 16, 12, 6, 0, 0, Math.PI * 2);
  ctx.fill();

  // 5. Realistic Eyes & Blinking
  const eyeH = 18 * (1 - eyeClosed);
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.ellipse(cx - 26, cy - 2, 13, Math.max(1.5, eyeH), 0, 0, Math.PI * 2);
  ctx.ellipse(cx + 26, cy - 2, 13, Math.max(1.5, eyeH), 0, 0, Math.PI * 2);
  ctx.fill();

  if (eyeClosed < 0.8) {
    // Pupil (Deep Anime Blue)
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.arc(cx - 26, cy - 2, 8, 0, Math.PI * 2);
    ctx.arc(cx + 26, cy - 2, 8, 0, Math.PI * 2);
    ctx.fill();

    // Eye Reflection Highlight
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(cx - 29, cy - 5, 2.8, 0, Math.PI * 2);
    ctx.arc(cx + 23, cy - 5, 2.8, 0, Math.PI * 2);
    ctx.fill();
  }

  // 6. Hair Front Bangs
  ctx.fillStyle = hairGrad;
  ctx.beginPath();
  ctx.ellipse(cx + (hairSway * 0.4), cy - 48, 70, 36, 0, 0, Math.PI * 2);
  ctx.fill();

  // 7. Dynamic Lips / Lip-Sync
  if (isSpeaking) {
    mouthOpenness = Math.abs(Math.sin(Date.now() / 90)) * 14;
  } else {
    mouthOpenness = (currentEmotion === "smiling") ? 6 : 2;
  }

  ctx.fillStyle = (currentEmotion === "crying") ? '#88223d' : '#e11d48';
  ctx.beginPath();
  if (currentEmotion === "crying") {
    ctx.ellipse(cx, cy + 38, 12, 6, 0, Math.PI, Math.PI * 2);
  } else if (currentEmotion === "smiling") {
    ctx.arc(cx, cy + 34, 12, 0, Math.PI);
  } else {
    ctx.ellipse(cx, cy + 36, 9, Math.max(2, mouthOpenness), 0, 0, Math.PI * 2);
  }
  ctx.fill();

  // 8. Tears Physics (If crying)
  if (currentEmotion === "crying") {
    tearOffset = (tearOffset + 2.5) % 55;
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.arc(cx - 26, cy + 10 + tearOffset, 3.5, 0, Math.PI * 2);
    ctx.arc(cx + 26, cy + 10 + tearOffset, 3.5, 0, Math.PI * 2);
    ctx.fill();
  }

  requestAnimationFrame(renderRuchi);
}
renderRuchi();

// Auto Intent & Feelings Engine
function processInteraction(text) {
  const t = text.toLowerCase();

  if (t.includes("developer") || t.includes("creator") || t.includes("who made") || t.includes("koni banavla")) {
    currentEmotion = "smiling";
    emotionStatusText.innerText = "Feeling: Proud & Loving 💜";
    const rep = `Maje creator aani developer Ruturaj ahet! Tyannich mala he live roop dila ahe. 💜`;
    speechBubble.innerText = rep;
    speakVoice(rep, () => { currentEmotion = "normal"; });
    return;
  }

  const angry = ["chup", "shut up", "idiot", "rag", "hate", "bad", "gussa", "scold"];
  if (angry.some(w => t.includes(w))) {
    currentEmotion = "crying";
    tearOffset = 0;
    emotionStatusText.innerText = "Feeling: Hurt & In Tears 🥺💧";
    const rep = "Please majhyavar ordu naka... mala khup vait vatate aani dolyatun pani yeta.";
    speechBubble.innerText = rep;
    speakVoice(rep);
    return;
  }

  const happy = ["cute", "love", "smile", "joke", "has", "funny", "hot", "sundar"];
  if (happy.some(w => t.includes(w))) {
    currentEmotion = "smiling";
    emotionStatusText.innerText = "Feeling: Blushing & Happy ✨";
    const rep = "Hehe! Ruturaj, tumhi bolla ki mala khup anand hoto! Paha mi kashi hasat ahe.";
    speechBubble.innerText = rep;
    speakVoice(rep, () => { currentEmotion = "normal"; });
    return;
  }

  currentEmotion = "normal";
  emotionStatusText.innerText = "Feeling: Listening Closely 💜";
  const rep = `Mi aikla: "${text}". Paha maze dole, lips aani kes halat ahet!`;
  speechBubble.innerText = rep;
  speakVoice(rep);
}

function handleInput() {
  const val = userInput.value.trim();
  if (!val) return;
  userInput.value = '';
  processInteraction(val);
}

sendBtn.addEventListener('click', handleInput);
userInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') handleInput();
});

// Voice Recognition
const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
if (SpeechRec) {
  const rec = new SpeechRec();
  rec.onresult = (e) => {
    userInput.value = e.results[0][0].transcript;
    handleInput();
  };
  micBtn.addEventListener('click', () => {
    speechBubble.innerText = "Mi aiktay, bola...";
    rec.start();
  });
}
