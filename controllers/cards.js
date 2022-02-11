const Card = require("../models/card");
const {
  BAD_REQUEST,
  STATUS_OK,
  STATUS_CREATED,
  ERROR_SERVER,
  NOT_FOUND,
} = require("../utils/constants");

exports.getCards = async (req, res) => {
  try {
    const cards = await Card.find({});
    return res.status(STATUS_OK).send(cards);
  } catch (err) {
    console.log(`Ошибка на сервере: ${err}`);
    return res
      .status(ERROR_SERVER)
      .send({ message: `Ошибка на сервере`, ...err });
  }
};

exports.createCard = async (req, res) => {
  try {
    const { name, link } = req.body;
    const newCard = await Card.create({ name, link, owner: req.user._id });

    return res.status(STATUS_CREATED).send({ data: newCard });
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

exports.deleteCard = async (req, res) => {
  try {
    const deleteCard = await Card.findByIdAndRemove(req.params.cardId);
    if (deleteCard) {
      return res.status(STATUS_OK).send(`Карточка:${deleteCard} удалена`);
    }
    return res.status(NOT_FOUND).send({ message: `Данные не найдены` });
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(BAD_REQUEST).send({ message: `Невалидный ID` });
    }
    return res.status(ERROR_SERVER).send({ message: `Ошибка сервера` });
  }
};

exports.likeCard = async (req, res) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    );
    if (card) {
      return res.status(STATUS_OK).send({ data: card });
    }
    return res
      .status(NOT_FOUND)
      .send({ message: `Данная карточка не найдена` });
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(BAD_REQUEST).send({ message: `Невалидный ID` });
    }
    return res.status(ERROR_SERVER).send({ message: `Ошибка сервера` });
  }
};

exports.dislikeCard = async (req, res) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    );
    if (card) {
      return res.status(STATUS_OK).send({ data: card });
    }
    return res.status(NOT_FOUND).send({ message: `Данные не найдены` });
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(BAD_REQUEST).send({ message: `Невалидный ID` });
    }
    return res.status(ERROR_SERVER).send({ message: `Ошибка сервера` });
  }
};
