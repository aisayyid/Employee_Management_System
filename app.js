var mysql = require("mysql2/promise");
var inquirer = require("inquirer");
const cTable = require('console.table');
var connection;

async function startup() {
var PORT = process.env.PORT || 3306;

// create the connection information for the sql database
connection = await mysql.createConnection({
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
// connection.connect(function (err) {
//   if (err) throw err;
//   // run the start function after the connection is made to prompt the user
  addEmployee();

// });
console.log("Server is listening on port " + PORT);
}

startup();
//use later
// connection.end();

//Set up inquirer prompts.
//First prompt should have options to add an employee, view an employee, or update employee role.
function start() {
  inquirer
    .prompt({
      name: "startOptions",
      type: "list",
      message: "Would you like to add, update, or view employees?",
      choices: ["Add employee", "Update employee", "View employees", "Exit"]
    })
}
//If add employee, should ask you first name, then last name, then list of roles, then id.
//If update employee roles, list of roles to replace current role.
//If view employees is chosen, should show employees with their department, and roles.

//function that will run questions about Employees.
async function addEmployee() {
  //get roles from db for inquirer
  let [roles, data] = await connection.query("SELECT id, title from employeesdb.roles")
  roles = roles.map(role => {return { name: role.title, value: role.id }})
  // console.log(roles);

  
  const answers = await inquirer
    .prompt([
      {
        name: "first_name",
        type: "input",
        message: "What is your employee's first name?"

      },
      {
        type: "input",
        name: "last_name",
        message: "What is your employee's last name?"
      }
      ,{
        type: "list",
        name: "role_id",
        message: "What is your employee's role?",
        choices: roles
      }
    ])
  console.log(answers);
  await connection.query("INSERT INTO employee SET ?", answers);

    viewEmployees();
  
}

function startChoices() {
  inquirer.prompt()
    .then(function (answer) {
      ///determine which choice was selected
      switch (answer.startOptions) {
        case "Add employee":

          break;
        case "Update employee":

          break;
        case "View employees":


        default:

      }
    })
}

const viewEmployees = async() => {
  let [employeeRows, data] = await connection.query("SELECT * from employeesdb.employee");
  console.table(employeeRows);
  return;
}