const express = require("express");
const handlebars = require("express-handlebars");
const axios = require("axios");
const http = require("http");
const { Server } = require("socket.io");

// WEB SERVER SET UP
// -----------------------------------------------------------------------
const app = express();

// WEBSOCKET SET UP
// -----------------------------------------------------------------------
const server = http.createServer(app);
const io = new Server(server);

// HANDLEBARS SET UP
// -----------------------------------------------------------------------
app.set("view engine", "handlebars");
app.engine(
  "handlebars",
  handlebars.engine({
    layoutsDir: __dirname + "/views/layouts",
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// ROUTER SET UP
// -----------------------------------------------------------------------
app.get("/", (req, res) => {
  res.render("main", { layout: "index" });
});

// WEB SOCKET FUNCTIONALITY
// -----------------------------------------------------------------------
const products = [];
const messages = [];

io.on("connection", (socket) => {
  console.log("a user connected");
  socket.emit("products", products);
  socket.emit("messages", messages);

  socket.on("new-product", (data) => {
    console.log("received data: ", data);
    products.push(data);
    // io.sockets.emit("products", products);
    io.sockets.emit("new-item", data);
  });

  socket.on("new-message", (data) => {
    messages.push(data);
    io.sockets.emit("new-msg", data);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

server.listen(3000, () => {
  console.log("LISTENING ON PORT 3000");
});

// app.get("/productos", (req, res) => {
//   const productos = [];
//   axios.get("http://localhost:8080/api/productos").then((data) => {
//     console.log(data.data);
//     res.render("products", { layout: "index", products: data.data });
//   });
// });
