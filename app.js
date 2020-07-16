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
  // run the start function after the connection is made to prompt the user
  start();
}

startup();
//Set up inquirer prompts.
//First prompt should have options to add an employee, view an employee, or update employee role.
//Function that wraps and starts the application.
async function start() {
  //Const with opening prompt. Depending on answer, will use switch case to call other functions with more prompts.
  const startChoices = await inquirer
    .prompt({
      name: "startOptions",
      type: "list",
      message: "Would you like to add, update, or view employees?",
      choices: ["Add employee", "Update employee", "View employees", "Exit"]
    })
  //Switch case that triggers ont he answer to the first prompt, each case calls different function bringing more prompts.
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
//Using async await to properly sync function execution.
async function addEmployee() {
  //const that calls function which contains a query to get employee roles.
  const roles = await getRoles();
  //Prompt for adding employees.
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
        //calls the roles const, which will list out all the roles instead of physically typing all of it.
        choices: roles
      },
    ])
  //Query which will add the employee into the employee table in database.
  await connection.query("INSERT INTO employee SET ?", employeeAnswers);
  //calls start to loop back to beginning prompt.
  start();
}
//Function to update employee role.
async function updateEmployee() {
  //Calls getEmployees function which contains a query to get employee names, and a concat to join the first and last names.
  const employeeRows = await getEmployees();
  //Calls function with query for roles to be able to bring up a list of roles once more.
  const roles = await getRoles();
  //Contains prompts for updating employees.
  const employeeUpdate = await inquirer
    .prompt([
      {
        type: "list",
        name: "id",
        message: "Which employee would you like to update?",
        //Calls employeeRows const, which uses the get employees function to list out the employees full names.
        choices: employeeRows
      },
      {
        type: "list",
        name: "role_id",
        message: "What is your employee's new role?",
        //Brings a list of the company roles again by using th getRoles function.
        choices: roles
      }
    ])
  //Updates chosen role by the id of the employee selected in the database.
  await connection.query("UPDATE employee SET ? WHERE ?",
    [
      {
        role_id: employeeUpdate.role_id
      },
      {
        id: employeeUpdate.id
      }
    ]);
  //Loops back to the first prompt.
  start();
}
//Function which will query for employees, concat the first and last names to make full names, then map the employee name and id out.
async function getEmployees() {
  const q = `SELECT id, concat(first_name, " ", last_name) as name from employeesdb.employee`
  let [employees, data] = await connection.query(q);
  return employees.map(employee => { return { name: employee.name, value: employee.id } })
}

async function getRoles() {
  //get roles from db for inquirer.
  let [roles, data] = await connection.query("SELECT id, title from employeesdb.roles")
  return roles.map(role => { return { name: role.title, value: role.id } })
}

//Function to show a table of all employees.
const viewEmployees = async () => {
  //Query which selects items fromt he db that should be displayed, then left joins roles.id and employee.role_id so that the roles names displays, instead of the role id values.
  let [employeeRows, data] = await connection.query("SELECT employee.id, employee.first_name, employee.last_name, roles.title, roles.salary from employeesdb.employee LEFT JOIN roles on roles.id = employee.role_id");
  console.table(employeeRows);
  start();
}
