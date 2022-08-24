let liftBtns = document.querySelectorAll(".call-lift-btn");
let addFloorBtn = document.querySelector(".add-floor-btn");
let addLiftBtn = document.querySelector(".add-lift-btn");
let floorContainer = document.querySelector(".floors");
let liftContainer = document.querySelectorAll(".lift-container");
let floor = document.querySelectorAll(".floor");
let leftDoor = document.querySelectorAll(".left-door");
let rightDoor = document.querySelectorAll(".right-door");

// creating lifts
const lifts = Array.from(liftContainer, (el) => ({
  htmlEl: el,
  busy: false,
  currentFloor: 0,
}));

//getting lifts
function getLifts() {
  return lifts;
}

//get max width of viewport and render the max no. lifts according to that
const getMaxLifts = () => {
  const viewportWidth = document.getElementsByTagName("body")[0].clientWidth;
  return Math.floor((viewportWidth - 100) / 150);
};

// adding lift
function addLift() {
  floor[floor.length - 1].append(getLiftEl());
  liftContainer = document.querySelectorAll(".lift-container");
  lifts.push({
    htmlEl: liftContainer[liftContainer.length - 1],
    busy: false,
    currentFloor: 0,
  });

  leftDoor = document.querySelectorAll(".left-door");
  rightDoor = document.querySelectorAll(".right-door");

  if (lifts.length >= getMaxLifts()) {
    addLiftBtn.disabled = true;
    addLiftBtn.textContent = "Max lifts reached";
    addLiftBtn.style.cursor = "not-allowed";
    return;
  }
}

// getting a singe lift element
function getLiftEl() {
  const liftDistance = (lifts.length + 1) * 150;
  const liftEl = document.createElement("div");
  liftEl.classList.add("lift-container");
  liftEl.style.position = "absolute";
  liftEl.style.left = `${liftDistance}px`;

  liftEl.innerHTML += `
    <div class="left-door"></div>
    <div class="right-door"></div>
  `;

  return liftEl;
}

// adding floor
function addFloor() {
  floorContainer.prepend(getFloorEl());
  floor = document.querySelectorAll(".floor");
  liftBtns = document.querySelectorAll(".call-lift-btn");
}

//getting floor elements
function getFloorEl() {
  console.log(`floor.length:`, floor.length);
  let newLiftNum = floor.length;
  console.log(`newLiftNum:`, newLiftNum);

  const floorEl = document.createElement("div");
  floorEl.classList.add("floor");
  floorEl.innerHTML += `
    <div class="lift-btns">
    <button class="call-lift-btn open-lift-btn" data-lift-num="${newLiftNum}">
    <i class="fa-solid fa-up-long"></i> </button>
    </button>
    <button class="call-lift-btn close-lift-btn" data-lift-num="${newLiftNum}">
    <i class="fa-solid fa-down-long"></i>
    </button>
</div>
    `;

  return floorEl;
}

function masterCalls() {
  addFloorBtn.addEventListener("click", addFloor);
  addLiftBtn.addEventListener("click", addLift);
}

masterCalls();
