require("dotenv").config(); // load .env variables
const mysql = require("mysql"); // import mysql2 library
const { log } = require("mercedlogger"); // import merced logger

// DESTRUCTURE ENV VARIABLES
const { MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE } = process.env;

// CREATE MYSQL CONNECTION
const connection = mysql.createConnection({
  host: MYSQL_HOST,
  user: MYSQL_USER,
  password: MYSQL_PASSWORD,
  database: MYSQL_DATABASE,
});

// CONNECT TO MYSQL
connection.connect((error) => {
  if (error) {
    log.red("DATABASE STATE", error.message);
  } else {
    log.green("DATABASE STATE", "Connected to MySQL database");
  }
});

// HANDLE MYSQL CONNECTION EVENTS
connection.on("error", (error) => {
  log.red("DATABASE STATE", error.message);
});

// EXPORT MYSQL CONNECTION
module.exports = connection;
