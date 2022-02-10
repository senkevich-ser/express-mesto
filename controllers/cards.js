const Card = require("../models/card");
const NotFoundError = require("../errors/not-found-err");

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

exports.createCard = async (req, res) => {
  const { name, link } = req.body;
  const newCard = await Card.create({ name, link, owner: req.user._id });
  res.status(201).send({ data: newCard });
};

exports.deleteCard = async (req, res) => {
  const deleteCard = await Card.findByIdAndRemove(req.params.cardId);
  res.status(200).send(`Карточка:${deleteCard} удалена`);
};

exports.likeCard = async (req, res) => {
  const card = await Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    // eslint-disable-next-line comma-dangle
    { new: true }
  );
  if (!card) {
    throw new NotFoundError("Такой карточки нет!");
  }
  res.status(200).send({ data: card });
};

exports.dislikeCard = async (req, res) => {
  const card = await Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    // eslint-disable-next-line comma-dangle
    { new: true }
  );
  if (!card) {
    throw new NotFoundError("Такой карточки нет!");
  }
  res.status(200).send({ data: card });
};
