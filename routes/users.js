const userRoutes = require("express").Router();
const { checkUserId, checkAvatar, checkProfile } = require('../utils/validation');

const {
  getUsers,
  getUserById,
  updateProfile,
  updateAvatar,
  getCurrentUser,
} = require("../controllers/users");

userRoutes.get("/", getUsers);
userRoutes.get("/me", getCurrentUser);
userRoutes.get("/:id", checkUserId, getUserById);
userRoutes.patch("/me", checkProfile, updateProfile);
userRoutes.patch("/me/avatar", checkAvatar, updateAvatar);

module.exports = userRoutes;
