require("dotenv").config();

const mysql = require("../config/db");

const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRATION = process.env.JWT_EXPIRATION;
const saltRounds = parseInt(process.env.SALT_ROUNDS);

const bcrypt = require("bcrypt");

const getUsers = async (req, res) => {
  try {
    const results = await mysql.query({
      sql: "SELECT * FROM users",
    });

    const users = results.map((user) => ({
      id: user.id,
      name: user.name,
    }));

    return res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({
      message: "Failed to fetch users",
      error: error.message,
    });
  }
};

const createUser = async (req, res, next) => {
  const { name, username, password } = req.body;

  if (!name || !username || !password) {
    return res.status(400).json({
      message: "Name, username, and password are required fields.",
    });
  }

  try {
    const results = await mysql.query({
      sql: "SELECT * FROM users WHERE username = ?",
      values: [username],
    });

    if (results.length > 0) {
      return res.status(409).json({
        message: "Username already taken. Please choose a different username.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    await mysql.query({
      sql: "INSERT INTO users (name, username, password) VALUES (?, ?, ?)",
      values: [name, username, hashedPassword],
    });

    const lastInsertResult = await mysql.query({
      sql: `
        SELECT id, username, name
        FROM users
        ORDER BY id DESC
        LIMIT 1
      `,
    });

    const {
      id: newUserId,
      username: newUsername,
      name: newName,
    } = lastInsertResult[0];
    console.log("New user ID:", newUserId);
    console.log("New username:", newUsername);
    console.log("New username:", newName);

    const token = jwt.sign(
      { id: newUserId, username: newUsername },
      JWT_SECRET
    );

    return res.status(201).json({
      message: "Registered successfully!",
      token: token,
      user: { id: newUserId, name: newName },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server Error",
    });
  }
};

const loginUser = async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      message: "Username and password are required fields.",
    });
  }

  try {
    const results = await mysql.query({
      sql: "SELECT * FROM users WHERE username = ?",
      values: [username],
    });

    if (results.length === 0) {
      return res.status(422).json({
        message: "Invalid credentials.",
      });
    }

    const { id, name, password: hashedPassword } = results[0];
    const passwordMatch = await bcrypt.compare(password, hashedPassword);

    if (passwordMatch) {
      const token = jwt.sign(
        { id: results[0].id, username: results[0].username },
        JWT_SECRET
      );
      return res.status(200).json({
        message: "Login successfully!",
        token: token,
        user: { id, name },
      });
    } else {
      return res.status(422).json({ message: "Invalid password!" });
    }
  } catch (error) {
    console.log("Error", error);
    return res.status(500).json({
      message: "Server Error",
    });
  }
};

const profileUser = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.id;

    const results = await mysql.query(
      "SELECT id, name, username FROM users WHERE id = ?",
      [userId]
    );

    if (results.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const posts = await mysql.query(
      "SELECT COUNT(*) as count FROM blogs WHERE userID =?",
      [userId]
    );

    const count = posts[0].count;

    return res.status(200).json({
      id: results[0].id,
      name: results[0].name,
      username: results[0].username,
      posts: count,
    });
  } catch (error) {
    console.error("Error in profile User:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const updateUser = async (req, res) => {
  const { name, username, userId } = req.body;

  if (!name || !username) {
    return res.status(400).json({
      message: "Name and username are required.",
    });
  }

  try {
    const results = await mysql.query(
      "UPDATE users SET name = ?, username = ? WHERE id = ?",
      [name, username, userId]
    );

    return res.status(200).json({
      message: "Your account updated successfully.",
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).json({
      message: "Internal server error.",
    });
  }
};

module.exports = { getUsers, createUser, loginUser, profileUser, updateUser };
