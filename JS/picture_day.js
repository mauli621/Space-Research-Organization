var API_URL = "https://science.nasa.gov/wp-json/wp/v2/apod-basic";
var API_KEY = "7BGm8RbDT9kDrctDjnqz8tQ77KbRzLB7tFmLpnFh";
var FIRST_DATE = "1995-06-16";

var dateInput = document.getElementById("date");
var prevButton = document.getElementById("prev");
var nextButton = document.getElementById("next");
var latestButton = document.getElementById("latest");
var randomButton = document.getElementById("random");
var statusBox = document.getElementById("status");
var card = document.getElementById("card");
var media = document.getElementById("media");

var currentDate = "";
var latestDate = "";
var requestId = 0;

// Create a date URL for NASA's API.
function getApiUrl(date, isRandom) {
  if (date && !isRandom) {
    var formattedDate = date.replace(/-/g, "").slice(2);

    return API_URL + "/" + formattedDate;
  }

  if (isRandom) {
    return API_URL + "/?count=1";
  }

  return API_URL + "/";
}

// Add or subtract days from a date.
function addDays(dateText, days) {
  var date = new Date(dateText + "T00:00:00Z");

  date.setUTCDate(date.getUTCDate() + days);

  return date.toISOString().slice(0, 10);
}

// Show loading and error messages.
function setStatus(message, isError) {
  statusBox.textContent = message;
  statusBox.classList.toggle("apod-error", isError);
}

// Enable or disable navigation buttons.
function updateControls() {
  dateInput.min = FIRST_DATE;

  if (latestDate) {
    dateInput.max = latestDate;
  }

  dateInput.value = currentDate;

  prevButton.disabled = !currentDate || currentDate <= FIRST_DATE;

  nextButton.disabled =
    !currentDate || !latestDate || currentDate >= latestDate;

  latestButton.disabled = !latestDate || currentDate === latestDate;

  randomButton.disabled = false;
}

// Show the image or a link to NASA's page.
function showMedia(data) {
  media.innerHTML = "";

  if (data.media_type === "image" && data.hdurl) {
    var img = document.createElement("img");

    img.className = "apod-image";
    img.src = data.hdurl;
    img.alt = data.alt || data.title || "NASA astronomy picture";
    img.loading = "lazy";

    img.onerror = function () {
      media.innerHTML = "";

      var link = document.createElement("a");

      link.href = data.permalink || data.url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.textContent = "View image on NASA's website";

      media.appendChild(link);
    };

    media.appendChild(img);
  } else {
    var link = document.createElement("a");

    link.className = "apod-link";
    link.href = data.permalink || data.url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = "View astronomy media on NASA's website";

    media.appendChild(link);
  }
}

// Remove HTML tags from credit information.
function cleanCredit(credit) {
  var temp = document.createElement("div");

  temp.innerHTML = credit || "";

  return temp.textContent.trim() || "Credit: NASA";
}

// Display the picture details.
function showPicture(data) {
  showMedia(data);

  document.getElementById("name").textContent =
    data.title || "Astronomy Picture of the Day";

  document.getElementById("picture-date").textContent = data.date || "";

  document.getElementById("credit").textContent = cleanCredit(
    data.credit || data.copyright,
  );

  // NASA's explanation can contain formatting and links.
  document.getElementById("text").innerHTML =
    data.explanation || "No explanation is available.";

  var hdLink = document.getElementById("hd-link");

  if (data.media_type === "image" && data.hdurl) {
    hdLink.href = data.hdurl;
    hdLink.target = "_blank";
    hdLink.rel = "noopener noreferrer";
    hdLink.hidden = false;
  } else {
    hdLink.hidden = true;
  }

  card.hidden = false;
}

// Load a picture by date, or load a random picture.
function loadPicture(date, isRandom) {
  requestId++;

  var thisRequest = requestId;
  var url = getApiUrl(date, isRandom);

  setStatus("Loading picture...", false);

  prevButton.disabled = true;
  nextButton.disabled = true;
  latestButton.disabled = true;
  randomButton.disabled = true;

  fetch(url)
    .then(function (response) {
      if (!response.ok) {
        throw new Error(
          "NASA API error: " + response.status + ". Please try again.",
        );
      }

      return response.json();
    })
    .then(function (data) {
      if (thisRequest !== requestId) {
        return;
      }

      // The API may return one object or an array.
      var picture;

      if (Array.isArray(data)) {
        picture = data[0];
      } else {
        picture = data;
      }

      if (!picture || !picture.date) {
        throw new Error("No picture was found for this request.");
      }

      // Do not allow a future or invalid date to be displayed
      // as if it were the requested date.
      if (date && !isRandom && picture.date !== date) {
        throw new Error("NASA did not return the requested date.");
      }

      currentDate = picture.date;

      // Set the latest date from the latest-picture request.
      if (!date && !isRandom) {
        latestDate = picture.date;
      }

      showPicture(picture);

      setStatus("", false);
      updateControls();
    })
    .catch(function (error) {
      if (thisRequest !== requestId) {
        return;
      }

      setStatus(error.message || "Unable to load NASA's picture.", true);

      updateControls();
    });
}

// Previous day's picture.
prevButton.addEventListener("click", function () {
  if (currentDate > FIRST_DATE) {
    loadPicture(addDays(currentDate, -1), false);
  }
});

// Next day's picture.
nextButton.addEventListener("click", function () {
  if (currentDate && latestDate && currentDate < latestDate) {
    loadPicture(addDays(currentDate, 1), false);
  }
});

// Latest available picture.
latestButton.addEventListener("click", function () {
  loadPicture("", false);
});

// Random picture selected by NASA.
randomButton.addEventListener("click", function () {
  loadPicture("", true);
});

// Load a picture when the user selects a date.
dateInput.addEventListener("change", function () {
  var selectedDate = dateInput.value;

  if (!selectedDate) {
    return;
  }

  if (selectedDate < FIRST_DATE) {
    setStatus("Please select a date from June 16, 1995 onward.", true);
    updateControls();
    return;
  }

  if (latestDate && selectedDate > latestDate) {
    setStatus("Please select a date up to " + latestDate + ".", true);
    updateControls();
    return;
  }

  loadPicture(selectedDate, false);
});

// Load the latest picture when the page opens.
loadPicture("", false);
