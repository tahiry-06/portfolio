// APPEND NAV BAR

import { setActiveLink } from "./track-links.js";

async function loadNavbar() {
  const response = await fetch("https://tahiry-06.github.io/portfolio/navbar.html");
  const navbarHTML = await response.text();

  document.body.querySelector(".navbar-placeholder").innerHTML = navbarHTML;
}

function onLoad() {
  return new Promise((resolve, reject) => {
    const navbar = document.querySelector(".navbar");
    const hamburger = document.querySelector(".hamburger");
    const navbarMenus = document.querySelector(".navbar .menus");

    if (navbar && hamburger && navbarMenus) {
      const elements = new Map();
      elements.set("navbar", navbar);
      elements.set("hamburger", hamburger);
      elements.set("navbarMenus", navbarMenus);
      resolve(elements);
    } else {
      reject("Elements not found");
    }
  });
}

async function animateNavbar(ref) {
  await loadNavbar();
  await setActiveLink();
  const elements = await onLoad();

  const navbar = elements.get("navbar");
  const hamburger = elements.get("hamburger");
  const navbarMenus = elements.get("navbarMenus");

  window.addEventListener("scroll", () => {
    if (ref) {
      const objTop = ref.getBoundingClientRect().top;
      objTop <= 0 ? (navbar.style.transform = `translate(-50%, 0)`) : hideAllMenu(navbar, navbarMenus);
    } else {
      console.log("SOME PROBLEM HERE");
    }
  });

  hamburger.addEventListener("click", () => {
    navbarMenus.classList.toggle("menu-show");
  });
}

function hideAllMenu(navbar, navbarMenus) {
  navbar.style.transform = `translate(-50%, -80px)`;
  navbarMenus.classList.remove("menu-show");
}

function test(el) {
  console.log(el);
}

export { loadNavbar, animateNavbar, test };
