const Card = require("../models/card");
const NotFoundError = require("../errors/not-found-err");

const errCatch = (err, res) => {
  // eslint-disable-next-line quotes
  res.status(500).send({ message: `Ошибка на сервере`, ...err });
};

exports.getCards = async (req, res) => {
  try {
    const cards = await Card.find({});
    if (!cards) {
      res.send("Произошла ошибка при получении данных пользователей");
    }
    res.status(200).send(cards);
  } catch (err) {
    res.status(500).send({ message: `Ошибка на сервере` });
  }
};

exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(201).send({ data: card }))
    .catch((err) => {
      errCatch(err, res);
    });
};

exports.deleteCard = async (req, res) => {
  const deleteCard = await Card.findByIdAndRemove(req.params.cardId);
  res.status(200).send(`Карточка:${deleteCard} удалена`);
};

exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    // eslint-disable-next-line comma-dangle
    { new: true }
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError("Такой карточки нет!");
      }
      res.status(200).send({ data: card });
    })
    .catch(next);
};
exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    // eslint-disable-next-line comma-dangle
    { new: true }
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError("Такой карточки нет!");
      }
      res.status(200).send({ data: card });
    })
    .catch(next);
};
