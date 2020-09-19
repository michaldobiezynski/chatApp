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
