const express = require("express");
const mongoose = require("mongoose");
const { errors } = require('celebrate');
const { createUser, userLogin } = require("./controllers/users");
const cardRoutes = require("./routes/cards");
const userRoutes = require("./routes/users");
const auth = require("./middlewares/auth");
const { ERROR_SERVER } = require("./utils/constants");
const NotFoundErr = require("./errors/NotFoundErr");
const { checkUser } = require('./utils/validation');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3000 } = process.env;

const app = express();
app.use(express.json());

app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.post("/signup", checkUser, createUser);
app.post("/signin", checkUser, userLogin);
app.use("/users", auth, userRoutes);
app.use("/cards", auth, cardRoutes);
app.use(auth, () => {
  throw new NotFoundErr('Запрашиваемый ресурс не найден');
});

app.use(errorLogger);
app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = ERROR_SERVER, message } = err;
  const errorMessage = (statusCode === ERROR_SERVER) ? 'Ошибка на сервере' : message;
  res.status(statusCode).send({ message: errorMessage });
  next();
});
async function main() {
  await mongoose.connect("mongodb://localhost:27017/mestodb", {
    useNewUrlParser: true,
  });
  await app.listen(PORT);
  console.log(`This server is runing. Connect port is ${PORT} `);
}

main();
