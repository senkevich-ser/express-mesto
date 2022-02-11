const User = require("../models/user");
const NotFoundError = require("../errors/not-found-err");
const {
  BAD_REQUEST,
  STATUS_OK,
  STATUS_CREATED,
  ERROR_SERVER,
  NOT_FOUND,
  STATUS_ACCEPTED,
} = require("../utils/constants");

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    if (users) {
      return res.status(STATUS_OK).send({ data: users });
    }
    throw new NotFoundError(
      "Данные пользователей с такими параметрами не найдены",
    );
  } catch (err) {
    console.log(`Ошибка на сервере: ${err}`);
    return res
      .status(ERROR_SERVER)
      .send({ message: `Ошибка на сервере`, ...err });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      return res.status(STATUS_OK).send(user);
    }
    return res.status(NOT_FOUND).send({ message: `данные не найдены` });
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(BAD_REQUEST).send({ message: `Невалидный ID` });
    }
    return res.status(ERROR_SERVER).send({ message: `Ошибка сервера` });
  }
};

exports.createUser = async (req, res) => {
  try {
    const user = new User(req.body);
    return res.status(STATUS_CREATED).send(await user.save());
  } catch (err) {
    console.log(`Ошибка на сервере: ${err}`);
    if (err.name.includes("ValidationError")) {
      return res
        .status(BAD_REQUEST)
        .send({ message: `Ошибка валидации данных `, ...err });
    }
    console.log(`Ошибка на сервере: ${err}`);
    return res
      .status(ERROR_SERVER)
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
      },
    );
    if (updateUser) {
      return res.status(STATUS_ACCEPTED).send({ data: updateUser });
    }
    return res.status(NOT_FOUND).send({ message: `Данные не найдены` });
  } catch (err) {
    console.log(`Ошибка на сервере: ${err}`);
    if (err.name === "ValidationError") {
      return res
        .status(BAD_REQUEST)
        .send({ message: `Ошибка валидации данных `, ...err });
    }
    return res
      .status(ERROR_SERVER)
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
      },
    );
    if (updateAvatar) {
      return res.status(STATUS_OK).send({ data: updateAvatar });
    }
    return res.status(NOT_FOUND).send({ message: `Данные не найдены` });
  } catch (err) {
    console.log(`Ошибка на сервере: ${err}`);
    if (err.name === "ValidationError") {
      return res
        .status(BAD_REQUEST)
        .send({ message: `Ошибка валидации данных `, ...err });
    }
    return res
      .status(ERROR_SERVER)
      .send({ message: `Ошибка сервера:${err.statusCode}  ${err.message}` });
  }
};
