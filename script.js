let givenLetters = [];
let usedWords = [];
let score = 0;
let timer;
let timeLeft = 60;

function startGame() {
  givenLetters = getRandomEnglishLetters(7);
  usedWords = [];
  score = 0;
  timeLeft = 60;
  document.getElementById("letters").innerText = givenLetters.join(" ");
  document.getElementById("score").innerText = "Score: 0";
  document.getElementById("used-words").innerHTML = "";
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
  input.value = "";

  if (!word) return;

  if (word.length < 2) {
    alert("Word must be at least 2 letters.");
    return;
  }

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
      if (!res.ok) throw new Error("Invalid word");
      return res.json();
    })
    .then(() => {
      usedWords.push(word);
      document.getElementById("used-words").innerHTML += `<li>${word}</li>`;
      score += word.length * 2;
      document.getElementById("score").innerText = `Score: ${score}`;
      givenLetters = getRandomEnglishLetters(7);
      document.getElementById("letters").innerText = givenLetters.join(" ");
    })
    .catch(() => {
      alert("This word is not valid English.");
    });
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
