require("dotenv").config();
const db = require("serverless-mysql")({
  config: {
    host: "localhost",
    database: process.env.NODE_DB_NAME,
    user: process.env.NODE_DB_USER,
    password: process.env.NODE_DB_PASSWORD,
    port: 3306,
  },
});

module.exports = db;
