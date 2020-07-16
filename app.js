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
  start();



  // });
  // console.log("Server is listening on port " + PORT);
}

startup();

//use later
// 

//Set up inquirer prompts.
//First prompt should have options to add an employee, view an employee, or update employee role.
async function start() {
  const startChoices = await inquirer
    .prompt({
      name: "startOptions",
      type: "list",
      message: "Would you like to add, update, or view employees?",
      choices: ["Add employee", "Update employee", "View employees", "Exit"]
    })

  switch (startChoices.startOptions) {
    case "Add employee":
      addEmployee();
      break;
    case "Update employee":
      updateEmployee();
      break;
    case "View employees":
      viewEmployees();
      break;
    default:
      connection.end();
  }
}
//If add employee, should ask you first name, then last name, then list of roles, then id.
//If update employee roles, list of roles to replace current role.
//If view employees is chosen, should show employees with their department, and roles.

//function that will run questions about Employees.
async function addEmployee() {
  const roles = await getRoles();

  const employeeAnswers = await inquirer
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
      , {
        type: "list",
        name: "role_id",
        message: "What is your employee's role?",
        choices: roles
      },

    ])

  await connection.query("INSERT INTO employee SET ?", employeeAnswers);

  start();

}

async function updateEmployee() {
  const employeeRows = await getEmployees();
  const roles = await getRoles();
  const employeeUpdate = await inquirer
    .prompt([
      {
        type: "list",
        name: "id",
        message: "Which employee would you like to update?",
        choices: employeeRows
      },
      {
        type: "list",
        name: "role_id",
        message: "What is your employee's new role?",
        choices: roles
      }
    ])
    
    await connection.query("UPDATE employee SET ? WHERE ?",
    [
      {
        role_id: employeeUpdate.role_id
      },
      {
        id:employeeUpdate.id
      }
    ]);

    start();

}

async function getEmployees() {
  const q = `SELECT id, concat(first_name, " ", last_name) as name from employeesdb.employee`
  let [employees, data] = await connection.query(q);

  return employees.map(employee => { return { name: employee.name, value: employee.id } })
}

async function getRoles() {

  //get roles from db for inquirer
  let [roles, data] = await connection.query("SELECT id, title from employeesdb.roles")
  return roles.map(role => { return { name: role.title, value: role.id } })
}

//es6 way
const viewEmployees = async () => {
  let [employeeRows, data] = await connection.query("SELECT employee.id, employee.first_name, employee.last_name, roles.title, roles.salary from employeesdb.employee LEFT JOIN roles on roles.id = employee.role_id");
  console.table(employeeRows);
  start();
}
// "SELECT roles.id, roles.title, department.name AS department, roles.salary FROM roles LEFT JOIN department on roles.department_id = department.id;"