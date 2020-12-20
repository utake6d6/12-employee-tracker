const inquirer = require("inquirer");
const mysql = require("mysql");

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
  // edit variables
  // menu choice
  // build departments
  // build roles
  // build employees
}

// helper functions

// tutor notes: promise needs 2 functions
//