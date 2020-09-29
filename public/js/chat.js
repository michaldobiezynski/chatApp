const socket = io();

//Elements
const $chatForm = document.querySelector("form");
const $messageFormInput = $chatForm.querySelector("input");
const $messageFormButton = $chatForm.querySelector("button");
const $locationButton = document.querySelector("#send-location");
const $messages = document.querySelector("#messages");

//Templates
const messageTemplate = document.querySelector("#message-template").innerHTML;
const locationTemplate = document.querySelector("#location-template").innerHTML;
const sidebarTemplate = document.querySelector("#sidebar-template").innerHTML;

//Options
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

socket.on("message", (message) => {
  console.log(message);
  const html = Mustache.render(messageTemplate, {
    username: message.username,
    message: message.text,
    createdAt: moment(message.createdAt).format("h:mm a"),
  });
  $messages.insertAdjacentHTML("beforeend", html);
});

socket.on("locationMessage", (location) => {
  console.log(location);
  const html = Mustache.render(locationTemplate, {
    username: location.username,
    url: location.url,
    createdAt: moment(location.createdAt).format("h:mm a"),
  });
  $messages.insertAdjacentHTML("beforeend", html);
});

socket.on("roomData", ({ room, users }) => {
  const html = Mustache.render(sidebarTemplate, {
    room,
    users,
  });
  document.querySelector("#sidebar").innerHTML = html;
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

socket.emit("join", { username, room }, (error) => {
  if (error) {
    alert(error);
    location.href = "/";
  }
});
