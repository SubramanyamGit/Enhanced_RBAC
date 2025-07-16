const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Root@123",
  database: "enhanced_rbac",
});

connection.connect;
(err) => {
  if (err) {
    return console.log("Error:" + err.message);
  }
  console.log("Connected to the MySQL server.");
};

module.exports = connection;
