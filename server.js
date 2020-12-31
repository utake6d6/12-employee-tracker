const inquirer = require("inquirer");
const mysql = require("mysql");

const pool = mysql.createPool({
  connectionLimit: 10,
  host: "localhost",
  user: "root",
  database: "test",
});

main();

async function main() {
  await mainMenu();
  process.exit();
}

async function mainMenu() {
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

  var editObject = {};
  var editing = false;

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

  var departments = await query("select * from department order by id", []);
  var deptChoices = [];
  for (let d of departments) {
    deptChoices.push({ name: d.NAME, value: d });
  }

  var roles = await query(
    "select r.*, d.NAME as DEPARTMENT_NAME from role r join department d on (r.department_id = d.id) order by r.id",
    []
  );
  var roleChoices = [];
  for (let r of roles) {
    roleChoices.push({ name: r.TITLE, value: r });
  }

  var employees = await query(
    "select e.*, r.TITLE as ROLE_TITLE, e2.FIRST_NAME as MANAGER_FIRST_NAME, e2.LAST_NAME as MANAGER_LAST_NAME, d.NAME as DEPARTMENT_NAME from employee e join role r on (e.role_id = r.id) left join employee e2 on (e.MANAGER_ID = e2.ID) join department d on (r.department_id = d.id) order by e.id",
    []
  );
  var employeeChoices = [];
  for (let e of employees) {
    employeeChoices.push({ name: e.FIRST_NAME + " " + e.LAST_NAME, value: e });
  }
  employeeChoices.push({ name: "[None]", value: { ID: null } });

  switch (menuChoice) {
    case viewDepartments:
      console.log(tr("Id", 5) + tr("Name", 32));
      console.log(tableLine(5 + 32));
      for (let d of departments) {
        console.log(tr(d.ID, 5) + tr(d.NAME, 32));
      }
      break;
    case viewRoles:
      console.log(
        tr("Id", 5) + tr("Title", 32) + tr("Salary", 12) + tr("Department", 32)
      );
      console.log(tableLine(5 + 32 + 12 + 32));
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
      console.log(
        tr("Id", 5) +
          tr("Name", 32) +
          tr("Role", 32) +
          tr("Manager", 32) +
          tr("Department", 20)
      );
      console.log(tableLine(5 + 32 + 32 + 32 + 32 + 20));
      for (let e of employees) {
        console.log(
          tr(e.ID, 5) +
            tr(e.FIRST_NAME + " " + e.LAST_NAME, 32) +
            tr(e.ROLE_TITLE, 32) +
            tr(e.MANAGER_FIRST_NAME + " " + e.MANAGER_LAST_NAME, 32) +
            tr(e.DEPARTMENT_NAME, 20)
        );
      }
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
          query("insert into department (name) values (?)", [deptName]);
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
        var manager = await list("Select a Manager:", employeeChoices);
        if (!editing) {
          query(
            "insert into employee (first_name, last_name, role_id, manager_id) values (?,?,?,?)",
            [firstName, lastName, role.ID, manager.ID]
          );
        } else {
          query(
            "update employee set first_name = ?, last_name = ?, role_id = ?, manager_id = ? where id = ?",
            [firstName, lastName, role.ID, manager.ID, editObject.ID]
          );
        }
        log("Employee", editing);
      }
      break;
    default:
      break;
  }

  return menuChoice == exit ? null : mainMenu();
}

function tr(value, totalLength) {
  value = value == null || value == "null null" ? "[None]" : value.toString();
  var final = value;
  for (var i = value.length; i < totalLength + 1; i++) {
    final += " ";
  }
  return final;
}

function tableLine(length) {
  var line = "";
  for (var i = 0; i < length; i++) {
    line += "-";
  }
  return line;
}

function log(table, editing) {
  console.log(table + " " + (editing ? "Edited" : "Created") + "!");
}

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
