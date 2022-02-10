/* eslint-disable indent */
// eslint-disable-next-line import/extensions
const User = require("../models/user.js");

const errCatch = (err, res) => {
  console.log(`Ошибка: ${err}`);
  // eslint-disable-next-line quotes
  res.status(500).send({ message: `Ошибка на сервере:${err}` });
};
// eslint-disable-next-line consistent-return
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    if (!users) {
      return res.send("Данные пользователей на сервере не найдены");
    }
    res.status(200).send({ data: users });
  } catch (err) {
    errCatch(err, res);
  }
};

exports.getUserById = async (req, res) => {
  const user = await User.findById(req.params.id);
  res.status(200).send(user);
};

exports.createUser = async (req, res) => {
  const user = new User(req.body);
  res.status(201).send(await user.save());
};

exports.updateProfile = async (req, res) => {
  const { name, about } = req.body;
  const updateUser = await User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true,
      upsert: true,
      // eslint-disable-next-line comma-dangle
    }
  );
  res.status(202).send({ data: updateUser });
};

exports.updateAvatar = async (req, res) => {
  const { avatar } = req.body;
  const updateAvatar = await User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
      upsert: true,
      // eslint-disable-next-line comma-dangle
    }
  );
  res.status(202).send({ data: updateAvatar });
};
