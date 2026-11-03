
const alertList = document.getElementById("alertList");
const alertStatus = document.getElementById("alertStatus");
const refreshBtn = document.getElementById("refreshAlerts");

async function loadAlerts() {
    alertStatus.textContent = "Loading latest alerts...";
    alertList.replaceChildren();

    refreshBtn.disabled = true;
    refreshBtn.textContent = "Loading...";

    try {
        const response = await fetch(
            "https://services.swpc.noaa.gov/products/alerts.json",
            { cache: "no-store" }
        );

        if (!response.ok) {
            throw new Error("NOAA request failed: " + response.status);
        }

        const data = await response.json();

        if (!Array.isArray(data) || data.length === 0) {
            alertStatus.textContent = "No recent alerts are available.";
            return;
        }

        const alerts = data.slice(-8).reverse();

        alertStatus.textContent =
            "Showing the latest " + alerts.length + " NOAA alerts.";

        alerts.forEach(function (alert) {
            const item = document.createElement("article");
            item.className = "alert-item";

            const title = document.createElement("h3");
            title.textContent = alert.product_id || "Space Weather Alert";

            const message = document.createElement("p");
            message.textContent =
                alert.message || "No alert details available.";

            const date = document.createElement("span");
            date.className = "alert-date";

            if (alert.issue_datetime) {
                const time = new Date(alert.issue_datetime);

                date.textContent = "Issued: " +
                    (isNaN(time.getTime())
                        ? alert.issue_datetime
                        : time.toLocaleString());
            } else {
                date.textContent = "Issue time unavailable";
            }

            item.append(title, message, date);
            alertList.appendChild(item);
        });

    } catch (error) {
        console.error("Space weather alerts error:", error);

        alertStatus.textContent =
            "Unable to load live alerts. Please try again or visit NOAA.";

        const link = document.createElement("a");
        link.className = "link";
        link.href = "https://www.spaceweather.gov/";
        link.target = "_blank";
        link.rel = "noopener";
        link.textContent = "Check official NOAA alerts ↗";

        alertList.appendChild(link);

    } finally {
        refreshBtn.disabled = false;
        refreshBtn.textContent = "↻ Refresh";
    }
}

refreshBtn.addEventListener("click", loadAlerts);

loadAlerts();
