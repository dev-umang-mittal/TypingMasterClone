const startButton = document.querySelector("#startTest");
let container = document.querySelector(".container");
let inputs;
let story;
let currentStoryIndex = 0;
let typingArea;
let characterSpanElements;
let lastValueIndex = 0;

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
    });
}

function insertStory() {
  let stroyInnerHtml = "";
  story.split("").forEach((element) => {
    stroyInnerHtml += `<span>${element}</span>`;
  });
  document.querySelector("#storyText").innerHTML = stroyInnerHtml;
  characterSpanElements = document.querySelectorAll("span");
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
      <button class="btn btn-outline-secondary" type="button">
        <i class="fa-solid fa-repeat"></i>
      </button>
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
  if (typingArea.value.length === 0) {
    addCurrentClass(0);
    return;
  }
  lastValueIndex = typingArea.value.length - 1;
  //if last charcter of the input === index of story
  if (typingArea.value[lastValueIndex] === story[lastValueIndex]) {
    characterSpanElements[lastValueIndex + 1].classList.add("correct");
    characterSpanElements[lastValueIndex + 1].classList.remove("incorrect");
  } else {
    characterSpanElements[lastValueIndex + 1].classList.add("incorrect");
    characterSpanElements[lastValueIndex + 1].classList.remove("correct");
  }
  addCurrentClass(lastValueIndex + 1);
  currentStoryIndex += 1;
  document.querySelector(".active").scrollIntoView();
}

function addCurrentClass(index) {
  characterSpanElements.forEach((element) => {
    element.classList.remove("active");
  });
  characterSpanElements[index + 1].classList.add("active");
}

function appendResults() {
  console.log("Result");
}
