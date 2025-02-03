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

  // Adjust the container height to fit only the first child
  function adjustContainerHeight() {
    animatedPart.style.height = `${
      currentDiv.getBoundingClientRect().height + currentDiv.getBoundingClientRect().height * 0.07
    }px`;
  }

  // Call adjustContainerHeight initially and on window resize
  adjustContainerHeight();
  window.addEventListener("resize", adjustContainerHeight);

  function animateThenMove() {
    let iteration = 0;
    const interval = setInterval(() => {
      currentDiv.innerText = currentDiv.innerText
        .split("")
        .map((letter, index) => {
          if (index < iteration) {
            return currentDiv.dataset.value[index];
          }
          return letters[Math.floor(Math.random() * 26)];
        })
        .join("");
      if (iteration >= currentDiv.dataset.value.length) {
        clearInterval(interval);
        setTimeout(() => {
          parent.appendChild(currentDiv);
          currentDiv = parent.firstElementChild;
          adjustContainerHeight(); // Adjust height after moving the element
          animateThenMove();
        }, pauseDelay);
      }
      iteration += 1 / 2;
    }, 27);
  }
  requestAnimationFrame(animateThenMove);
}

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

    // Round the total width to the nearest integer to avoid sub-pixel issues
    const storedTotalWidth = Math.round(totalWidth);

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
    // do not remove console.log please, I keep track with these
    // console.log("KEEP MOVING");
    // console.log(storedTotalWidth);
    requestAnimationFrame(animateMarquee);
  });
}

animateMultiMarquee(marqueeContainer[0], -1);
animateMultiMarquee(marqueeContainer[1], 1);

// ANIMATE WORKS CARDS DESCRIPTION
const workIllustrations = document.querySelectorAll(".main-card");
const hoverDescription = document.querySelectorAll(".hover-description");
const mainDescription = document.querySelector(".main-description");
const swipeLeft = document.querySelector(".swipe-left-button");
const swipeRight = document.querySelector(".swipe-right-button");
const min946 = window.matchMedia("(min-width: 946px)");
const max945 = window.matchMedia("(max-width: 945px)");
const handleMouseEnterFunctions = [];
const handleMouseLeaveFunctions = [];

let lastHovered = null;
let swipeCounter = 1;

function handleMouseEnter(illustration, idx) {
  return () => {
    mainDescription.classList.add("hide-description");
    if (lastHovered) {
      clearTimeout(lastHovered.timeOutId);
    }
    lastHovered = {
      element: illustration,
      timeOutId: setTimeout(() => {
        setHoverDescription(idx);
      }, 400),
    };
  };
}

function handleMouseLeave(illustration) {
  return () => {
    if (lastHovered && lastHovered.element === illustration) {
      clearTimeout(lastHovered.timeOutId);
    }
    mainDescription.classList.remove("hide-description");
    hoverDescription.forEach((description) => {
      description.classList.add("hide-description");
    });
  };
}

function addEventListeners() {
  workIllustrations.forEach((illustration, idx) => {
    const handleMouseEnterFunction = handleMouseEnter(illustration, idx);
    const handleMouseLeaveFunction = handleMouseLeave(illustration);

    handleMouseEnterFunctions.push(handleMouseEnterFunction);
    handleMouseLeaveFunctions.push(handleMouseLeaveFunction);

    illustration.addEventListener("mouseenter", handleMouseEnterFunction);
    illustration.addEventListener("mouseleave", handleMouseLeaveFunction);
  });
}

function removeEventListeners() {
  workIllustrations.forEach((illustration, idx) => {
    illustration.removeEventListener("mouseenter", handleMouseEnterFunctions[idx]);
    illustration.removeEventListener("mouseleave", handleMouseLeaveFunctions[idx]);
  });
  // Clear function arrays to avoid duplicate functions
  handleMouseEnterFunctions.length = 0;
  handleMouseLeaveFunctions.length = 0;
}

