let liftBtns = document.querySelectorAll(".call-lift-btn");
let addFloorBtn = document.querySelector(".add-floor-btn");
let addLiftBtn = document.querySelector(".add-lift-btn");
let floorContainer = document.querySelector(".floors");
let liftContainer = document.querySelectorAll(".lift-container");
let floor = document.querySelectorAll(".floor");
let leftDoor = document.querySelectorAll(".left-door");
let rightDoor = document.querySelectorAll(".right-door");

// queue logic implementation
class Queue {
  constructor() {
    this.items = [];
  }

  enqueue(element) {
    return this.items.push(element);
  }

  dequeue() {
    if (this.items.length > 0) {
      return this.items.shift();
    }
  }

  peek() {
    return this.items[this.items.length - 1];
  }

  isEmpty() {
    return this.items.length == 0;
  }

  size() {
    return this.items.length;
  }

  clear() {
    this.items = [];
  }
}

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
function getClosestEmptyLift(requestedFloor) {
  const lifts = getLifts();

  const emptyLifts = lifts.reduce(
    (result, value, idx) =>
      result.concat(
        value.busy === false
          ? {
              idx,
              currFloor: value.currFloor,
              distance: Math.abs(requestedFloor - value.currFloor),
            }
          : []
      ),
    []
  );

  if (emptyLifts.length <= 0) {
    return { lift: {}, index: -1 };
  }

  // look for the closest lift on getRequest
  const closestLift = emptyLifts.reduce((result, value) =>
    value.distance < result.distance ? value : result
  );

  const index = closestLift.idx;

  return { lift: lifts[index], index };
}

//get max width of viewport and render the max no. lifts according to that
const getMaxLifts = () => {
  const viewportWidth = document.getElementsByTagName("body")[0].clientWidth;
  return Math.floor((viewportWidth - 100) / 150);
};

// call lifts
function callLifts() {
  const { lift, index } = getClosestEmptyLift(requests.peek());

  if (index >= 0) {
    lifts[index].busy = true;
    callLiftMovements(lift.htmlEl, requests.dequeue(), index);
  }
}

// opening of lifts
const openLift = (idx) => {
  liftBtns.disabled = true;
  rightDoor[idx].classList.add("open-right-door");
  leftDoor[idx].classList.add("open-left-door");

  rightDoor[idx].classList.remove("close-right-door");
  leftDoor[idx].classList.remove("close-left-door");
};

// closing of lifts
const closeLift = (idx) => {
  rightDoor[idx].classList.add("close-right-door");
  leftDoor[idx].classList.add("close-left-door");

  rightDoor[idx].classList.remove("open-right-door");
  leftDoor[idx].classList.remove("open-left-door");
  liftBtns.disabled = false;

  setTimeout(() => {
    lifts[idx].busy = false;
    dispatchliftIdle();
  }, 2500);
};

const openCloseLift = (idx) => {
  openLift(idx);
  setTimeout(() => {
    closeLift(idx);
    // close lift after 3s
  }, 3000);
};

// moving lifts
function callLiftMovements(lift, requestedFloor, idx) {
  const distance = Math.abs(requestedFloor - lifts[idx].currFloor);
  lift.style.transform = `translateY(${requestedFloor * 100 * -1}%)`;
  lift.style.transition = `transform ${1500 * distance}ms ease-in-out`;

  setTimeout(() => {
    openCloseLift(index);
  }, distance * 1500 + 1000);

  lifts[index].currFloor = destFloor;
}

let requests = new Queue();

// calling lift to requested floor
function getRequest(requestedFloor) {
  console.log(requestedFloor);
  requests.enqueue(requestedFloor);
}

function removeRequest() {
  requests.dequeue();
  disptachRequestAdded();
}

let requestAddedEvent = new Event("requestAdded");

function disptachRequestAdded() {
  document.dispatchEvent(requestAddedEvent);
}

document.addEventListener("requestAdded", () => {
  callLifts();
});

document.addEventListener("liftIdle", () => {
  if (!requests.isEmpty()) {
    callLiftMovements();
  }
});

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
  addCallLiftEvent(liftBtns[0], liftBtns[1]);
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

// calling lift events
function addCallLiftEvent(liftBtns) {
  for (let i = 0; i < liftBtns.length; i++) {
    liftBtns[i].addEventListener("click", () => {
      getRequest(liftBtns[i].dataset.liftNum);
    });
  }
}

function masterCalls() {
  addCallLiftEvent(liftBtns);
  addFloorBtn.addEventListener("click", addFloor);
  addLiftBtn.addEventListener("click", addLift);
}

masterCalls();
