const startButton = document.querySelector("#startTest");
let container = document.querySelector(".container");
let inputs;
let story;
let typingArea;
let characterSpanElements;
let lastValueIndex = 0;
let cpm = 0;

startButton.addEventListener("click", () => {
  inputs = {
    time: document.querySelector("#timeInput").value,
    level: document.querySelector("#levelInput").value,
  };
  console.log(inputs);
  story = getStory();
  startTest(container, inputs.time);
});

//fetches a random story from shortstories API
function getStory() {
  return fetch("https://shortstories-api.herokuapp.com/")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      story = data.story; //Divide the story into span elements
      insertStory();
      addCurrentClass(0);
    });
}

function insertStory() {
  let stroyInnerHtml = ""; //If user typed the story and time is still left.
  story.split("").forEach((element) => {
    stroyInnerHtml += `<span>${element}</span>`;
  });
  document.querySelector("#storyText").innerHTML = stroyInnerHtml;
  characterSpanElements = document.querySelectorAll("span");
  startTimer();
}

function startTest(container, time) {
  container.innerHTML = `
  <div class="container text-center">
  <h1 id="timer">${time}:00</h1>
</div>
  <div class="card my-4 story-card">
      <div class="card-body" id="storyText">
        Loading...
      </div>
    </div>
    <div class="input-group col-6 mx-auto">
      <input
        type="text"
        class="form-control"
        placeholder="Start Typing"
        aria-label="Start Typing"
        id="typingArea"
        style="opacity:0;"
        autocomplete="off"
      />
    </div>`;
  typingArea = document.querySelector("#typingArea");
  typingArea.focus();
  typingArea.addEventListener("input", userStartTyping);
  typingArea.addEventListener("keydown", backSpace);
}

function backSpace(e) {
  if (e.key === "Backspace") {
    for (let i = lastValueIndex; i < characterSpanElements.length; i++) {
      characterSpanElements[i].classList.remove("correct", "incorrect");
    }
  }
}

function userStartTyping() {
  lastValueIndex = typingArea.value.length - 1;
  //if last charcter of the input === index of story
  if (typingArea.value[lastValueIndex] === story[lastValueIndex]) {
    characterSpanElements[lastValueIndex + 1].classList.add("correct");
  } else {
    characterSpanElements[lastValueIndex + 1].classList.add("incorrect");
  }
  addCurrentClass(lastValueIndex + 1);
  document.querySelector(".active").scrollIntoView();
  cpm += 1;
}

function addCurrentClass(index) {
  characterSpanElements.forEach((element) => {
    element.classList.remove("active");
  });
  characterSpanElements[index + 1].classList.add("active");
}

function startTimer() {
  let currentTime = new Date().getTime();
  let countDownDate = new Date(currentTime + inputs.time * 60 * 1000);
  // console.log(countDownDate);
  let timer = setInterval(function () {
    let now = new Date().getTime();
    let timeLeft = countDownDate - now;
    if (timeLeft < 0) {
      clearInterval(timer);
      showResults();
      return;
    }
    let minutesLeft = Math.floor(timeLeft / (60 * 1000));
    // let secondsLeft = Math.floor((timeLeft % (1000 * 60)) / 1000);
    let secondsLeft = Math.floor(timeLeft / 1000 - minutesLeft * 60);
    document.querySelector("#timer").innerText = `${minutesLeft}:${
      secondsLeft < 10 ? "0" + secondsLeft : secondsLeft
    }`;
  }, 1000);
}

function calculateLevel(netSpeed) {
  if (netSpeed < 40) return "beginner";
  if (netSpeed < 60) return "veteran";
  if (netSpeed < 80) return "hardcore";
  return "pro";
}

function showResults() {
  let grossWordsPerMinute = cpm / 5 / inputs.time;
  let netWordsPerMinute =
    (cpm - document.querySelectorAll(".incorrect").length) / 5 / inputs.time;
  container.innerHTML = `
    <div class="card">
    <h5 class="card-header">Your Results are here:</h5>
    <div class="card-body">
      <h5 class="card-title">
        Your typing speed is of a <span class="${calculateLevel(
          netWordsPerMinute
        )}-speed">${calculateLevel(netWordsPerMinute)}</span>.
      </h5>
      <p class="card-text">Total Characters Typed: ${cpm}
      <br />Gross Words Per Minute: ${grossWordsPerMinute}
      <br />Net Words Per Minute: ${netWordsPerMinute}</p>
      <input
        type="range"
        class="form-range"
        id="disabledRange"
        min="0"
        max="160"
        value="${netWordsPerMinute}"
        style="pointer-events: none"
      />
      <div class="progress" style="position: relative; height: 30px">
        <div
          class="progress-bar"
          role="progressbar"
          style="width: 25%"
          aria-valuenow="15"
          aria-valuemin="0"
          aria-valuemax="100"
          data-bs-toggle="tooltip"
          data-bs-placement="top"
          title="WPM<40"
        >
          Beginner
        </div>
        <div
          class="progress-bar bg-success"
          role="progressbar"
          style="width: 35%"
          aria-valuenow="15"
          aria-valuemin="0"
          aria-valuemax="100"
          data-bs-toggle="tooltip"
          data-bs-placement="top"
          title="WPM<60"
        >
          Veteran
        </div>
        <div
          class="progress-bar bg-warning"
          role="progressbar"
          style="width: 25%"
          aria-valuenow="30"
          aria-valuemin="0"
          aria-valuemax="100"
          data-bs-toggle="tooltip"
          data-bs-placement="top"
          title="WPM<80"
        >
          Hardcore
        </div>
        <div
          class="progress-bar bg-danger"
          role="progressbar"
          style="width: 15%"
          aria-valuenow="20"
          aria-valuemin="0"
          aria-valuemax="100"
          data-bs-toggle="tooltip"
          data-bs-placement="top"
          title="Let's not talk about it"
        >
          Pro
        </div>
      </div>
    </div>
  </div>`;
}
