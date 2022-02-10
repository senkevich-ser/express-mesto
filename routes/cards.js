/* eslint-disable import/extensions */
const express = require("express");
const cardRoutes = require("express").Router();

const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require("../controllers/cards.js");

cardRoutes.get("/", getCards);
cardRoutes.post("/", /* express.json(), */ createCard);
cardRoutes.delete("/:cardId", express.json(), deleteCard);
cardRoutes.put("/:cardId/likes", express.json(), likeCard);
cardRoutes.delete("/:cardId/likes", express.json(), dislikeCard);

module.exports = cardRoutes;
