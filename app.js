const express = require("express");
const mongoose = require("mongoose");
const { createUser, userLogin } = require("./controllers/users");
const cardRoutes = require("./routes/cards");
const userRoutes = require("./routes/users");
const auth = require('./middlewares/auth');
const { ERROR_SERVER } = require('./utils/constants');

const { PORT = 3000 } = process.env;

const app = express();

app.post('/signup', express.json(), createUser);
app.post('/signin', express.json(), userLogin);
app.use("/users", auth, userRoutes);
app.use("/cards", auth, cardRoutes);
app.use((req, res) => {
  res.status(404).send({ message: "Запрашиваемый ресурс не найден" });
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const { statusCode = ERROR_SERVER, message } = err;
  const errorMessage = (statusCode === ERROR_SERVER) ? 'Ошибка на сервере' : message;
  res.status(statusCode).send({ message: errorMessage });
});

async function main() {
  await mongoose.connect("mongodb://localhost:27017/mestodb", {
    useNewUrlParser: true,
  });
  await app.listen(PORT);
  console.log(`This server is runing. Connect port is ${PORT} `);
}

main();
