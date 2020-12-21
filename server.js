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
  employeeChoices.push({ name: "[None]", value: { ID: null } });

  // switch statement evaluates an expression, matching the expression's value to a case clause, and executes statements associated with that case, as well as statements in cases that follow the matching case - * Each case value has to end in a break

  switch (menuChoice) {
    // need 9 cases
    case viewDepartments:

    case viewRoles:

    case viewEmployees:

    case editDepartment:

    case addDepartment:

    case editRole:

    case addRole:

    case editEmployee:

    case addEmployee:
  }

  // exit from method back to mainMenu
  return menuChoice == exit ? null : mainMenu();
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

// > exp:
// switch (expression) {
//   case value1:
//     //Statements executed when the
//     //result of expression matches value1
//     [break;]
//   case value2:
//     //Statements executed when the
//     //result of expression matches value2
//     [break;]
//   ...
//   case valueN:
//     //Statements executed when the
//     //result of expression matches valueN
//     [break;]
//   [default:
//     //Statements executed when none of
//     //the values match the value of the expression
//     [break;]]
// }
// expression:
// its result is matched against each case

// case valueN - op:
// used to match against expression - If the expression matches the specified valueN, the statements  inside the case clause are executed until either the end of the switch statement or a break

// default - op:
// executed if the value of expression doesn't match any of the case
