var planets = [
  {
    name: "Mercury",
    type: "Rocky",
    color: "#b5b0a8",
    image: "images/mercury.png",
    text: "The smallest planet and the closest to the Sun, covered in craters like our Moon.",
    distance: "58 million km",
    diameter: "4,879 km",
    year: "88 Earth days",
    day: "59 Earth days",
    moons: "0",
    temp: "167 °C average",
    gravity: "3.7 m/s²",
    note: "One sunrise to the next takes 176 Earth days, twice as long as its 88-day year.",
  },
  {
    name: "Venus",
    type: "Rocky",
    color: "#e8c17a",
    image: "images/venus.png",
    text: "Wrapped in thick clouds that trap heat, making it the hottest planet.",
    distance: "108 million km",
    diameter: "12,104 km",
    year: "225 Earth days",
    day: "243 Earth days",
    moons: "0",
    temp: "464 °C average",
    gravity: "8.9 m/s²",
    note: "Venus spins backwards, so the Sun rises in the west.",
  },
  {
    name: "Earth",
    type: "Rocky",
    color: "#4f9cf0",
    image: "images/earth.png",
    text: "Our home, and the only known world with life and liquid water on its surface.",
    distance: "150 million km",
    diameter: "12,742 km",
    year: "365 days",
    day: "24 hours",
    moons: "1",
    temp: "15 °C average",
    gravity: "9.8 m/s²",
    note: "About 71% of Earth's surface is covered by water.",
  },
  {
    name: "Mars",
    type: "Rocky",
    color: "#d9663f",
    image: "images/mars.png",
    text: "The red planet, with dry riverbeds, polar ice caps and the tallest volcano known.",
    distance: "228 million km",
    diameter: "6,779 km",
    year: "687 Earth days",
    day: "24.6 hours",
    moons: "2",
    temp: "-65 °C average",
    gravity: "3.7 m/s²",
    note: "Olympus Mons is about three times taller than Mount Everest.",
  },
  {
    name: "Jupiter",
    type: "Gas giant",
    color: "#d8a77a",
    image: "images/jupyter.png",
    text: "The largest planet, a giant ball of hydrogen and helium with banded clouds.",
    distance: "778 million km",
    diameter: "139,820 km",
    year: "11.9 Earth years",
    day: "9.9 hours",
    moons: "95",
    temp: "-110 °C (cloud tops)",
    gravity: "24.8 m/s²",
    note: "The Great Red Spot is a storm larger than Earth that has raged for centuries.",
  },
  {
    name: "Saturn",
    type: "Gas giant",
    color: "#e6d29a",
    image: "images/saturn.png",
    text: "Famous for its bright rings made of ice and rock.",
    distance: "1.4 billion km",
    diameter: "116,460 km",
    year: "29.4 Earth years",
    day: "10.7 hours",
    moons: "146",
    temp: "-140 °C (cloud tops)",
    gravity: "10.4 m/s²",
    note: "Saturn is less dense than water, so it would float in a big enough bathtub.",
  },
  {
    name: "Uranus",
    type: "Ice giant",
    color: "#8fe0e6",
    image: "images/uranus.png",
    text: "A pale blue-green ice giant that spins on its side.",
    distance: "2.9 billion km",
    diameter: "50,724 km",
    year: "84 Earth years",
    day: "17.2 hours",
    moons: "28",
    temp: "-195 °C average",
    gravity: "8.9 m/s²",
    note: "Its poles take turns facing the Sun for decades at a time.",
  },
  {
    name: "Neptune",
    type: "Ice giant",
    color: "#4c6ef5",
    image: "images/neptune.png",
    text: "The farthest planet, dark, cold and whipped by supersonic winds.",
    distance: "4.5 billion km",
    diameter: "49,244 km",
    year: "165 Earth years",
    day: "16.1 hours",
    moons: "16",
    temp: "-200 °C average",
    gravity: "11.2 m/s²",
    note: "Neptune has the fastest winds in the solar system, over 2,000 km/h.",
  },
];

var grid = document.getElementById("grid");
var filters = document.getElementById("filters");

function makeFact(label, value) {
  return (
    '<div class="p-fact"><dt class="p-fact-label">' +
    label +
    '</dt><dd class="p-fact-value">' +
    value +
    "</dd></div>"
  );
}

function showPlanets(type) {
  grid.innerHTML = "";

  planets.forEach(function (p) {
    if (type !== "all" && p.type !== type) return;

    var card = document.createElement("article");
    card.className = "p-card";
    card.innerHTML =
      '<div class="p-card-image"></div>' +
      '<div class="p-card-body">' +
      '<h2 class="p-card-name">' +
      p.name +
      "</h2>" +
      '<p class="p-card-type">' +
      p.type +
      " planet</p>" +
      '<p class="p-card-text">' +
      p.text +
      "</p>" +
      '<dl class="p-facts">' +
      makeFact("Distance from Sun", p.distance) +
      makeFact("Diameter", p.diameter) +
      makeFact("Year length", p.year) +
      makeFact("Day length", p.day) +
      makeFact("Moons", p.moons) +
      makeFact("Temperature", p.temp) +
      makeFact("Gravity", p.gravity) +
      "</dl>" +
      '<p class="p-card-note">' +
      p.note +
      "</p>" +
      "</div>";

    var imageBox = card.querySelector(".p-card-image");
    var img = document.createElement("img");
    img.className = "p-card-photo";
    img.src = p.image;
    img.alt = "Photo of " + p.name;
    img.onerror = function () {
      var circle = document.createElement("div");
      circle.className = "p-card-fallback";
      circle.style.background = p.color;
      imageBox.innerHTML = "";
      imageBox.appendChild(circle);
    };
    imageBox.appendChild(img);

    grid.appendChild(card);
  });
}

filters.addEventListener("click", function (e) {
  var btn = e.target.closest(".p-button");
  if (!btn) return;
  filters.querySelectorAll(".p-button").forEach(function (b) {
    b.classList.remove("p-active");
  });
  btn.classList.add("p-active");
  showPlanets(btn.getAttribute("data-type"));
});

showPlanets("all");
