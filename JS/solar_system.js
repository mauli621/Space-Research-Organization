var planets = [
  {
    name: "Mercury",
    color: "#b5b0a8",
    orbit: 15 /* round on which planet rotates*/,
    dot: 8,
    time: 8,
    distance: "58 million km",
    year: "88 days",
    moons: "0",
    size: "4,879 km",
    text: "The smallest planet and the closest to the Sun. Days are scorching and nights are freezing.",
  },
  {
    name: "Venus",
    color: "#e8c17a",
    orbit: 23,
    dot: 12,
    time: 14,
    distance: "108 million km",
    year: "225 days",
    moons: "0",
    size: "12,104 km",
    text: "The hottest planet, wrapped in thick clouds that trap heat. It spins backwards.",
  },
  {
    name: "Earth",
    color: "#4f9cf0",
    orbit: 32,
    dot: 13,
    time: 20,
    distance: "150 million km",
    year: "365 days",
    moons: "1",
    size: "12,742 km",
    text: "Our home, and the only known planet with life and liquid water on its surface.",
  },
  {
    name: "Mars",
    color: "#d9663f",
    orbit: 41,
    dot: 10,
    time: 28,
    distance: "228 million km",
    year: "687 days",
    moons: "2",
    size: "6,779 km",
    text: "The red planet. Rovers are exploring its dry riverbeds and giant volcanoes.",
  },
  {
    name: "Jupiter",
    color: "#d8a77a",
    orbit: 54,
    dot: 24,
    time: 45,
    distance: "778 million km",
    year: "12 years",
    moons: "95",
    size: "139,820 km",
    text: "The largest planet. Its Great Red Spot is a storm bigger than Earth.",
  },
  {
    name: "Saturn",
    color: "#e6d29a",
    orbit: 68,
    dot: 20,
    time: 62,
    distance: "1.4 billion km",
    year: "29 years",
    moons: "146",
    size: "116,460 km",
    text: "Famous for its bright rings made of ice and rock. It is light enough to float on water.",
    ring: true,
  },
  {
    name: "Uranus",
    color: "#8fe0e6",
    orbit: 81,
    dot: 15,
    time: 85,
    distance: "2.9 billion km",
    year: "84 years",
    moons: "28",
    size: "50,724 km",
    text: "An ice giant that spins on its side, so its poles take turns facing the Sun.",
  },
  {
    name: "Neptune",
    color: "#4c6ef5",
    orbit: 94,
    dot: 15,
    time: 110,
    distance: "4.5 billion km",
    year: "165 years",
    moons: "16",
    size: "49,244 km",
    text: "The farthest planet. It is dark, cold and has the fastest winds in the solar system.",
  },
];

var system = document.getElementById("system");
var buttons = [];

planets.forEach(function (p, i) {
  var orbit = document.createElement("div");
  orbit.className = "orbit";
  orbit.style.width = p.orbit + "%";
  orbit.style.marginLeft = -p.orbit / 2 + "%";
  orbit.style.marginTop = -p.orbit / 2 + "%";
  orbit.style.animationDuration = p.time + "s";
  orbit.style.animationDelay = -i * 7 + "s";

  var btn = document.createElement("button");
  btn.className = "planet" + (p.ring ? " saturn-ring" : "");
  btn.type = "button";
  btn.setAttribute("aria-label", p.name);
  btn.style.background = p.color;
  btn.style.width = p.dot + "px";
  btn.style.height = p.dot + "px";
  btn.style.marginLeft = -p.dot / 2 + "px";
  btn.style.marginTop = -p.dot / 2 + "px";
  btn.addEventListener("click", function () {
    show(i);
  });

  orbit.appendChild(btn);
  system.appendChild(orbit);
  buttons.push(btn);
});

function show(i) {
  var p = planets[i];
  buttons.forEach(function (b, n) {
    b.classList.toggle("active", n === i);
  });
  document.getElementById("name").textContent = p.name;
  document.getElementById("text").textContent = p.text;
  document.getElementById("distance").textContent = p.distance;
  document.getElementById("year").textContent = p.year;
  document.getElementById("moons").textContent = p.moons;
  document.getElementById("size").textContent = p.size;
}

var toggle = document.getElementById("toggle");
toggle.addEventListener("click", function () {
  var paused = system.classList.toggle("paused");
  toggle.textContent = paused ? "Play orbits" : "Pause orbits";
});

show(2);
