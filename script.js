const startButton = document.querySelector("#startTest");
let container = document.querySelector(".container");
let inputs;
let story;
let currentStoryIndex = 0;
let typingArea;
let characterSpanElements;

startButton.addEventListener("click", () => {
  inputs = {
    time: document.querySelector("#timeInput").value,
    level: document.querySelector("#levelInput").value,
  };
  console.log(inputs);
  story = getStory();
  startTest(container, inputs.time);
});

function getStory() {
  return fetch("https://shortstories-api.herokuapp.com/")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      console.log(data);
      story = data.story;
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
    <div class="card my-4">
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
          style=""
        />
        <span class="input-group-text">${time}:00</span>
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
    if (currentStoryIndex < 0) {
      currentStoryIndex = 0;
    }
    currentStoryIndex--;
    characterSpanElements.forEach((element) => {
      element.classList.remove("active");
      if (element.classList.contains("correct")) {
        element.classList.remove("correct");
      } else {
        element.classList.remove("incorrect");
      }
    });
    characterSpanElements[currentStoryIndex + 2].classList.add("active");
  }
}

function userStartTyping() {
  if (typingArea.value[currentStoryIndex] === story[currentStoryIndex]) {
    characterSpanElements[currentStoryIndex + 1].classList.add("correct");
    characterSpanElements[currentStoryIndex + 1].classList.remove("incorrect");
    console.log("Okay");
  } else {
    characterSpanElements[currentStoryIndex + 1].classList.add("incorrect");
    characterSpanElements[currentStoryIndex + 1].classList.remove("correct");
  }
  characterSpanElements.forEach((element) => {
    element.classList.remove("active");
  });
  characterSpanElements[currentStoryIndex + 2].classList.add("active");

  console.log({
    story: story[currentStoryIndex],
    type: typingArea.value,
  });
  currentStoryIndex += 1;
  // console.log(e);
}

function appendResults() {
  console.log("Result");
}
