/* eslint-disable import/extensions */
const express = require("express");
const userRoutes = require("express").Router();

const {
  getUsers,
  getUserById,
  updateProfile,
  updateAvatar,
  getCurrentUser,
} = require("../controllers/users.js");

userRoutes.get("/", getUsers);
userRoutes.get("/me", getCurrentUser);
userRoutes.get("/:id", getUserById);
userRoutes.patch("/me", express.json(), updateProfile);
userRoutes.patch("/me/avatar", express.json(), updateAvatar);

module.exports = userRoutes;