function setHoverDescription(idx) {
  hoverDescription.forEach((description, i) => {
    if (i === hoverDescription.length - idx - 1) {
      description.classList.remove("hide-description");
      description.style.transform = `translate(0, 0)`;
    } else {
      description.classList.add("hide-description");
    }
  });

  // Delay the translation effect to make it not visible
  requestAnimationFrame(() => {
    hoverDescription.forEach((description, i) => {
      if (i !== hoverDescription.length - idx - 1) {
        // this is set in advance
        description.style.transform = `translate(-25%, 0)`;
      }
    });
  });
}

function handleSwipeLeft() {
  handleSwipe(1);
}

function handleSwipeRight() {
  handleSwipe(-1);
}

function handleSwipe(n) {
  showDescriptionAndCard((swipeCounter += n));
}

function currentDescriptionAndCard(n) {
  showDescriptionAndCard((swipeCounter = n));
}

function showDescriptionAndCard(n) {
  let i;

  if (n > workIllustrations.length) {
    swipeCounter = 1;
  }
  if (n < 1) {
    swipeCounter = workIllustrations.length;
  }
  for (i = 0; i < workIllustrations.length; i++) {
    hoverDescription[i].style.transform = `translate(0, 0)`;
    workIllustrations[i].classList.add("go-none");
  }
  for (i = 0; i < hoverDescription.length; i++) {
    hoverDescription[i].classList.add("hide-description");
  }
  workIllustrations[workIllustrations.length - swipeCounter].classList.remove("go-none");
  hoverDescription[swipeCounter - 1].classList.remove("hide-description");
}

// Check the media query when the window is loading
min946.addEventListener("change", (event) => {
  if (event.matches) {
    if (handleMouseEnterFunctions.length === 0) {
      addEventListeners();
    }
  } else {
    mainDescription.classList.add("hide-description");
    removeEventListeners();
  }
});

if (min946.matches) {
  addEventListeners();
} else {
  mainDescription.classList.add("hide-description");
  removeEventListeners();
}

max945.addEventListener("change", (e) => {
  if (e.matches) {
    swipeCounter = 1;
    showDescriptionAndCard(swipeCounter);
    mainDescription.classList.add("hide-description");
    swipeLeft.addEventListener("click", handleSwipeLeft);
    swipeRight.addEventListener("click", handleSwipeRight);
  } else {
    hoverDescription.forEach((description) => {
      description.classList.add("hide-description");
      description.style.transform = `translate(-25%, 0)`;
    });
    // this ensure the go-none class is removed when bigger screen
    workIllustrations.forEach((illustration) => {
      illustration.classList.remove("go-none");
    });

    mainDescription.classList.remove("hide-description");
    swipeLeft.removeEventListener("click", handleSwipeLeft);
    swipeRight.removeEventListener("click", handleSwipeRight);
  }
});

// // Initial check to add or remove event listener based on the current screen size
// // Setting of initial values for elememts
if (max945.matches) {
  swipeCounter = 1;
  mainDescription.classList.add("hide-description");
  showDescriptionAndCard(swipeCounter);
  swipeLeft.addEventListener("click", handleSwipeLeft);
  swipeRight.addEventListener("click", handleSwipeRight);
} else {
  mainDescription.classList.remove("hide-description");
  swipeLeft.removeEventListener("click", handleSwipeLeft);
  swipeRight.removeEventListener("click", handleSwipeRight);
}
//
//
//
//
//
// GIFT CONTENT

const download = document.querySelector(".download");
const downloadContent = document.querySelector(".download-content");
const receive = document.querySelector(".download-item");
const decline = document.querySelector(".download-close");

const downloadChoice = document.querySelector(".download-choice");
const choiceContent = document.querySelector(".choice-content");
const choiceDirect = document.querySelector(".choice-direct");
const choiceGumroad = document.querySelector(".choice-gumroad");

const directURL = "assets/ressources/elevate-yourself.zip";
const gumroadURL = "https://tahir06.gumroad.com/l/elevateYourself";

const gift = document.querySelector(".gift");
gift.addEventListener("click", () => {
  mainView.classList.add("blurred");
  document.body.style.overflow = "hidden";
  downloadContent.style.transform = "translate(0, 0)";
  downloadContent.style.opacity = 1;
  download.style.opacity = 1;
  download.style.zIndex = 9999;
});

