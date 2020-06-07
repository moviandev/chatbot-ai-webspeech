const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

const recognition = new SpeechRecognition();
recognition.lang = 'pt-BR';
recognition.interimResults = false;

const socket = io();

document.querySelector('button').addEventListener('click', () => {
  recognition.start();
});

recognition.addEventListener('result', (e) => {
  let last = e.results.length - 1;
  let text = e.results[last][0].transcript;

  console.log(`Confidence: ${e.results[0][0].confidence}`);

  socket.emit('chat message', text);

  socket.on('bot reply', (replyText) => {
    synthVoice(replyText);
  });
});

function synthVoice(text) {
  console.log(text);
  const synth = window.speechSynthesis;
  const utterance = new SpeechSynthesisUtterance();
  utterance.text = text;
  utterance.lang = 'pt-BR';
  synth.speak(utterance);
}
