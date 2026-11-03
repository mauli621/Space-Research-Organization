
const imgs = document.querySelectorAll(".ds img");

imgs.forEach(function (img) {
    img.addEventListener("error", function () {
        if (img.dataset.fallback) {
            img.style.display = "none";
            return;
        }

        img.dataset.fallback = "true";
        img.src =
            "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=1000&q=80";
    });
});
