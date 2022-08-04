let liftBtns = document.querySelectorAll(".call-lift-btn");
let addFloorBtn = document.querySelector(".add-floor-btn");
let addLiftBtn = document.querySelector(".add-lift-btn");
let liftContainer = document.querySelector(".lift-container");
let floorContainer = document.querySelector(".floors");
let floor = document.querySelector(".floor");
let leftDoor = document.querySelector(".left-door");
let rightDoor = document.querySelector(".right-door");

// const lifts = Array.from(liftContainer, (el) => ({
//   htmlEl: el,
//   currentFloor: 0,
//   busy: false,
// }));

// function getLifts() {
//   return lifts;
// }

// adding floor
function addFloor() {
  floorContainer.prepend(getFloorEl());
}

//getting floor elements
function getFloorEl() {
  let newLiftNum = floor.length + 1;

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
}

masterCalls();
