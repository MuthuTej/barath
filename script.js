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

///gsap animation script

 gsap.registerPlugin(ScrollTrigger);

    const positions = [
      { id: "#img1", top: 0, left: 0, width: 500, height: 300, z: 3 },
      { id: "#img2", top: -100, left: 600, width: 300, height: 200, z: 2 },
      { id: "#img3", top: 200, left: 600, width: 300, height: 200, z: 1 },
    ];

    const orderSets = [
      [0, 1, 2],
      [2, 0, 1],
      [1, 2, 0],
    ];

    let currentStage = 0;
    let rotationsDone = 0;
    let isAnimating = false;
    const totalRotations = 3;

    // Lock scroll initially
    document.body.style.overflow = 'hidden';

    function rotateTo(stageIndex) {
      const order = orderSets[stageIndex];
      for (let i = 0; i < 3; i++) {
        const el = document.querySelector(positions[order[i]].id);
        gsap.to(el, {
          top: positions[i].top,
          left: positions[i].left,
          width: positions[i].width,
          height: positions[i].height,
          zIndex: positions[i].z,
          duration: 0.8,
          ease: "power2.inOut",
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
          document.body.style.overflow = 'auto'; // Unlock scroll
        }
      }, 900);
    }

    // Scroll + Arrow control
    window.addEventListener('wheel', e => {
      if (rotationsDone < totalRotations && !isAnimating) {
        e.preventDefault();
        doNextRotation();
      }
    }, { passive: false });

    window.addEventListener('keydown', e => {
      if ((e.key === "ArrowDown" || e.key === "PageDown") && !isAnimating && rotationsDone < totalRotations) {
        e.preventDefault();
        doNextRotation();
      }
    });

    rotateTo(0);