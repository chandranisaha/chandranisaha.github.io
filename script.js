// Theme toggle
const toggleButton = document.getElementById("theme-toggle");
const body = document.body;
const sunIcon = document.getElementById("sun-icon");
const moonIcon = document.getElementById("moon-icon");

// Load theme preference from localStorage
if (localStorage.getItem("theme") === "dark") {
  body.classList.add("dark-mode");
  moonIcon.style.display = "block";
  sunIcon.style.display = "none";
}

toggleButton.addEventListener("click", () => {
  body.classList.toggle("dark-mode");
  localStorage.setItem("theme", body.classList.contains("dark-mode") ? "dark" : "light");

  // Toggle icons visibility
  if (body.classList.contains("dark-mode")) {
    moonIcon.style.display = "block";
    sunIcon.style.display = "none";
  } else {
    moonIcon.style.display = "none";
    sunIcon.style.display = "block";
  }
});

// Content reveal on scroll
const sections = document.querySelectorAll("section");
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("revealed");
      logEvent("view", entry.target);
    }
  });
}, {
  threshold: 0.1
});

sections.forEach((section) => observer.observe(section));

// Lazy loading
const images = document.querySelectorAll('img[loading="lazy"]');

images.forEach(image => {
  image.onload = () => {
    image.classList.add('loaded');
  };
});

// Event logger
function logEvent(eventType, target) {
  const timestamp = new Date().toISOString();
  let targetType = target.dataset.type || target.tagName.toLowerCase();

  if (targetType === "button" || target.classList.contains("btn")) {
    targetType = "button";
  } else if (target.tagName.toLowerCase() === "img") {
    targetType = "image";
  } else if (target.tagName.toLowerCase() === "textarea") {
    targetType = "text-area";
  } else if (target.tagName.toLowerCase() === "a") {
    targetType = "link";
  } else if (target.tagName.toLowerCase() === "p" || target.tagName.toLowerCase() === "li") {
    targetType = "text";
  }

  console.log(`${timestamp} , ${eventType} , ${targetType}`);
}

document.querySelectorAll(".track").forEach(el => {
  el.addEventListener("click", () => logEvent("click", el));
});
