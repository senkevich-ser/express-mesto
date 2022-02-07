const express = require('express');

const { PORT = 3000 } = process.env;
/* const path = require('path'); */

const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

const app = express();

app.get('/', (req, res) => {
  res.send('Hello world!!');
});

app.post('/', (req, res) => {
  res.send(req.body);
});

app.listen(PORT, () => {
  console.log('this server is started....');
});
