// make connection

var socket = io.connect("http://localhost:3001");
var message = document.getElementById("message");
handle = document.getElementById("handle");
btn = document.getElementById("send");
output = document.getElementById("output");
feedback = document.getElementById("feedback");
notify = document.getElementById("notify");
disconnected = document.getElementById("disconnected");

//emitEvent

btn.addEventListener("click", function () {
  socket.emit("chat", {
    message: message.value,
    handle: handle.value,
  });
  message.value = "";
});
message.addEventListener("keypress", function () {
  socket.emit("typing", handle.value);
});
socket.on("chat", function (data) {
  output.innerHTML +=
    "<p><strong>" + data.handle + ":</strong>" + data.message + "</p>";
});
socket.on("typing", function (data) {
  feedback.innerHTML = "<p><em>" + data + "is typing a message...</em></p>";
});
socket.on("notify", function () {
  feedback.innerHTML = "<p><em> a new user joined the discussion </em></p>";
});
socket.on("disconnected", function () {
  disconnected.innerHTML = "<p><em> a user Disconnected</em></p>";
});

// function CreateToast() {
//   // Toast notification

//   var toastDiv = document.createElement("div");

//   // Give it a unique id
//   toastDiv.id = "toast_" + toastCounter;

//   // Make it hidden (necessary to slideDown)
//   toastDiv.style.display = "none";

//   var toastMessage;
//   var foreColor;
//   var backgroundColor;
//   var borderColor;
//   toastMessage = "Success";
//   foreColor = "";
//   backgroundColor = "";
//   borderColor = "";

//   toastDiv.innerHTML = toastMessage;
//   document.body.appendChild(toastDiv);

//   // Increment toastCounter
//   toastCounter++;
// }
// $("#test1").on("click", function () {
//   CreateToast(true);
//   var thisToast = toastCounter - 1;

//   // Make it slide down
//   $(document)
//     .find("#toast_" + thisToast)
//     .slideDown(600);

//   setTimeout(function () {
//     $(document)
//       .find("#toast_" + thisToast)
//       .slideUp(600, function () {
//         // Slideup callback executes AFTER the slideup effect.
//         $(this).remove();
//       });
//   }, 3000); // 3sec.
// });

// $("#test2").on("click", function () {
//   CreateToast(false);
//   var thisToast = toastCounter - 1;

//   // Make it slide down
//   $(document)
//     .find("#toast_" + thisToast)
//     .slideDown(600);

//   setTimeout(function () {
//     $(document)
//       .find("#toast_" + thisToast)
//       .slideUp(600, function () {
//         // Slideup callback executes AFTER the slideup effect.
//         $(this).remove();
//       });
//   }, 3000); // 3sec.
// });
