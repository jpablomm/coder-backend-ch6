const express = require("express");
const app = express();
const router = express.Router();
const cors = require("cors");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(express.static("public"));

const contenedor = require("./lib/contenedor");

// CONTAINER SETUP
// -----------------------------------------------------------------------
// create file
contenedor.initializeFile();

// create container instance
const newContainer = new contenedor.contenedor("data.txt");

// upload data to the file
contenedor.uploadData(newContainer, contenedor.mockData);

// ROUTER SET UP
// -----------------------------------------------------------------------
// GET -> Return all products
router.get("/productos", (req, res) => {
  newContainer.getAll().then((data) => {
    res.send(data);
  });
});

// GET -> Return all products
router.get("/productos/:id", (req, res) => {
  const productId = req.params.id;
  newContainer.getById(productId).then((data) => res.send(data));
});

// POST -> add a product and return id
router.post("/productos", (req, res) => {
  const body = req.body;
  newContainer
    .save(body)
    .then((data) => res.send(`${data}`))
    .catch((e) => console.log(e));
});

// PUT -> modify product
router.put("/productos/:id", (req, res) => {
  const body = req.body;
  const itemId = req.params.id;
  newContainer
    .updateById(itemId, body)
    .then((data) => res.send(`${data}`))
    .catch((e) => console.log(e));

  res.send({
    message: "success",
  });
});

// DELETE -> delete a product
router.delete("/productos/:id", (req, res) => {
  const productId = req.params.id;
  newContainer.deleteById(productId).then((data) => res.send(data));
});

app.use("/api", router);

app.listen(8080, () => {
  console.log("LISTENING ON PORT 8080");
});
