
const imgs = document.querySelectorAll(".as img");

imgs.forEach(function (img) {
    img.addEventListener("error", function () {
        if (img.dataset.failed) {
            img.style.display = "none";
            return;
        }

        img.dataset.failed = "true";
        img.src =
            "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=1000&q=80";
    });
});
