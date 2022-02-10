const Card = require("../models/card");
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
exports.getCards = async (req, res) => {
  try {
    const cards = await Card.find({});
    return res.status(STATUS_OK).send(cards);
  } catch (err) {
    res.status(ERROR_SERVER).send({ message: `Ошибка на сервере`, ...err });
  }
};

// eslint-disable-next-line consistent-return
exports.createCard = async (req, res) => {
  try {
    const { name, link } = req.body;
    // eslint-disable-next-line no-constant-condition
    const newCard = await Card.create({ name, link, owner: req.user._id });
    if (newCard) {
      return res.status(STATUS_CREATED).send({ data: newCard });
    }
    throw new BadDataError("Предоставлены не коректные данные");
  } catch (err) {
    if (err.name.includes("ValidationError")) {
      return res
        .status(BAD_REQUEST)
        .send({ message: `Ошибка валидации данных `, ...err });
    }
    res
      .status(BAD_REQUEST)
      .send({ message: `Ошибка сервера:${err.statusCode}  ${err.message}` });
  }
};

// eslint-disable-next-line consistent-return
exports.deleteCard = async (req, res) => {
  try {
    const deleteCard = await Card.findByIdAndRemove(req.params.cardId);
    if (deleteCard) {
      return res.status(STATUS_OK).send(`Карточка:${deleteCard} удалена`);
    }
    throw new NotFoundError("Карточка не найдена");
  } catch (err) {
    console.log(err.message, err.statusCode);
    res
      .status(NOT_FOUND)
      .send({ message: `Ошибка сервера:${err.statusCode}  ${err.message}` });
  }
};

exports.likeCard = async (req, res) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      // eslint-disable-next-line comma-dangle
      { new: true }
    );
    if (card) {
      return res.status(STATUS_OK).send({ data: card });
    }
    throw new NotFoundError("Такой карточки нет!");
  } catch (err) {
    return res
      .status(NOT_FOUND)
      .send({ message: `Ошибка сервера:${err.statusCode}  ${err.message}` });
  }
};

// eslint-disable-next-line consistent-return
exports.dislikeCard = async (req, res) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      // eslint-disable-next-line comma-dangle
      { new: true }
    );
    if (card) {
      return res.status(STATUS_OK).send({ data: card });
    }
    throw new NotFoundError("Такой карточки нет!");
  } catch (err) {
    res
      .status(NOT_FOUND)
      .send({ message: `Ошибка сервера:${err.statusCode}  ${err.message}` });
  }
};
