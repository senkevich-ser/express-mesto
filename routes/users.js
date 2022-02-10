/* eslint-disable import/extensions */
const express = require("express");
const userRoutes = require("express").Router();

const {
  getUsers,
  getUserById,
  createUser,
  updateProfile,
  updateAvatar,
} = require("../controllers/users.js");

userRoutes.get("/", getUsers);
userRoutes.get("/:id", getUserById);
userRoutes.post("/", express.json(), createUser);
userRoutes.patch("/me", express.json(), updateProfile);
userRoutes.patch("/me/avatar", express.json(), updateAvatar);

module.exports = userRoutes;
