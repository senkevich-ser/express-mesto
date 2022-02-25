const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const NotFoundErr = require('../errors/NotFoundErr');
const ConflictErr = require('../errors/ConflictErr');

const {
  BAD_REQUEST,
  STATUS_OK,
  STATUS_CREATED,
  STATUS_ACCEPTED,
} = require("../utils/constants");

// eslint-disable-next-line consistent-return
exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    if (!users) {
      throw new NotFoundErr(
        "Данные пользователей с такими параметрами не найдены",
      );
    }
    return res.status(STATUS_OK).send({ data: users });
  } catch (err) {
    next(err);
  }
};

// eslint-disable-next-line consistent-return
exports.getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      throw new NotFoundErr('Пользователь не найден');
    } return res.status(STATUS_OK).send({ data: user });
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(BAD_REQUEST).send({ message: `Невалидный ID` });
    }
    next(err);
  }
};

// eslint-disable-next-line consistent-return
exports.getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      return res.status(STATUS_OK).send(user);
    }
    throw new NotFoundErr("Пользователь  не найден");
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(BAD_REQUEST).send({ message: `Невалидный ID` });
    }
    next(err);
  }
};

// eslint-disable-next-line consistent-return
exports.createUser = async (req, res, next) => {
  try {
    const { email } = req.body;
    const checkUser = await User.findOne({ email });
    if (checkUser) {
      throw new ConflictErr("Данный пользователь уже существует!");
    }
    const user = new User(req.body);
    const hash = await bcrypt.hash(user.password, 10);
    user.password = hash;
    await user.save();
    return res.status(STATUS_CREATED).send({ _id: user._id, email: user.email });
  } catch (err) {
    if (err.name.includes("ValidationError")) {
      return res
        .status(BAD_REQUEST)
        .send({ message: `Ошибка валидации данных `, ...err });
    }
    next(err);
  }
};

// eslint-disable-next-line consistent-return
exports.updateProfile = async (req, res, next) => {
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
    throw new NotFoundErr('Данный пользователь не найден');
  } catch (err) {
    if (err.name === "ValidationError") {
      return res
        .status(BAD_REQUEST)
        .send({ message: `Ошибка валидации данных `, ...err });
    }
    next(err);
  }
};

// eslint-disable-next-line consistent-return
exports.updateAvatar = async (req, res, next) => {
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
    throw new NotFoundErr('Данный пользователь не найден');
  } catch (err) {
    if (err.name === "ValidationError") {
      return res
        .status(BAD_REQUEST)
        .send({ message: `Ошибка валидации данных `, ...err });
    }
    next(err);
  }
};

exports.userLogin = (req, res) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, "some-secret-key", {
        expiresIn: "7d",
      });
      res
        .send({ token });
    })
    .catch((err) => {
      res.status(401).send({ message: err.message });
    });
};
