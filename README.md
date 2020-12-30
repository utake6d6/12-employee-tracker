<!-- User Story:
AS A business owner
I WANT to be able to view and manage the departments, roles, and employees in my company
SO THAT I can organize and plan my business -->

<!-- Acceptance Criteria:
GIVEN a command-line application that accepts user input
WHEN I start the application
THEN I am presented with the following options: view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role
WHEN I choose to view all departments
THEN I am presented with a formatted table showing department names and department ids
WHEN I choose to view all roles
THEN I am presented with the job title, role id, the department that role belongs to, and the salary for that role
WHEN I choose to view all employees
THEN I am presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to
WHEN I choose to add a department
THEN I am prompted to enter the name of the department and that department is added to the database
WHEN I choose to add a role
THEN I am prompted to enter the name, salary, and department for the role and that role is added to the database
WHEN I choose to add an employee
THEN I am prompted to enter the employee’s first name, last name, role, and manager and that employee is added to the database
WHEN I choose to update an employee role
THEN I am prompted to select an employee to update and their new role and this information is updated in the database  -->

<!-- schema should contain the following three tables:

Department -
id: INT PRIMARY KEY
name: VARCHAR(30) to hold department name

Role -
id: INT PRIMARY KEY
title: VARCHAR(30) to hold role title
salary: DECIMAL to hold role salary
department_id: INT to hold reference to department role belongs to

Employee -
id: INT PRIMARY KEY
first_name: VARCHAR(30) to hold employee first name
last_name: VARCHAR(30) to hold employee last name
role_id: INT to hold reference to employee role
manager_id: INT to hold reference to another employee that is manager of the current employee. This field may be null if the employee has no manager. -->

<!-- ***********
You may want to use a separate file containing functions for performing specific SQL queries you'll need to use. A constructor function or class could be helpful for organizing these. You may also want to include a seeds.sql file to pre-populate your database. This will make the development of individual features much easier. -->

<!-- **_ Bonus _**
See if you can add some additional functionality to your application, such as the ability to:

Update employee managers.

View employees by manager.

View employees by department.

Delete departments, roles, and employees.

View the total utilized budget of a department—i.e., the combined salaries of all employees in that department. -->

# Employee Tracker

[![License](https://img.shields.io/badge/License-MIT-blue.svg)](https://lbesson.mit-license.org/)

![Usage](assets/img/EmpTrkr_open.png)

## Table of Contents:

- [Description](#description)
- [Installation](#installation)
- [Usage](#usage)
- [License](#license)
- [Contributing](#contributing)
- [Tests](#tests)
- [Questions](#questions)

## Description:

Build a command-line application to manage a company's employee database, using Node.js, Inquirer, and MySQL.

## Installation:

Clone repository https://github.com/utake6d6/12-employee-tracker
Install Inquirer.js & Node MySQL 2.
Use "node server.js" to run the app.

## Usage:

![Usage](assets/img/EmpTrkr_pic.png)

## License:

MIT

## Contributing:

This project may be forked.

## Tests:

NA

## Questions:

If you have any questions please reach out to the developer:

Github: <https://github.com/utake6d6/12-employee-tracker>

Email: <puppyhugs@gmail.com>
