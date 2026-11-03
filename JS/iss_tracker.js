
document.addEventListener("DOMContentLoaded", function () {
    const API_URL = "https://api.wheretheiss.at/v1/satellites/25544";
    const REFRESH_INTERVAL = 5000;

    const statusText = document.getElementById("connectionStatus");
    const statusDot = document.querySelector(".status-dot");
    const refreshButton = document.getElementById("refreshButton");

    let issMarker = null;
    let footprintCircle = null;
    let requestInProgress = false;

    // Create the interactive map.
    const map = L.map("issMap", {
        worldCopyJump: true
    }).setView([0, 0], 2);
    
    // Fix map tile alignment.
    setTimeout(function () {
        map.invalidateSize();
    }, 300);


    // Add the map background.
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18
    }).addTo(map);

    // Custom ISS marker.
    const issIcon = L.divIcon({
        className: "",
        html: '<div class="iss-marker">✦</div>',
        iconSize: [42, 42],
        iconAnchor: [21, 21]
    });
 
    function setStatus(message, state) {
        statusText.textContent = message;
        statusDot.classList.remove("connected", "error");

        if (state) {
            statusDot.classList.add(state);
        }
    }

    function formatNumber(value, decimals) {
        const number = Number(value);

        if (!Number.isFinite(number)) {
            return "--";
        }

        return number.toLocaleString("en-US", {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        });
    }

    function formatDate(timestamp) {
        if (!timestamp) {
            return "Unavailable";
        }

        return new Date(timestamp * 1000).toLocaleString();
    }

    async function updateISSLocation() {
        if (requestInProgress) {
            return;
        }

        requestInProgress = true;
        refreshButton.disabled = true;

        try {
            const response = await fetch(API_URL, {
                cache: "no-store"
            });

            if (!response.ok) {
                throw new Error("ISS service returned HTTP " + response.status);
            }

            const data = await response.json();

            const latitude = Number(data.latitude);
            const longitude = Number(data.longitude);

            if (
                !Number.isFinite(latitude) ||
                !Number.isFinite(longitude)
            ) {
                throw new Error("Invalid ISS coordinates received.");
            }

            const position = [latitude, longitude];

            // Update latitude and longitude.
            document.getElementById("latitude").textContent =
                formatNumber(latitude, 4) + "°";

            document.getElementById("longitude").textContent =
                formatNumber(longitude, 4) + "°";

            // Update altitude and orbital velocity.
            document.getElementById("altitude").textContent =
                formatNumber(data.altitude, 1);

            document.getElementById("velocity").textContent =
                formatNumber(data.velocity, 0);

            // Update additional tracking information.
            document.getElementById("visibility").textContent =
                data.visibility
                    ? data.visibility.charAt(0).toUpperCase() +
                    data.visibility.slice(1)
                    : "Unavailable";

            document.getElementById("footprint").textContent =
                formatNumber(data.footprint, 0);

            const updatedTime = formatDate(data.timestamp);

            document.getElementById("lastUpdate").textContent =
                updatedTime;

            document.getElementById("mapUpdated").textContent =
                "Updated: " + new Date().toLocaleTimeString();

            // Create the marker on the first successful request.
            if (!issMarker) {
                issMarker = L.marker(position, {
                    icon: issIcon,
                    title: "International Space Station"
                }).addTo(map);

                issMarker.bindPopup(
                    "<strong>International Space Station</strong><br>" +
                    "Latitude: " + formatNumber(latitude, 4) + "°<br>" +
                    "Longitude: " + formatNumber(longitude, 4) + "°"
                );

                footprintCircle = L.circle(position, {
                    radius: Number(data.footprint || 0) * 500,
                    color: "#4ba3ff",
                    fillColor: "#4ba3ff",
                    fillOpacity: 0.08,
                    weight: 1
                }).addTo(map);

                map.setView(position, 3);
            } else {
                issMarker.setLatLng(position);

                if (footprintCircle) {
                    footprintCircle.setLatLng(position);

                    if (Number.isFinite(Number(data.footprint))) {
                        footprintCircle.setRadius(
                            Number(data.footprint) * 500
                        );
                    }
                }

                issMarker.setPopupContent(
                    "<strong>International Space Station</strong><br>" +
                    "Latitude: " + formatNumber(latitude, 4) + "°<br>" +
                    "Longitude: " + formatNumber(longitude, 4) + "°<br>" +
                    "Altitude: " + formatNumber(data.altitude, 1) + " km"
                );

                // Keep the map following the ISS.
                map.flyTo(position, 3, {
                    animate: true,
                    duration: 1.2
                });
            }

            setStatus("Live tracking connected", "connected");

        } catch (error) {
            console.error("ISS tracking error:", error);

            setStatus(
                "Unable to load live data. Retrying automatically...",
                "error"
            );
        } finally {
            requestInProgress = false;
            refreshButton.disabled = false;
        }
    }

    // Manual refresh.
    refreshButton.addEventListener("click", updateISSLocation);

    // Load the initial position.
    updateISSLocation();

    // Refresh the position every five seconds.
    window.setInterval(updateISSLocation, REFRESH_INTERVAL);
});
