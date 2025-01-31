// AUDIO
window.onload = () => {
  const backgroundMusic = new Audio("assets/audio/background.mp3");
  backgroundMusic.loop = true;
  backgroundMusic.volume = 0.25;

  const musicBtn = document.querySelector(".music-control");

  // Check if page is fully loaded
  if (document.readyState === "complete") {
    // Due to browser policies, we need user interaction
    musicBtn.addEventListener("click", () => {
      if (backgroundMusic.paused) {
        backgroundMusic.play();
        musicBtn.innerHTML = "Sound off";
      } else {
        backgroundMusic.pause();
        musicBtn.innerHTML = "Sound on";
      }
    });
  }
  // Auto-trigger first play
  //musicBtn.click();
};

// ANIMATION of 4 KEYWORDS
const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const divElements = document.querySelectorAll(".text-container div");
const animatedPart = document.querySelector(".animated-part");
let delay = 1000;
let pauseDelay = 1000;
function animateDivs() {
  let currentDiv = divElements[0];
  let parent = currentDiv.parentNode;
  // start of working code
  function animateThenMove() {
    let iteration = 0;
    const interval = setInterval(() => {
      // working code
      currentDiv.innerText = currentDiv.innerText
        .split("")
        .map((letter, index) => {
          if (index < iteration) {
            return currentDiv.dataset.value[index];
          }
          return letters[Math.floor(Math.random() * 26)];
        })
        .join("");
      // end of working code
      if (iteration >= currentDiv.dataset.value.length) {
        clearInterval(interval);
        // This will delay the next animation so we can read the word
        setTimeout(() => {
          // Move the current span to the end of the parent
          parent.appendChild(currentDiv);
          // Get the next current span
          currentDiv = parent.firstElementChild;
          // Starting the next element
          animateThenMove();
        }, pauseDelay);
      }
      iteration += 1 / 2;
    }, 27);
  }
  requestAnimationFrame(animateThenMove);
  // LETTERS CONTAINER
  animatedPart.style.height = `${
    divElements[0].getBoundingClientRect().height + divElements[0].getBoundingClientRect().height * 0.07
  }px`;
}
// Start the animation immediately, do not forget this
requestAnimationFrame(animateDivs);

// ANIMATE THE HERO SECTION
const heroShape = document.querySelector(".hero-shape");
const heroText = document.querySelector(".hero-text");

window.addEventListener("scroll", () => {
  const windowHeight = window.innerHeight;
  const scrollAmount = window.scrollY || window.pageYOffset;
  const speed = heroShape.dataset.speed;
  const scaleValue = 1 + parseFloat((scrollAmount / windowHeight).toFixed(2));

  heroShape.style.transform = `translateY(${(-1 * scrollAmount) / 6}px)`;
  heroText.style.transform = `scale(${scaleValue.toFixed(2)})`;
});

// ANIMATE THE REASON
const reasonItems = document.querySelectorAll(".content-part");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = 1;
      } else {
        entry.target.style.opacity = 0;
      }
    });
  },
  { threshold: 0.7 }
);

reasonItems.forEach((item) => {
  observer.observe(item);
});

// ANIMATE THE TRANSITION
const portfolioContent = document.querySelector(".portfolio-content");

const portfolioObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      const sliders = entry.target.querySelectorAll(".slider");
      if (entry.isIntersecting) {
        sliders.forEach((slider, idx) => {
          setTimeout(() => {
            slider.style.transform = "translateY(-100%)";
          }, (idx + 1) * 200);
        });
        portfolioObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.4,
  }
);

portfolioObserver.observe(portfolioContent);

// ANIMATE THE MARQUEE
const marqueeContainer = document.querySelectorAll(".marquee-container");
const marqueeGap = 24;

// duplicate items for seamless transition
function animateMultiMarquee(parentElement, direction) {
  let directionToGo = direction <= 0 ? -1 : 1;
  const element = Array.from(parentElement.querySelectorAll("img"));
  let totalWidth = 0;

  // Ensure all images are loaded before calculating widths
  const imagesLoaded = element.map((img) => {
    return new Promise((resolve) => {
      if (img.complete) {
        resolve();
      } else {
        img.onload = resolve;
        img.onerror = resolve;
      }
    });
  });

  Promise.all(imagesLoaded).then(() => {
    // define the width of each scroller and duplicate items for seamless transition
    element.forEach((item) => {
      const duplicated = item.cloneNode(true);
      duplicated.setAttribute("aria-hidden", true);
      parentElement.appendChild(duplicated);
      totalWidth += item.getBoundingClientRect().width + marqueeGap;
    });

    // Store the total width to avoid recalculating
    const storedTotalWidth = totalWidth;

    // start the animation
    let animation = 0;

    function animateMarquee() {
      if (directionToGo > 0) {
        parentElement.style.transform = `translateX(${directionToGo * animation - storedTotalWidth}px)`;
        if (animation < storedTotalWidth) {
          animation++;
        } else {
          animation = 0;
        }
      } else {
        parentElement.style.transform = `translateX(${directionToGo * animation}px)`;
        if (animation < storedTotalWidth) {
          animation++;
        } else {
          animation = 0;
        }
      }
      requestAnimationFrame(animateMarquee);
    }
    console.log("KEEP MOVING");
    console.log(totalWidth);
    requestAnimationFrame(animateMarquee);
  });
}

animateMultiMarquee(marqueeContainer[0], -1);
animateMultiMarquee(marqueeContainer[1], 1);

// GIFT CONTENT
const gift = document.querySelector(".gift");
gift.addEventListener("click", () => {});
