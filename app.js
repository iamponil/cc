var createError = require("http-errors");
var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
//var Message = require("./message");
const socket = require("socket.io");
mongoose
  .connect("mongodb://localhost:27017/myexam")
  .then(console.log("db connected"))
  .catch((err) => console.log(err));

//var msgRouter = require("./routes/message");
var app = express();

//app.set("views", path.join(__dirname, "views"));
//app.set("view engine", "twig");
//app.use("/uploads", express.static("uploads"));

app.use(express.static("public"));
///////////////////////////
//app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//app.use(cookieParser());

// app.use("/message", msgRouter);
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var server = app.listen(3001, () => {
  console.log("Le serveur est en écoute sur le port 3000");
});
var io = socket(server);
io.on("connection", function (socket) {
  console.log("made my socket", socket.id);
  socket.broadcast.emit("notify");
  //listen to the message from chat.js
  socket.on("chat", function (data) {
    console.log(data);
    const message = new Message({
      handle: data.handle,
      content: data.message,
    });
    message
      .save()
      .then(() => {
        io.sockets.emit("chat", data);
      })
      .catch((error) => {
        console.error("Erreur lors de l'enregistrement du message:", error);
      });
    //send the message to all the clients
  });
  socket.on("typing", function (data) {
    socket.broadcast.emit("typing", data);
  });
  socket.on("disconnect", () => {
    console.log("user disconnected");
    socket.broadcast.emit("disconnected");
  });
});
module.exports = app;
