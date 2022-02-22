const express = require("express");
const mongoose = require("mongoose");
const { createUser, userLogin } = require("./controllers/users");
const cardRoutes = require("./routes/cards");
const userRoutes = require("./routes/users");
const auth = require('./middlewares/auth');

const { PORT = 3000 } = process.env;

// eslint-disable-next-line import/order

const app = express();

/* app.use((req, res, next) => {
  req.user = {
    _id: "6203328871133a9946eab130",
  };
  next();
}); */
app.post('/signup', express.json(), createUser);
app.post('/signin', express.json(), userLogin);
app.use("/users", auth, userRoutes);
app.use("/cards", auth, cardRoutes);
app.use((req, res) => {
  res.status(404).send({ message: "Запрашиваемый ресурс не найден" });
});

async function main() {
  await mongoose.connect("mongodb://localhost:27017/mestodb", {
    useNewUrlParser: true,
  });
  await app.listen(PORT);
  console.log(`This server is runing. Connect port is ${PORT} `);
}

main();
