const Card = require("../models/card");
const {
  BAD_REQUEST,
  STATUS_OK,
  STATUS_CREATED,
} = require("../utils/constants");

const BadRequestErr = require('../errors/BadRequestErr');
const NotFoundErr = require('../errors/NotFoundErr');
const ForBiddenErr = require('../errors/ForbiddenErr');

// eslint-disable-next-line consistent-return
exports.getCards = async (req, res, next) => {
  try {
    const cards = await Card.find({});
    return res.status(STATUS_OK).send(cards);
  } catch (err) {
    next(err);
  }
};

// eslint-disable-next-line consistent-return
exports.createCard = async (req, res, next) => {
  try {
    const { name, link } = req.body;
    const newCard = await Card.create({ name, link, owner: req.user._id });
    if (!newCard) {
      throw new BadRequestErr("Переданы некорректные данные");
    }
    return res.status(STATUS_CREATED).send({ data: newCard });
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
exports.deleteCard = async (req, res, next) => {
  try {
    const { cardId } = req.params;
    const card = await Card.findById(cardId);
    if (!card) {
      throw new NotFoundErr("Данная карточка не существует");
    }
    if (JSON.stringify(card.owner) !== JSON.stringify(req.user._id)) {
      throw new ForBiddenErr('Не возможно удалить данную карточку');
    }
    const deleteCard = await Card.findByIdAndRemove(cardId);
    if (deleteCard) {
      return res.status(STATUS_OK).send(`Карточка:${deleteCard} удалена`);
    }
    throw new NotFoundErr('Данные не найдены');
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(BAD_REQUEST).send({ message: `Невалидный ID` });
    }
    next(err);
  }
};

// eslint-disable-next-line consistent-return
exports.likeCard = async (req, res, next) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    );
    if (card) {
      return res.status(STATUS_OK).send({ data: card });
    }
    throw new NotFoundErr("Данная карточка не существует");
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(BAD_REQUEST).send({ message: `Невалидный ID` });
    }
    next(err);
  }
};

// eslint-disable-next-line consistent-return
exports.dislikeCard = async (req, res, next) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    );
    if (card) {
      return res.status(STATUS_OK).send({ data: card });
    }
    throw new NotFoundErr("Данная карточка не существует");
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(BAD_REQUEST).send({ message: `Невалидный ID` });
    }
    next(err);
  }
};
