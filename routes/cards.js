/* eslint-disable import/extensions */
const express = require("express");
const cardRoutes = require("express").Router();
const { checkNewCard } = require('../utils/validation');
const { checkCardId } = require("../utils/validation");

const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require("../controllers/cards.js");

cardRoutes.get("/", getCards);
cardRoutes.post("/", express.json(), checkNewCard, createCard);
cardRoutes.delete("/:cardId", express.json(), checkCardId, deleteCard);
cardRoutes.put("/:cardId/likes", express.json(), checkCardId, likeCard);
cardRoutes.delete("/:cardId/likes", express.json(), checkCardId, dislikeCard);

module.exports = cardRoutes;
