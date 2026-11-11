document.documentElement.classList.add("js");

const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector("#primary-navigation");
const year = document.querySelector("#current-year");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const cookiePopup = document.querySelector("#cookie-popup");
const cookieSettings = document.querySelector(".cookie-settings-button");
const mobileContact = document.querySelector(".mobile-contact");
const heroSection = document.querySelector(".hero");
const contactSection = document.querySelector("#contact");
const cookieChoiceKey = "mivora-cookie-choice";

year.textContent = new Date().getFullYear();

const showCookiePopup = () => {
  cookiePopup.hidden = false;
  cookiePopup.querySelector("[data-cookie-choice='all']").focus();
};

const saveCookieChoice = (choice) => {
  try {
    window.localStorage.setItem(cookieChoiceKey, choice);
    cookiePopup.hidden = true;
  } catch (error) {
    console.warn("Could not save the cookie preference in this browser.", error);
    cookiePopup.hidden = true;
  }
};

try {
  if (!window.localStorage.getItem(cookieChoiceKey)) {
    cookiePopup.hidden = false;
  }
} catch (error) {
  console.warn("Could not read the cookie preference in this browser.", error);
  cookiePopup.hidden = false;
}

cookiePopup.querySelectorAll("[data-cookie-choice]").forEach((button) => {
  button.addEventListener("click", () => {
    saveCookieChoice(button.dataset.cookieChoice);
  });
});

cookieSettings.addEventListener("click", showCookiePopup);

const closeNavigation = () => {
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation");
  navigation.classList.remove("is-open");
};

menuToggle.addEventListener("click", () => {
  const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isExpanded));
  menuToggle.setAttribute("aria-label", isExpanded ? "Open navigation" : "Close navigation");
  navigation.classList.toggle("is-open", !isExpanded);
});

navigation.addEventListener("click", (event) => {
  if (event.target.closest("a")) closeNavigation();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeNavigation();
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 700) closeNavigation();
  updateMobileContact();
});

const updateMobileContact = () => {
  if (!mobileContact || !heroSection || !contactSection) return;

  const heroHasPassed = heroSection.getBoundingClientRect().bottom <= 74;
  const contactIsNear = contactSection.getBoundingClientRect().top <= window.innerHeight;
  const shouldShow = window.innerWidth <= 700 && heroHasPassed && !contactIsNear;

  mobileContact.classList.toggle("is-visible", shouldShow);
  mobileContact.setAttribute("aria-hidden", String(!shouldShow));
  mobileContact.tabIndex = shouldShow ? 0 : -1;
};

updateMobileContact();

const revealElements = document.querySelectorAll(".reveal");
if (reducedMotion.matches || !("IntersectionObserver" in window)) {
  revealElements.forEach((element) => element.classList.add("is-visible"));
} else {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 },
  );

  revealElements.forEach((element) => revealObserver.observe(element));
}

let scrollUpdatePending = false;
window.addEventListener(
  "scroll",
  () => {
    if (scrollUpdatePending) return;
    scrollUpdatePending = true;
    window.requestAnimationFrame(() => {
      const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollableHeight > 0 ? window.scrollY / scrollableHeight : 0;
      document.documentElement.style.setProperty("--scroll-progress", String(progress));
      updateMobileContact();
      scrollUpdatePending = false;
    });
  },
  { passive: true },
);
