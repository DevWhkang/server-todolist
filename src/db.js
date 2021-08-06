const sqlite3 = require("sqlite3").verbose();

let connection = new sqlite3.Database("./todos.db", (err) => {
  if (err) {
    return console.error(err.message);
  } else {
    console.log("Connected to the todos SQlite database.");
  }
});

module.exports = connection;
