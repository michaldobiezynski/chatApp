const socket = io();

//Elements
const $chatForm = document.querySelector("form");
const $messageFormInput = $chatForm.querySelector("input");
const $messageFormButton = $chatForm.querySelector("button");
const $locationButton = document.querySelector("#send-location");

socket.on("message", (message) => {
  console.log(message);
});

$chatForm.addEventListener("submit", (event) => {
  event.preventDefault();

  $messageFormButton.setAttribute("disabled", "disabled");

  const messageData = event.target.elements.message.value;
  socket.emit("sendMessage", messageData, (error) => {
    $messageFormButton.removeAttribute("disabled");
    $chatForm.reset();
    $messageFormInput.focus();
    if (error) {
      return console.log(error);
    }

    console.log("Message delivered!");
  });
});

$locationButton.addEventListener("click", () => {
  $locationButton.setAttribute("disabled", "disabled");
  if (!navigator.geolocation) {
    return alert("Geolocation is not supported by your browser.");
    $locationButton.removeAttribute("disabled");
  } else {
    navigator.geolocation.getCurrentPosition((position) => {
      console.log(position);
      socket.emit(
        "sendLocation",
        {
          long: position.coords.longitude,
          lat: position.coords.latitude,
        },
        (message) => {
          $locationButton.removeAttribute("disabled");
          console.log(message);
        }
      );
    });
  }
});
