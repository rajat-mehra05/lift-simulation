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
    addLiftBtn.disabled = true;
    addLiftBtn.textContent = "Max lifts reached";
    addLiftBtn.style.cursor = "not-allowed";
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
  <svg width="50" height="50" viewBox="0 0 256 256">
  <path
    fill="currentColor"
    d="m214.8 136.9l-39.2-50.4a5.2 5.2 0 0 0-1-1.1A31.5 31.5 0 0 0 152 76a40 40 0 1 0-48 0a31.5 31.5 0 0 0-22.6 9.4a5.2 5.2 0 0 0-1 1.1l-39.2 50.4a24 24 0 0 0 33.9 33.9l3.8-2.9L63 218.1a23.5 23.5 0 0 0-.4 17.5a24 24 0 0 0 43.9 2.7l21.5-33.8l21.5 33.8a23.9 23.9 0 0 0 13.2 11.6a23.3 23.3 0 0 0 8.2 1.5a24 24 0 0 0 22.1-33.3l-15.9-50.2l3.8 2.9a24 24 0 0 0 33.9-33.9ZM128 28a16 16 0 1 1-16 16a16 16 0 0 1 16-16Zm68.1 124.3l-34.7-27.1a12 12 0 0 0-18.8 13.1l27.7 87.6l.6 1.5a10 10 0 0 0-.8-1.4l-32-50.4a12 12 0 0 0-20.2 0l-32 50.4a10 10 0 0 0-.8 1.4l.6-1.5l27.7-87.6a11.9 11.9 0 0 0-4.6-13.4a11.3 11.3 0 0 0-6.8-2.2a12.7 12.7 0 0 0-7.4 2.5l-34.7 27.1l-1.2 1l1-1.2l39.1-50.2a8.1 8.1 0 0 1 5.2-1.9h48a8.1 8.1 0 0 1 5.2 1.9l39.1 50.2l1 1.2Z"
  />
  </svg>
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
