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
  var departments = await query("select * from department order by id", []);
  var deptChoices = [];
  // new value for choice
  for (let d of departments) {
    deptChoices.push({ name: d.NAME, value: d });
  }

  // build roles
  var roles = await query(
    "select r.*, d.NAME as DEPARTMENT_NAME from role r join department d on (r.department_id = d.id) order by r.id",
    []
  );
  var roleChoices = [];
  // new value for choice
  for (let r of roles) {
    roleChoices.push({ name: r.TITLE, value: r });
  }

  // build employees
  var employees = await query("select * from employee", []); // come back for sql - see notes
  var employeeChoices = [];
  // new value for choice
  for (let e of employees) {
    employeeChoices.push({ name: e.FIRST_NAME + " " + e.LAST_NAME, value: e });
  }
  employeeChoices.push({name: '[None]', value: {ID: null}});

  switch
}

// helper functions

// tutor notes: promise needs 2 functions
// Build Employees to get the manager name need to join back on emp table - once this join happens you want to have a left join - 3 joins (1 needs to be a left join - join/left join/join) -
// JOIN combines records from two tables, locates related column values in the two tables, a query can contain zero, one, or multiple JOIN operations and INNER JOIN is the same as JOIN; the keyword INNER is optional
// > exp:
// "SELECT
// country.country_name_eng, city.city_name, customer.customer_name,
// FROM country,
// JOIN city
// ON city.country_id = country.id,
// LEFT JOIN customer
// ON customer.city_id = city.id
// JOIN
// WHERE condition",
