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
const mouthSync = document.getElementById('mouthSync');
const tearsOverlay = document.getElementById('tearsOverlay');
const charWrapper = document.getElementById('charWrapper');
const subtitlesBox = document.getElementById('subtitlesBox');

const CREATOR_NAME = "Ruturaj";

// Find realistic soft female voice
let chosenVoice = null;
function loadNaturalFemaleVoice() {
  const voices = window.speechSynthesis.getVoices();
  chosenVoice = voices.find(v => 
    (v.name.includes("Female") || v.name.includes("Samantha") || v.name.includes("Google UK English Female") || v.name.includes("Zira") || v.name.includes("Victoria") || v.name.includes("Natural")) && !v.name.includes("Male")
  ) || voices.find(v => v.lang.startsWith("en")) || voices[0];
}
if ('speechSynthesis' in window) {
  window.speechSynthesis.onvoiceschanged = loadNaturalFemaleVoice;
  loadNaturalFemaleVoice();
}

function speakNatural(text, callback) {
  if (!('speechSynthesis' in window)) {
    if (callback) callback();
    return;
  }
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  if (!chosenVoice) loadNaturalFemaleVoice();
  if (chosenVoice) utterance.voice = chosenVoice;

  utterance.pitch = 1.2;
  utterance.rate = 0.95;

  utterance.onstart = () => setAvatarState('talking');
  utterance.onend = () => {
    setAvatarState('neutral');
    if (callback) callback();
  };
  utterance.onerror = () => {
    setAvatarState('neutral');
    if (callback) callback();
  };

  window.speechSynthesis.speak(utterance);
}

function setAvatarState(state) {
  charWrapper.classList.remove('happy-bounce');
  tearsOverlay.classList.add('hide');

  if (state === 'happy') {
    charWrapper.classList.add('happy-bounce');
    mouthSync.className = 'live-mouth talking';
  } else if (state === 'crying') {
    tearsOverlay.classList.remove('hide');
    mouthSync.className = 'live-mouth crying';
  } else if (state === 'talking') {
    mouthSync.className = 'live-mouth talking';
  } else {
    mouthSync.className = 'live-mouth neutral';
  }
}

function getRuchiResponse(input) {
  const t = input.toLowerCase();

  // Developer check
  if (t.includes("developer") || t.includes("devloper") || t.includes("creator") || t.includes("koni banavla") || t.includes("kisne banaya") || t.includes("who made")) {
    return {
      text: `My developer and creator is ${CREATOR_NAME}. He designed and gave me life.`,
      state: "happy"
    };
  }

  // Anger / Crying Trigger
  const harsh = ["shut up", "chup", "hate", "scold", "bad girl", "gussa", "rag", "stupid", "idiot"];
  if (harsh.some(w => t.includes(w))) {
    return {
      text: "Please do not be angry with me. It hurts my feelings and makes me cry.",
      state: "crying"
    };
  }

  // Happy / Joke Trigger
  if (t.includes("smile") || t.includes("laugh") || t.includes("happy") || t.includes("joke") || t.includes("has") || t.includes("vinod")) {
    return {
      text: "Hearing that makes me genuinely happy. Spending time with you is wonderful.",
      state: "happy"
    };
  }

  // Greetings
  if (t.includes("hello") || t.includes("hi") || t.includes("hey") || t.includes("namaskar") || t.includes("namaste")) {
    return {
      text: "Hello Ruturaj. I am glad you are here. Tell me, what would you like to talk about?",
      state: "happy"
    };
  }

  return {
    text: `I understood you said: "${input}". Our smart permanent offline memory is now listening.`,
    state: "talking"
  };
}

function processUserText(text) {
  if (!text) return;
  appendMessage(text, 'user');
  subtitlesBox.innerText = `You: ${text}`;

  const res = getRuchiResponse(text);

  setTimeout(() => {
    subtitlesBox.innerText = res.text;
    appendMessage(res.text, 'ruchi');
    setAvatarState(res.state);
    speakNatural(res.text);
  }, 350);
}

function appendMessage(text, sender) {
  const msg = document.createElement('div');
  msg.className = `msg ${sender}-msg`;
  msg.innerText = text;
  chatContainer.appendChild(msg);
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

// User inputs
sendBtn.addEventListener('click', () => {
  const val = userInput.value.trim();
  if (val) { userInput.value = ''; processUserText(val); }
});

userInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    const val = userInput.value.trim();
    if (val) { userInput.value = ''; processUserText(val); }
  }
});

// Call modal
startCallBtn.addEventListener('click', () => {
  videoCallModal.classList.remove('hide');
  subtitlesBox.innerText = "Video Call Connected with Ruchi";
  speakNatural("Hi Ruturaj! Live video call is connected. I am right here with you.");
});

function closeCall() {
  window.speechSynthesis.cancel();
  setAvatarState('neutral');
  videoCallModal.classList.add('hide');
}

endCallBtn.addEventListener('click', closeCall);
hangupBtn.addEventListener('click', closeCall);

btnSmile.addEventListener('click', () => {
  setAvatarState('happy');
  subtitlesBox.innerText = "I love this feeling!";
  speakNatural("You make me feel so happy!", () => setAvatarState('neutral'));
});

btnCry.addEventListener('click', () => {
  setAvatarState('crying');
  subtitlesBox.innerText = "Tears are falling...";
  speakNatural("Why are you making me cry? Please be gentle with me.");
});

// Voice Input
const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
if (SpeechRec) {
  const rec = new SpeechRec();
  rec.onresult = (e) => processUserText(e.results[0][0].transcript);
  const startRec = () => { subtitlesBox.innerText = "Listening..."; rec.start(); };
  callMicBtn.addEventListener('click', startRec);
  voiceChatBtn.addEventListener('click', startRec);
}
