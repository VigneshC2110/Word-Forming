let givenLetters = [];
let usedWords = [];
let score = 0;
let timer;
let timeLeft = 60;

function startGame() {
  givenLetters = getRandomEnglishLetters(7);
  document.getElementById("letters").innerText = givenLetters.join(" ");
  document.getElementById("score").innerText = "Score: 0";
  startTimer();
}

function getRandomEnglishLetters(count) {
  const alphabet = "abcdefghijklmnopqrstuvwxyz";
  const selected = [];
  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * alphabet.length);
    selected.push(alphabet[randomIndex]);
  }
  return selected;
}

function submitWord() {
  const input = document.getElementById("word-input");
  const word = input.value.trim().toLowerCase();

  if (!word) return; // Empty word check

  if (!isUsingOnlyGivenLetters(word)) {
    alert("Use only the displayed letters!");
    return;
  }

  if (usedWords.includes(word)) {
    alert("Word already used!");
    return;
  }

  fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
    .then(res => {
      if (!res.ok) {
        alert("This word is not valid!");
        throw new Error("Word not found in dictionary");
      }
      return res.json();
    })
    .then(data => {
      usedWords.push(word);
      document.getElementById("used-words").innerHTML += `<li>${word}</li>`;
      score += word.length * 2;
      document.getElementById("score").innerText = `Score: ${score}`;

      givenLetters = getRandomEnglishLetters(7);
      document.getElementById("letters").innerText = givenLetters.join(" ");
    })
    .catch(() => {
      alert("This word is not valid!");
    });

  input.value = "";
}

function isUsingOnlyGivenLetters(word) {
  const tempLetters = [...givenLetters];
  for (let char of word) {
    const index = tempLetters.indexOf(char);
    if (index === -1) return false;
    tempLetters.splice(index, 1); 
  }
  return true;
}

function startTimer() {
  document.getElementById("timer").innerText = `Time left: ${timeLeft} seconds`;
  timer = setInterval(() => {
    timeLeft--;
    document.getElementById("timer").innerText = `Time left: ${timeLeft} seconds`;
    if (timeLeft <= 0) {
      clearInterval(timer);
      alert(`Time's up! Your final score is: ${score}`);
      location.reload();
    }
  }, 1000);
}

window.onload = startGame;
