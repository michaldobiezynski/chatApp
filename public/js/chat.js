const socket = io();

socket.on("message", (message) => {
  console.log(message);
});

const chatForm = document.querySelector("form");

chatForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const messageData = event.target.elements.message.value;
  socket.emit("sendMessage", messageData);
  chatForm.reset();
});

document.querySelector("#send-location").addEventListener("click", () => {
  if (!navigator.geolocation) {
    return alert("Geolocation is not supported by your browser.");
  } else {
    navigator.geolocation.getCurrentPosition((position) => {
      console.log(position);
      socket.emit("sendLocation", {
        long: position.coords.longitude,
        lat: position.coords.latitude,
      });
    });
  }
});
