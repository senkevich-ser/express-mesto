/* const Card = require("../models/card");

const errCatch = (err, res) => {
  console.log(`Ошибка: ${err}`);
  // eslint-disable-next-line quotes
  res.status(500).send({ message: `Ошибка на сервере:${err}` });
};

const getCards = (req, res) => {
  Card.find({})
    .then((data) => res.status(200).send(data))
    .catch((err) => {
      errCatch(err, res);
    });
};

const createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((user) => res.status(201).send({ data: user }))
    .catch((err) => {
      errCatch(err, res);
    });
};

const deleteCard = (req, res) => {
  const { id } = req.params;

  Card.findById(id)
    .then((card) => {
      if (!card) {
        res.send("Такой карточки нет!");
      }
      if (JSON.stringify(card.owner) !== JSON.stringify(req.user._id)) {
        res.send("Невозможно удалить данную карточку");
      }
      return Card.findByIdAndRemove(id);
    })
    .then((card) => res.status(200).send({ data: card }))
    .catch((err) => {
      errCatch(err, res);
    });
};

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    {
      $addToSet: { likes: req.user._id },
    },
    // eslint-disable-next-line comma-dangle
    { new: true }
  )
    .then((card) => {
      if (!card) {
        res.send("Такой карточки нет!");
      }
      res.status(201).send({ data: card });
    })
    .catch((err) => {
      errCatch(err, res);
    });
};

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    // eslint-disable-next-line comma-dangle
    { new: true }
  )
    .then((card) => {
      if (!card) {
        res.send("Такой карточки нет!");
      }
      res.status(201).send({ data: card });
    })
    .catch((err) => {
      errCatch(err, res);
    });
};
module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
 */
