fetch("components/header.html")
  .then(function (response) {
    return response.text();
  })
  .then(function (data) {
    document.getElementById("header").innerHTML = data;
  });

fetch("components/footer.html")
  .then(function (response) {
    return response.text();
  })
  .then(function (data) {
    document.getElementById("footer").innerHTML = data;
  });
