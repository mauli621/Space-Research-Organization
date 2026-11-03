document.addEventListener("DOMContentLoaded", function () {
  // Get all filter buttons and planet cards
  const filterButtons = document.querySelectorAll(".exo-filter");
  const planetCards = document.querySelectorAll(".exo-planet-card");

  // Filter planets
  for (let i = 0; i < filterButtons.length; i++) {
    filterButtons[i].addEventListener("click", function () {
      let selectedType = this.getAttribute("data-filter");

      // Remove active class from every filter button
      for (let j = 0; j < filterButtons.length; j++) {
        filterButtons[j].classList.remove("active");
      }

      // Highlight selected button
      this.classList.add("active");

      // Show matching planet cards
      for (let j = 0; j < planetCards.length; j++) {
        let planetType = planetCards[j].getAttribute("data-type");

        if (selectedType === "all" || selectedType === planetType) {
          planetCards[j].classList.remove("exo-hidden");
        } else {
          planetCards[j].classList.add("exo-hidden");
        }
      }
    });
  }

  // Get video popup elements
  const popup = document.getElementById("exo-video-popup");
  const openButton = document.getElementById("exo-open-video");
  const bottomButton = document.getElementById("exo-open-video-bottom");
  const closeButton = document.getElementById("exo-close-video");
  const video = document.getElementById("exo-space-video");

  // Open video popup
  function showVideo() {
    popup.classList.add("exo-show");
    popup.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    video.play().catch(function () {
      // The user can press Play manually.
    });
  }

  // Close video popup
  function hideVideo() {
    popup.classList.remove("exo-show");
    popup.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";

    video.pause();
    video.currentTime = 0;
  }

  // Open from hero button
  if (openButton) {
    openButton.addEventListener("click", showVideo);
  }

  // Open from bottom button
  if (bottomButton) {
    bottomButton.addEventListener("click", showVideo);
  }

  // Close using the close button
  if (closeButton) {
    closeButton.addEventListener("click", hideVideo);
  }

  // Close when clicking outside the video
  if (popup) {
    popup.addEventListener("click", function (event) {
      if (event.target === popup) {
        hideVideo();
      }
    });
  }

  // Close when pressing Escape
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && popup.classList.contains("exo-show")) {
      hideVideo();
    }
  });
});
