var mysql = require("mysql");
var inquirer = require("inquirer");

var PORT = process.env.PORT || 3306;

// create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "root",
  database: "employeesdb"
});

// connect to the mysql server and sql database
connection.connect(function(err) {
  if (err) throw err;
  // run the start function after the connection is made to prompt the user
  start();

});
console.log("Server is listening on port " + PORT);

connection.end();

//Set up inquirer prompts.
//First prompt should have options to add an employee, view an employee, or update employee role.
function start() {
  inquirer
    .prompt({
      name: "startOptions",
      type: "list",
      message: "Would you like to add, update, or view employees?",
      choices: ["Add employee", "Update Employee", "View employees", "Exit"]
    })
  }
//If add employee, should ask you first name, then last name, then list of roles, then id.
//If update employee roles, list of roles to replace current role.
//If view employees is chose, should show employees witht heir department, and roles.