decline.addEventListener("click", () => {
  mainView.classList.remove("blurred");
  document.body.style.overflow = "visible";
  downloadContent.style.transform = "translate(0, -25%)";
  downloadContent.style.opacity = 0;
  download.style.opacity = 0;
  setTimeout(() => {
    download.style.zIndex = -9999;
  }, 200);
});

receive.addEventListener("click", openChoice);

function openChoice() {
  download.classList.add("blurred");
  document.body.style.overflow = "hidden";
  choiceContent.style.transform = "translate(0, 0)";
  choiceContent.style.opacity = 1;
  downloadChoice.style.opacity = 1;
  downloadChoice.style.zIndex = 9999;
}

function downloadFile(url) {
  let link = document.createElement("a");
  link.setAttribute("download", "");
  link.href = url;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

choiceDirect.addEventListener("click", () => {
  downloadFile(directURL);
  setTimeout(() => {
    download.classList.remove("blurred");
    choiceContent.style.transform = "translate(0, -25%)";
    choiceContent.style.opacity = 0;
    downloadChoice.style.opacity = 0;
    setTimeout(() => {
      downloadChoice.style.zIndex = -9999;
    }, 200);
    mainView.classList.remove("blurred");
    document.body.style.overflow = "visible";
    downloadContent.style.transform = "translate(0, -25%)";
    downloadContent.style.opacity = 0;
    download.style.opacity = 0;
    setTimeout(() => {
      download.style.zIndex = -9999;
    }, 200);
  }, 1000);
});

choiceGumroad.addEventListener("click", () => {
  window.open(gumroadURL, "_blank");
  setTimeout(() => {
    download.classList.remove("blurred");
    choiceContent.style.transform = "translate(0, -25%)";
    choiceContent.style.opacity = 0;
    downloadChoice.style.opacity = 0;
    setTimeout(() => {
      downloadChoice.style.zIndex = -9999;
    }, 200);
    mainView.classList.remove("blurred");
    document.body.style.overflow = "visible";
    downloadContent.style.transform = "translate(0, -25%)";
    downloadContent.style.opacity = 0;
    download.style.opacity = 0;
    setTimeout(() => {
      download.style.zIndex = -9999;
    }, 200);
  }, 2000);
});

// POPUP

const comingSoon = document.querySelector(".coming-soon");
const soonContent = document.querySelector(".soon-content");
const close = document.querySelector(".close");
const mainView = document.querySelector(".main");

const allButtons = [
  ...document.querySelectorAll(".call-to-action > button"),
  document.querySelector(".see-more > button"),
  document.querySelector(".tell-me-button > button"),
];

allButtons.forEach((button) => {
  button.addEventListener("click", () => {
    mainView.classList.add("blurred");
    document.body.style.overflow = "hidden";
    soonContent.style.transform = "translate(0, 0)";
    soonContent.style.opacity = 1;
    comingSoon.style.opacity = 1;
    comingSoon.style.zIndex = 9999;
  });

  close.addEventListener("click", () => {
    mainView.classList.remove("blurred");
    document.body.style.overflow = "visible";
    soonContent.style.transform = "translate(0, -25%)";
    soonContent.style.opacity = 0;
    comingSoon.style.opacity = 0;
    setTimeout(() => {
      comingSoon.style.zIndex = -9999;
    }, 200);
  });
});

window.addEventListener("click", (event) => {
  if (event.target === choiceContent || event.target === downloadChoice) {
    download.classList.remove("blurred");
    choiceContent.style.transform = "translate(0, -25%)";
    choiceContent.style.opacity = 0;
    downloadChoice.style.opacity = 0;
    setTimeout(() => {
      downloadChoice.style.zIndex = -9999;
    }, 200);
  }

  if (event.target === download) {
    mainView.classList.remove("blurred");
    document.body.style.overflow = "visible";
    downloadContent.style.transform = "translate(0, -25%)";
    downloadContent.style.opacity = 0;
    download.style.opacity = 0;
    setTimeout(() => {
      download.style.zIndex = -9999;
      receive.addEventListener("click", openChoice, { once: true });
    }, 200);
  }
});
