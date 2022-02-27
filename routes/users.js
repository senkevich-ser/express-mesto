/* eslint-disable import/extensions */
const express = require("express");
const userRoutes = require("express").Router();
const { checkUserId, checkAvatar, checkProfile } = require('../utils/validation');

const {
  getUsers,
  getUserById,
  updateProfile,
  updateAvatar,
  getCurrentUser,
} = require("../controllers/users.js");

userRoutes.get("/", getUsers);
userRoutes.get("/me", checkUserId, getCurrentUser);
userRoutes.get("/:id", checkUserId, getUserById);
userRoutes.patch("/me", express.json(), checkProfile, updateProfile);
userRoutes.patch("/me/avatar", express.json(), checkAvatar, updateAvatar);

module.exports = userRoutes;
