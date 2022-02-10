/* eslint-disable indent */
// eslint-disable-next-line import/extensions
const User = require("../models/user.js");

const errCatch = (err, res) => {
  console.log(`Ошибка: ${err}`);
  // eslint-disable-next-line quotes
  res.status(500).send({ message: `Ошибка на сервере:${err}` });
};
exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send({ data: users }))
    .catch((err) => {
      errCatch(err, res);
    });
};

exports.getUserById = async (req, res) => {
  const user = await User.findById(req.params.id);
  res.status(200).send(user);
};

exports.createUser = async (req, res) => {
  const user = new User(req.body);
  res.status(201).send(await user.save());
};

exports.updateProfile = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true,
      upsert: true,
      // eslint-disable-next-line comma-dangle
    }
  )
    .then((user) => res.status(202).send({ data: user }))
    .catch((err) => {
      errCatch(err, res);
    });
};

exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
      upsert: true,
      // eslint-disable-next-line comma-dangle
    }
  )
    .then((user) => res.status(202).send({ data: user }))
    .catch((err) => {
      errCatch(err, res);
    });
};
