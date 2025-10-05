function scrollToSection(id) {
  document.getElementById(id).scrollIntoView({ behavior: "smooth" });
}

// ظهور الأقسام عند التمرير
const fadeEls = document.querySelectorAll(".fade");
window.addEventListener("scroll", () => {
  fadeEls.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight - 100) el.classList.add("visible");
  });
});

// موسيقى الخلفية
const audio = document.getElementById("bg-music");
audio.volume = 0.3;

// الورود الذهبية المتحركة
const flowerImages = ["images/a4.jpg","images/a5.jpg","images/a6.jpg"];
const floatingFlowers = document.getElementById("floating-flowers");

function createFlower() {
  const flower = document.createElement("div");
  flower.classList.add("flower");

  const size = Math.random() * 30 + 20;
  flower.style.width = size + "px";
  flower.style.height = size + "px";

  flower.style.left = Math.random() * window.innerWidth + "px";
  flower.style.backgroundImage = `url(${flowerImages[Math.floor(Math.random()*flowerImages.length)]})`;

  const duration = Math.random() * 15 + 10;
  flower.style.animationDuration = `${duration}s, ${duration/2 + Math.random()*2}s`;

  floatingFlowers.appendChild(flower);

  setTimeout(() => floatingFlowers.removeChild(flower), duration * 1000);
}

setInterval(createFlower, 300);