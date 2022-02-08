const express = require('express');
// eslint-disable-next-line import/extensions
const usersRouter = require('./routes/users.js');

const { PORT = 3000 } = process.env;
/* const path = require('path'); */

/* const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
}); */

const app = express();

app.use(usersRouter);

app.listen(PORT, () => {
  console.log('this server is started....');
});
