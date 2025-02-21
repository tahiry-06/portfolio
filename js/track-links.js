// document.addEventListener("DOMContentLoaded", function () {

import { loadNavbar } from "./navbar.js";

const path = window.location.pathname;
// console.log(path);
const links = {
  "/portfolio/": "home-link",
  "/portfolio/index.html": "home-link",
  "/portfolio/works.html": "works-link",
  "/portfolio/about.html": "about-link",
};
const activeLinkId = links[path];
// console.log(activeLinkId);

function getActiveLink() {
  return new Promise((resolve, reject) => {
    const linkElement = document.querySelector(`#${activeLinkId}`);
    if (linkElement) {
      resolve(linkElement);
    } else {
      reject("NOT FOUND");
    }
  });
}

async function setActiveLink() {
  await loadNavbar();
  const linkElement = await getActiveLink();
  linkElement.classList.add("active");
}

export { setActiveLink };
