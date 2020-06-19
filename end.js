const username = document.getElementById("username");
const saveScoreBtn = document.getElementById("saveScoreBtn");
const mostRecentScore = localStorage.getItem("mostRecentScore");
const finalScore = document.getElementById("finalScore");

const highScores = JSON.parse(localStorage.getItem("highScores")) || [];

const MAX_HIGH_SCORES = 5;

finalScore.innerText = mostRecentScore;

username.addEventListener("keyup", () => {
  console.log(username.value);
  //   user can only submit if has input username
  saveScoreBtn.disabled = !username.value;
});

saveHighScore = (e) => {
  e.preventDefault();
  //   console.log("clicked the saved button");

  const score = {
    score: Math.floor(Math.random() * 100),
    name: username.value,
  };
  highScores.push(score);
  //   console.log(score);
  //   console.log(highScores);
  highScores.sort((a, b) => {
    return b.score - a.score;
  });
  //   cut off at index 5 (to keep 5 users)
  highScores.splice(5);
  localStorage.setItem("highScores", JSON.stringify(highScores));
  window.location.assign("/");
};
