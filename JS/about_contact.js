var form = document.getElementById("contactForm");
var message = document.getElementById("about-form-message");

form.addEventListener("submit", function (event) {
  event.preventDefault();

  var name = document.getElementById("name").value.trim();
  var email = document.getElementById("email").value.trim();
  var subject = document.getElementById("subject").value;
  var userMessage = document.getElementById("userMessage").value.trim();

  if (name === "" || email === "" || subject === "" || userMessage === "") {
    message.textContent = "Please fill in all fields.";
    return;
  }

  message.textContent =
    "Thank you, " +
    name +
    "! Your form is valid, but the message has not been sent.";

  form.reset();
});
