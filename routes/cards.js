const cardRoutes = require("express").Router();
const { checkNewCard } = require('../utils/validation');
const { checkCardId } = require("../utils/validation");

const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require("../controllers/cards");

cardRoutes.get("/", getCards);
cardRoutes.post("/", checkNewCard, createCard);
cardRoutes.delete("/:cardId", checkCardId, deleteCard);
cardRoutes.put("/:cardId/likes", checkCardId, likeCard);
cardRoutes.delete("/:cardId/likes", checkCardId, dislikeCard);

module.exports = cardRoutes;
