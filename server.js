const inquirer = require("inquirer");
const mysql = require("mysql");
const { resolve } = require("path");
const { listenerCount } = require("process");
const { deprecate } = require("util");

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
  var employees = await query(
    "select e.*, r.TITLE as ROLE_TITLE, e2.FIRST_NAME as MANAGER_FIRST_NAME, e2.LAST_NAME as MANAGER_LAST_NAME, d.NAME as DEPARTMENT_NAME from employee e join role r on (e.role_id = r.id) left join employee e2 on (e.MANAGER_ID = e2.ID) join department d on (r.department_id = d.id) order by e.id",
    []
  );
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
      console.log(tr("Id", 5) + tr("Name", 32)); // +2 for table row buffer
      console.log(tableLine(5 + 32));
      for (let d of departments) {
        console.log(tr(d.ID, 5) + tr(d.NAME, 32));
      }
      break;
    case viewRoles:
      console.log(
        tr("Id", 5) + tr("Title", 32) + tr("Salary", 12) + tr("Department", 32)
      );
      console / log(tableLine(5 + 32 + 12 + 32));
      for (let r of roles) {
        console.log(
          tr(r.ID, 5) +
            tr(r.TITLE, 32) +
            tr(r.SALARY, 12) +
            tr(r.DEPARTMENT_NAME, 32)
        );
      }
      break;
    case viewEmployees:
      console.log(employees);
      break;
    case editDepartment:
      editObject = await list("Select a Department:", deptChoices);
      editing = true;
    case addDepartment:
      var deptName = await prompt(
        "Enter Department Name:",
        editing ? editObject.NAME : null
      );
      deptName = deptName.trim();
      departments = await query("select * from department where name = ?", [
        deptName,
      ]);
      if (departments.length == 0) {
        if (!editing) {
          query("insert ino department (name) values (?)", [deptName]);
        } else {
          query("update department set name = ? where id = ?", [
            deptName,
            editObject.ID,
          ]);
        }
        log("Department", editing);
      } else {
        console.log("That Department already exists!");
      }
      break;
    case editRole:
      editObject = await list("Select a Role:", roleChoices);
      editing = true;
    case addRole:
      if (departments.length == 0) {
        console.log("No Departments Exist!");
      } else {
        var title = await prompt(
          "Enter Role Title:",
          editing ? editObject.TITLE : null
        );
        var salary = await prompt(
          "Enter Salary:",
          editing ? editObject.SALARY : null
        );
        var dept = await list("Select a Department:", deptChoices);
        if (!editing) {
          query(
            "insert into role (title, salary, department_id) values (?,?,?)",
            [title, salary, dept.ID]
          );
        } else {
          query(
            "update role set title = ?, salary = ?, department_id = ? where id = ?",
            [title, salary, dept.ID, editObject.ID]
          );
        }
        log("Role", editing);
      }
      break;
    case editEmployee:
      editObject = await list("Select a Employee:", employeeChoices);
      editing = true;
    case addEmployee:
      if (roles.length == 0) {
        console.log("No Rules Exist!");
      } else {
        var firstName = await prompt(
          "Enter First Name:",
          editing ? editObject.FIRST_NAME : null
        );
        var lastName = await prompt(
          "Enter Last Name:",
          editing ? editObject.LAST_NAME : null
        );
        var role = await list("Select a Role:", roleChoices);
        var manager = await prompt("Select a Manager:", employeeChoices);
        if (!editing) {
          query(
            "insert into employee (first_name, last_name, role_id, manager_id) values (?,?,?,?)",
            [firstName, lastName, role.ID, manager.ID]
          );
        } else {
          query(
            "update employee set first_name = ?, last_name = ?, role_id = ?, manager_id = ? where id = ?",
            [firstName, lastName, role.ID, manager.ID, editObject]
          );
        }
        log("Employee", editing);
      }
      break;
    default:
      break;
  }

  // exit from method back to mainMenu
  return menuChoice == exit ? null : mainMenu();
}

// helper functions:

// table row
function tr(value, totalLength) {
  value = value == null || value == "null null" ? "[None]" : value.toString();
  var final = value;
  for (var i = value.length; i < totalLength + 1; i++) {
    final += " ";
  }
  // constant
  return final;
}

function tableLine(length) {
  var line = " ";
  for (var i = 0; i < length; i++) {
    line += "-";
  }
  return line;
}

// table edit created msg
function log(table, editing) {
  console.log(table + " " + (editing ? "Edited" : "Created") + "!");
}

// prompt msg promise
function prompt(message, defaultValue) {
  return new Promise((resolve) => {
    inquirer
      .prompt([
        {
          name: "prompt",
          message: message,
          default: defaultValue,
        },
      ])
      .then((answers) => {
        resolve(answers.prompt);
      });
  });
}

// choice promise
function list(message, choices) {
  return new Promise((resolve) => {
    inquirer
      .prompt([
        {
          type: "list",
          name: "prompt",
          message: message,
          choices: choices,
        },
      ])
      .then((answers) => {
        resolve(answers.prompt);
      });
  });
}

// query for pool
function query(sql, values) {
  return new Promise((resolve) => {
    pool.getConnection(function (err, connection) {
      connection.query(sql, values, function (err, results, rows) {
        connection.release();
        if (err) throw err;
        resolve(results);
      });
    });
  });
}

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
