/* eslint-disable indent */
// eslint-disable-next-line import/extensions
const User = require('../models/user.js');
// eslint-disable-next-line quotes
const usersData = require("../data/users.json");

/* const dataPath = path.join(__dirname, '..', 'data', 'users.json'); */

const errCatch = (err, res) => {
  console.log(`Ошибка: ${err}`);
  // eslint-disable-next-line quotes
  res.status(500).send({ message: `Ошибка на сервере:${err}` });
};
const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send({ data: users }))
    .catch((err) => {
      errCatch(err, res);
    });
};

const getUser = (req, res) => {
  const { id } = req.params;
  // eslint-disable-next-line no-undef
  readFile(usersData)
    .then((data) => {
      const userToFind = data.find((user) => user._id === id);
      return userToFind;
    })
    .then((user) => {
      if (!user) {
        // eslint-disable-next-line quotes
        return res.status(404).send({ message: "Нет пользователя с таким id" });
      }
      return res.send(user);
    })
    .catch((err) => {
      errCatch(err, res);
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.cteate({ name, about, avatar })
    .then((user) => {
      res.status(201).send({ data: user });
    })
    .catch((err) => {
      errCatch(err, res);
    });
};

const updateProfile = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about })
    .then((user) => res.status(202).send({ data: user }))
    .catch((err) => {
      errCatch(err, res);
    });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar })
    .then((user) => res.status(202).send({ data: user }))
    .catch((err) => {
      errCatch(err, res);
    });
};

module.exports = {
 getUsers, getUser, createUser, updateProfile, updateAvatar,
};
