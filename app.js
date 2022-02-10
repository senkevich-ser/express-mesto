const express = require("express");
// eslint-disable-next-line import/extensions
const mongoose = require("mongoose");
// eslint-disable-next-line import/extensions
const userRoutes = require("./routes/users.js");

const { PORT = 3000 } = process.env;

// eslint-disable-next-line import/order

const app = express();

app.use((req, res, next) => {
  req.user = {
    _id: "6203328871133a9946eab130",
  };
  next();
});

app.use("/users", userRoutes);

async function main() {
  await mongoose.connect("mongodb://localhost:27017/mestodb", {
    useNewUrlParser: true,
  });
  await app.listen(PORT);
  console.log("this server is started....");
}

main();
