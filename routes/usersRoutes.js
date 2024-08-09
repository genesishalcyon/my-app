const express = require("express");
const router = express.Router();

const mysql = require("../config/db");

const {
  getUsers,
  createUser,
  loginUser,
  profileUser,
  updateUser,
} = require("../controller/usersController");

router.get("/users", getUsers);
router.post("/register", createUser);
router.post("/login", loginUser);
router.get("/profile", profileUser);
router.put("/profile", updateUser);

module.exports = router;
