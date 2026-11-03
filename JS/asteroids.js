
document.addEventListener("DOMContentLoaded", function () {
    const API_URL = "https://api.nasa.gov/neo/rest/v1/feed";
    const API_KEY = "PzrFbprKTRkPtmJ6M88cpCHRh76QCqWzh8jQdMQT";

    const objectList = document.getElementById("objectList");
    const searchInput = document.getElementById("searchInput");
    const objectFilter = document.getElementById("objectFilter");
    const dataStatus = document.getElementById("dataStatus");
    const reloadBtn = document.getElementById("reloadBtn");

    let objects = [];

    // Get today's date in YYYY-MM-DD format.
    function getDate(date) {
        return date.toISOString().split("T")[0];
    }

    // Format large numbers.
    function formatNum(value, decimals = 0) {
        const number = Number(value);

        if (!Number.isFinite(number)) {
            return "Unavailable";
        }

        return number.toLocaleString("en-US", {
            maximumFractionDigits: decimals
        });
    }

    // Format an approach date.
    function formatDate(value) {
        if (!value) {
            return "Unavailable";
        }

        const date = new Date(value + "T00:00:00Z");

        return Number.isNaN(date.getTime())
            ? value
            : date.toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                timeZone: "UTC"
            });
    }

    // Load near-Earth objects from NASA.
    async function loadObjects() {
        reloadBtn.disabled = true;
        dataStatus.textContent = "Loading asteroid data...";

        try {
            const today = new Date();
            const endDate = new Date(today);
            endDate.setUTCDate(endDate.getUTCDate() + 6);

            const url =
                API_URL +
                "?start_date=" + getDate(today) +
                "&end_date=" + getDate(endDate) +
                "&api_key=" + API_KEY;

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error("NASA API returned error " + response.status);
            }

            const data = await response.json();

            objects = Object.values(data.near_earth_objects || {})
                .flat()
                .sort(function (a, b) {
                    const dateA = a.close_approach_data[0]?.close_approach_date || "";
                    const dateB = b.close_approach_data[0]?.close_approach_date || "";

                    return dateA.localeCompare(dateB);
                });

            dataStatus.textContent =
                objects.length +
                " near-Earth asteroids found for the selected date range.";

            showObjects();

        } catch (error) {
            console.error("Asteroid data error:", error);

            dataStatus.textContent =
                "Unable to load live data. Check your internet connection and try again.";

            objectList.replaceChildren();

        } finally {
            reloadBtn.disabled = false;
        }
    }

    // Display objects matching the search and filter.
    function showObjects() {
        const search = searchInput.value.trim().toLowerCase();
        const filter = objectFilter.value;

        const filteredObjects = objects.filter(function (item) {
            const name = item.name.toLowerCase();
            const hazardous = item.is_potentially_hazardous_asteroid;

            const matchesName = name.includes(search);

            const matchesFilter =
                filter === "all" ||
                (filter === "hazardous" && hazardous) ||
                (filter === "safe" && !hazardous);

            return matchesName && matchesFilter;
        });

        objectList.replaceChildren();

        if (filteredObjects.length === 0) {
            const message = document.createElement("p");
            message.className = "ast-status";
            message.textContent = objects.length
                ? "No objects match your search."
                : "No object data is available right now.";

            objectList.appendChild(message);
            return;
        }

        filteredObjects.forEach(function (item, index) {
            const approach = item.close_approach_data[0] || {};
            const diameter = item.estimated_diameter?.meters || {};
            const hazardous = item.is_potentially_hazardous_asteroid;

            const card = document.createElement("article");
            card.className = "ast-item";
            card.style.animationDelay = Math.min(index * 40, 300) + "ms";

            const label = document.createElement("div");
            label.className = hazardous
                ? "ast-label ast-warn"
                : "ast-label";

            label.textContent = hazardous
                ? "POTENTIALLY HAZARDOUS"
                : "NEAR-EARTH ASTEROID";

            const title = document.createElement("h3");
            title.textContent = item.name;

            const details = document.createElement("div");

            const rows = [
                [
                    "Approach date",
                    formatDate(approach.close_approach_date)
                ],
                [
                    "Estimated diameter",
                    formatNum(diameter.estimated_diameter_min, 0) +
                    "–" +
                    formatNum(diameter.estimated_diameter_max, 0) +
                    " m"
                ],
                [
                    "Relative speed",
                    formatNum(
                        approach.relative_velocity?.kilometers_per_second,
                        2
                    ) + " km/s"
                ],
                [
                    "Distance from Earth",
                    formatNum(
                        approach.miss_distance?.kilometers,
                        0
                    ) + " km"
                ]
            ];

            rows.forEach(function (row) {
                const p = document.createElement("p");
                const strong = document.createElement("strong");

                strong.textContent = row[0] + ": ";
                p.appendChild(strong);
                p.appendChild(document.createTextNode(row[1]));

                details.appendChild(p);
            });

            const link = document.createElement("a");
            link.href = item.nasa_jpl_url;
            link.target = "_blank";
            link.rel = "noopener noreferrer";
            link.className = "ast-label";
            link.textContent = "View NASA details ↗";

            card.appendChild(label);
            card.appendChild(title);
            card.appendChild(details);
            card.appendChild(link);

            objectList.appendChild(card);
        });
    }

    // Search and filter events.
    searchInput.addEventListener("input", showObjects);
    objectFilter.addEventListener("change", showObjects);
    reloadBtn.addEventListener("click", loadObjects);

    // Load data when the page opens.
    loadObjects();
});
