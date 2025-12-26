import { HorizontalCarousel } from "./infinite-scroller.js";

const scrollers = document.querySelectorAll(".scroller");
for (const element of scrollers) {
  new HorizontalCarousel(element, { speed: 0.01 });
}
