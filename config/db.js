require("dotenv").config();

const mysql = require("serverless-mysql")({
  config: {
    host: process.env.NODE_DB_HOST,
    database: process.env.NODE_DB_NAME,
    user: process.env.NODE_DB_USER,
    password: process.env.NODE_DB_PASSWORD,
    port: process.env.NODE_DB_PORT,
  },
});

module.exports = mysql;
