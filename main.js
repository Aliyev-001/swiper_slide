const wrapper = document.querySelector(".wrapper");
const carousel = document.querySelector(".carousel");
const firstCardWidth = carousel.querySelector(".card").offsetWidth; //
const arrowBtns = document.querySelectorAll(".wrapper i");
const carouselChildrens = [...carousel.children];
console.log(carouselChildrens.slice(-3));
let isDragging = false,
  isAutoPlay = true,
  startX,
  startScrollLeft,
  timeoutId;

//Bir anda karuselə sığacaq kartların sayını əldə edin
 let cardPerView = Math.round(carousel.offsetWidth / firstCardWidth);
// Sonsuz sürüşmə üçün son bir neçə kartın nüsxələrini karuselin başlanğıcına daxil edin
carouselChildrens
  .slice(-cardPerView)
  .reverse()
  .forEach((card) => {
    carousel.insertAdjacentHTML("afterbegin", card.outerHTML);
  });

  // Sonsuz sürüşmə üçün ilk bir neçə kartın nüsxələrini karuselin sonuna daxil edin
carouselChildrens
.slice(0, cardPerView)
.forEach((card) => {
  carousel.insertAdjacentHTML("beforeend", card.outerHTML);
});
// Firefox-da ilk bir neçə dublikat kartı gizlətmək üçün müvafiq mövqedə karuseli sürüşdürün
 carousel.classList.add("no-transition");
 carousel.scrollLeft = carousel.offsetWidth;
 carousel.classList.remove("no-transition");

// Karuseli sola və sağa sürüşdürmək üçün ox düymələri üçün hadisə dinləyiciləri əlavə edin
arrowBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    carousel.scrollLeft += btn.id == "left" ? -firstCardWidth : firstCardWidth;
  });
});

const dragStart = (e) => {
  isDragging = true;
  carousel.classList.add("dragging");
  // Karuselin ilkin kursorunu və sürüşdürmə mövqeyini qeyd edir
  startX = e.pageX;
  startScrollLeft = carousel.scrollLeft;
};

const dragging = (e) => {
  if (!isDragging) return; // isDragging yanlışdırsa, buradan qayıdın
 // Kursorun hərəkəti əsasında karuselin sürüşmə mövqeyini yeniləyir
  carousel.scrollLeft = startScrollLeft - (e.pageX - startX);
};

const dragStop = () => {
  isDragging = false;
  carousel.classList.remove("dragging");
};

const infiniteScroll = () => {
  // Kursorun hərəkəti əsasında karuselin sürüşmə mövqeyini yeniləyir
  if (carousel.scrollLeft === 0) {
    carousel.classList.add("no-transition");
    carousel.scrollLeft = carousel.scrollWidth - 2 * carousel.offsetWidth;
    carousel.classList.remove("no-transition");
  }

  // Karusel sonundadırsa, başlanğıca doğru sürüşdürün
  else if (
    Math.ceil(carousel.scrollLeft) ===
    carousel.scrollWidth - carousel.offsetWidth
  ) {
    carousel.classList.add("no-transition");
    carousel.scrollLeft = carousel.offsetWidth;
    carousel.classList.remove("no-transition");
  }

  // Mövcud fasiləni təmizləyin və siçan karuselin üzərində dayanmırsa, avtomatik oxumağa başlayın
  clearTimeout(timeoutId);
  if (!wrapper.matches(":hover")) autoPlay();
};

const autoPlay = () => {
  if (window.innerWidth < 800 || !isAutoPlay) return; // Pəncərə 800-dən kiçikdirsə və ya isAutoPlay yanlışdırsa, qaytarın
  // Hər 2500 ms-dən sonra karuseli avtomatik oynatın
  timeoutId = setTimeout(() => (carousel.scrollLeft += firstCardWidth), 2500);
};
autoPlay();

carousel.addEventListener("mousedown", dragStart);
carousel.addEventListener("mousemove", dragging);
document.addEventListener("mouseup", dragStop);
carousel.addEventListener("scroll", infiniteScroll);
wrapper.addEventListener("mouseenter", () => clearTimeout(timeoutId));
wrapper.addEventListener("mouseleave", autoPlay);
