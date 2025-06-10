const nav_bar = document.querySelector('.nav_bar');
const menu_icon = document.querySelector(".menu_icon");
const cross_icon = document.querySelector('.bx-x');

function toggle() {
  if (!nav_bar.classList.contains("display")) {
    nav_bar.classList.add("display");
  } else {
    nav_bar.classList.remove("display");
  }
}

gsap.registerPlugin(ScrollTrigger);

const positions = [
  { top: "0%", left: "0%", width: "60%", height: "60%", z: 3 },
  { top: "-15%", left: "65%", width: "35%", height: "40%", z: 2 },
  { top: "40%", left: "65%", width: "35%", height: "40%", z: 1 }
];

const orderSets = [
  [0, 1, 2],
  [2, 0, 1],
  [1, 2, 0]
];

const imageIds = ["#img1", "#img2", "#img3"];
let currentStage = 0;
let rotationsDone = 0;
const totalRotations = 3;
let isAnimating = false;

// Lock scroll
function lockScroll() {
  document.body.style.overflow = 'hidden';
  document.addEventListener('touchmove', preventDefault, { passive: false });
}

function unlockScroll() {
  document.body.style.overflow = 'auto';
  document.removeEventListener('touchmove', preventDefault);
}

function preventDefault(e) {
  e.preventDefault();
}

function rotateTo(stageIndex) {
  const order = orderSets[stageIndex];
  for (let i = 0; i < 3; i++) {
    const el = document.querySelector(imageIds[order[i]]);
    gsap.to(el, {
      top: positions[i].top,
      left: positions[i].left,
      width: positions[i].width,
      height: positions[i].height,
      zIndex: positions[i].z,
      duration: 0.8,
      ease: "power2.inOut"
    });
  }
}

function doNextRotation() {
  if (isAnimating || rotationsDone >= totalRotations) return;
  isAnimating = true;

  currentStage = (currentStage + 1) % 3;
  rotateTo(currentStage);
  rotationsDone++;

  setTimeout(() => {
    isAnimating = false;
    if (rotationsDone >= totalRotations) {
      unlockScroll();
      removeScrollListeners();
    }
  }, 900);
}

// Scroll interaction handlers
function handleWheel(e) {
  if (rotationsDone < totalRotations && !isAnimating) {
    e.preventDefault();
    doNextRotation();
  }
}

function handleKeyDown(e) {
  if ((e.key === "ArrowDown" || e.key === "PageDown") && !isAnimating && rotationsDone < totalRotations) {
    e.preventDefault();
    doNextRotation();
  }
}

let startY = 0;

function handleTouchStart(e) {
  startY = e.touches[0].clientY;
}

function handleTouchMove(e) {
  const deltaY = e.touches[0].clientY - startY;
  if (Math.abs(deltaY) > 50 && !isAnimating && rotationsDone < totalRotations) {
    e.preventDefault();
    doNextRotation();
  }
}

// Add/remove listeners
function addScrollListeners() {
  window.addEventListener('wheel', handleWheel, { passive: false });
  window.addEventListener('keydown', handleKeyDown);
  window.addEventListener('touchstart', handleTouchStart);
  window.addEventListener('touchmove', handleTouchMove, { passive: false });
}

function removeScrollListeners() {
  window.removeEventListener('wheel', handleWheel);
  window.removeEventListener('keydown', handleKeyDown);
  window.removeEventListener('touchstart', handleTouchStart);
  window.removeEventListener('touchmove', handleTouchMove);
}

// Trigger animation when component is in view
ScrollTrigger.create({
  trigger: "#carouselSection",
  start: "top 20%", // starts when top of section reaches 40% from top of viewport
  once: true,
  onEnter: () => {
    lockScroll();
    rotateTo(0);
    addScrollListeners();
  }
});
