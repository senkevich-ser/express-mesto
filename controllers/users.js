/* eslint-disable indent */
// eslint-disable-next-line import/extensions
const User = require("../models/user.js");
const NotFoundError = require("../errors/not-found-err");
const BadDataError = require("../errors/bad-data-err");
const {
  BAD_REQUEST,
  STATUS_OK,
  STATUS_CREATED,
  ERROR_SERVER,
  NOT_FOUND,
} = require("../utils/constants");

// eslint-disable-next-line consistent-return
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    if (users) {
      return res.status(STATUS_OK).send({ data: users });
    }
    throw new NotFoundError(
      // eslint-disable-next-line comma-dangle
      "Данные пользователей с такими параметрами не найдены"
    );
  } catch (err) {
    console.log(`Ошибка на сервере: ${err}`);
    return res
      .status(ERROR_SERVER)
      .send({ message: `Ошибка на сервере`, ...err });
  }
};

// eslint-disable-next-line consistent-return
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      return res.status(STATUS_OK).send(user);
    }
    throw new NotFoundError("Пользователь с таким ID не найден");
  } catch (err) {
    console.log(err);
    res
      .status(NOT_FOUND)
      .send({ message: `Ошибка сервера:${err.statusCode}  ${err.message}` });
  }
};

exports.createUser = async (req, res) => {
  try {
    const user = new User(req.body);
    if (user) {
      return res.status(STATUS_CREATED).send(await user.save());
    }
    throw new BadDataError("Предоставлены не коректные данные");
  } catch (err) {
    console.log(`Ошибка на сервере: ${err}`);
    if (err.name.includes("ValidationError")) {
      return res
        .status(BAD_REQUEST)
        .send({ message: `Ошибка валидации данных `, ...err });
    }
    console.log(`Ошибка на сервере: ${err}`);
    return res
      .status(BAD_REQUEST)
      .send({ message: `Ошибка сервера:${err.statusCode}  ${err.message}` });
  }
};

exports.updateProfile = async (req, res) => {
  try {
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
    if (updateUser) {
      return res.status(202).send({ data: updateUser });
    }
    throw new BadDataError("Предоставлены не коректные данные");
  } catch (err) {
    console.log(`Ошибка на сервере: ${err}`);
    if (err.name.includes("ValidationError")) {
      return res
        .status(BAD_REQUEST)
        .send({ message: `Ошибка валидации данных `, ...err });
    }
    console.log(`Ошибка на сервере: ${err}`);
    return res
      .status(BAD_REQUEST)
      .send({ message: `Ошибка сервера:${err.statusCode}  ${err.message}` });
  }
};

exports.updateAvatar = async (req, res) => {
  try {
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
    if (updateAvatar) {
      return res.status(STATUS_OK).send({ data: updateAvatar });
    }
    throw new BadDataError("Предоставлены не коректные данные");
  } catch (err) {
    console.log(`Ошибка на сервере: ${err}`);
    return res
      .status(BAD_REQUEST)
      .send({ message: `Ошибка сервера:${err.statusCode}  ${err.message}` });
  }
};
