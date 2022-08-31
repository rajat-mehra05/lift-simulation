let buttons = document.querySelectorAll(".call-lift-btn");
const addLiftBtn = document.querySelector(".add-lift-btn");
const addFloorBtn = document.querySelector(".add-floor-btn");
let liftEls = document.querySelectorAll(".lift-container");
let leftDoors = document.querySelectorAll(".left-door");
let rightDoors = document.querySelectorAll(".right-door");
const floorsContainer = document.querySelector(".floors");
let floors = document.querySelectorAll(".floor");

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
const lifts = Array.from(
  document.querySelectorAll(".lift-container"),
  (el) => ({
    htmlEl: el,
    busy: false,
    currFloor: 0,
  })
);

function getLifts() {
  return lifts;
}

//getting lifts
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
const callLift = () => {
  const { lift, index } = getClosestEmptyLift(requests.peek());

  if (index >= 0) {
    lifts[index].busy = true;
    moveLift(lift.htmlEl, requests.dequeue(), index);
  }
};

// opening of lifts
const openLift = (index) => {
  buttons.disabled = true;
  rightDoors[index].classList.add("open-right-door");
  leftDoors[index].classList.add("open-left-door");

  rightDoors[index].classList.remove("close-right-door");
  leftDoors[index].classList.remove("close-left-door");
};

const closeLift = (index) => {
  rightDoors[index].classList.add("close-right-door");
  leftDoors[index].classList.add("close-left-door");

  rightDoors[index].classList.remove("open-right-door");
  leftDoors[index].classList.remove("open-left-door");
  buttons.disabled = false;

  setTimeout(() => {
    lifts[index].busy = false;
    dispatchliftIdle();
  }, 2500);
};

const openCloseLift = (index) => {
  openLift(index);
  setTimeout(() => {
    closeLift(index);
  }, 3000);
};

const moveLift = (lift, destFloor, index) => {
  const distance = Math.abs(destFloor - lifts[index].currFloor);
  lift.style.transform = `translateY(${destFloor * 100 * -1}%)`;
  lift.style.transition = `transform ${1500 * distance}ms ease-in-out`;

  setTimeout(() => {
    openCloseLift(index);
  }, distance * 1500 + 1000);

  lifts[index].currFloor = destFloor;
};

function addRequest(destFloor) {
  requests.enqueue(destFloor);
  dispatchRequestAdded();
}

function removeRequest() {
  requests.dequeue();
}

const requestAddedEvent = new Event("requestAdded");
const liftIdleEvent = new Event("liftIdle");

function dispatchRequestAdded() {
  document.dispatchEvent(requestAddedEvent);
}

function dispatchliftIdle() {
  document.dispatchEvent(liftIdleEvent);
}

document.addEventListener("requestAdded", () => {
  callLift();
});

document.addEventListener("liftIdle", () => {
  if (!requests.isEmpty()) {
    callLift();
  }
});

function addLift() {
  floors[floors.length - 1].append(getLiftEl());
  liftEls = document.querySelectorAll(".lift-container");
  lifts.push({
    htmlEl: liftEls[liftEls.length - 1],
    busy: false,
    currFloor: 0,
  });
  leftDoors = document.querySelectorAll(".left-door");
  rightDoors = document.querySelectorAll(".right-door");

  if (lifts.length >= getMaxLifts()) {
    console.log("Max lifts added");
    addLiftBtn.disabled = true;
    addLiftBtn.textContent = "Max lifts added";
    return;
  }
}

function getLiftEl() {
  const liftDistance = (lifts.length + 1) * 150;

  const liftEL = document.createElement("div");
  liftEL.classList.add("lift-container");
  liftEL.style.position = "absolute";
  liftEL.style.left = `${liftDistance}px`;

  liftEL.innerHTML += `
            <div class="left-door">
            </div>
            <div class="right-door">
            </div>
        `;

  return liftEL;
}

function addFloor() {
  floorsContainer.prepend(getFloorEl());
  floors = document.querySelectorAll(".floor");
  buttons = document.querySelectorAll(".call-lift-btn");
  addCallLiftListeners([buttons[0], buttons[1]]);
}

function getFloorEl() {
  const newLiftNum = floors.length;

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

function addCallLiftListeners(buttons) {
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener("click", () => {
      addRequest(buttons[i].dataset.liftNum);
    });
  }
}

let requests = new Queue();

function main() {
  addCallLiftListeners(buttons);
  addFloorBtn.addEventListener("click", addFloor);
  addLiftBtn.addEventListener("click", addLift);
}

main();
