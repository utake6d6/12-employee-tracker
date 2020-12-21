const inquirer = require("inquirer");
const mysql = require("mysql");
const { listenerCount } = require("process");

// MySQL’s connection pool - reuse connections - enhance performance of executing commands
const pool = mysql.createPool({
  connectionLimit: 10,
  host: "localhost",
  user: "root",
  database: "test",
});

// run
main();

// async function for main menu
async function main() {
  await mainMenu();
  process.exit();
}

// main menu
async function mainMenu() {
  // menu variables
  var viewDepartments = "View all Departments";
  var viewRoles = "View all Roles";
  var viewEmployees = "View All Employees";
  var addDepartment = "Add Department";
  var editDepartment = "Edit Department";
  var addRole = "Add Role";
  var editRole = "Edit Role";
  var addEmployee = "Add Employee";
  var editEmployee = "Edit Employee";
  var exit = "Exit";

  // edit variables
  var editObject = {};
  var editing = false;

  // menu choice list
  var menuChoice = await list("Select an option:", [
    viewDepartments,
    viewRoles,
    viewEmployees,
    addDepartment,
    editDepartment,
    addRole,
    editRole,
    addEmployee,
    editEmployee,
    exit,
  ]);

  // build departments

  // build roles
  // build employees
}

// helper functions

// tutor notes: promise needs 2 functions
//
