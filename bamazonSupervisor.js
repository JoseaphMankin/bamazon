//List of requires needed for project.
const mysql = require("mysql");
const inquirer = require("inquirer");
const chalk = require("chalk");
const cTable = require('console.table');

//Connection to mySQL Database, which holds 2 tables, Products and Departments
const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "bamazonDB"
});

//Loading of Welcome Screen Menu
connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    console.log(chalk.green(`
  *****************************************************
  **            Welcome bAmazon Supervisor           **
  *****************************************************

  You're the boss! Now let's do some big baller stuff!!

  `))
    dispatch();

});

//Switch statement I like to create to manage High Level menu options
function dispatch() {
    inquirer.prompt([
        {
            name: "dispatch",
            message: "What would you like to oversee?",
            type: "list",
            choices: ["View Product Sales by Department", "Create New Department", "Remove a Department", "Update OverHead Costs", "View All Products", "Remove a Product"]
        }
    ]).then(function (response) {
        switch (response.dispatch) {
            case "View Product Sales by Department":
                queryDepts()
                break;
            case "Create New Department":
                addDepartment()
                break;
            case "Remove a Department":
                removeDept();
                break;
            case "Update OverHead Costs":
                updateOverhead()
                break;
            case "View All Products":
                queryProducts()
                break;
            case "Remove a Product":
                removeProduct()
                break;
        }
    });

}

//Query that joins both Products and Departments, Groups and Sums the same Department and dynamically creates Profits
function queryDepts() {
    let joinQuery = `SELECT departments.department_id AS 'Department ID', departments.department_name AS 'Department Name', 
    departments.over_head_costs AS 'Overhead Costs', SUM(products.product_sales) AS 'Product Sales', 
    (SUM(products.product_sales) - departments.over_head_costs) AS 'Total Profit'  
    FROM departments LEFT JOIN products on products.department_name=departments.department_name
    GROUP BY departments.department_name, departments.department_id, departments.over_head_costs
    ORDER BY departments.department_id;`;


    connection.query(joinQuery, function (err, res) {
        console.table(res);
        anythingElse();
    })
}

//Function that gives Supervisor the ability to add a Department
function addDepartment() {
    inquirer
        .prompt([
            {
                name: "name",
                type: "input",
                message: "What is the name of the Department you'd like to create?"
            },
            {
                name: "overhead",
                type: "input",
                message: "What is the overhead cost of this department?",
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            },
        ])
        .then(function (answer) {
            // when finished prompting, insert a new item into the db with that info
            connection.query(
                "INSERT INTO departments SET ?",
                {
                    department_name: answer.name,
                    over_head_costs: answer.overhead,

                },
                function (err) {
                    if (err) throw err;
                    console.log("You have sucessfully added: " + answer.name + " to the Dept List!");
                    anythingElse();
                }
            );

        });


};

//Function that gives Supervisor the ability to alter the current overhead.
function updateOverhead() {
    let tableQuery = `SELECT departments.department_id AS 'Department ID', departments.department_name AS 'Department Name', 
    departments.over_head_costs AS 'Overhead Costs', SUM(products.product_sales) AS 'Product Sales', 
    (SUM(products.product_sales) - departments.over_head_costs) AS 'Total Profit'  
    FROM departments LEFT JOIN products on products.department_name=departments.department_name
    GROUP BY departments.department_name, departments.department_id, departments.over_head_costs
    ORDER BY departments.department_id;`;
    connection.query(tableQuery, function (err, res) {

        console.table(res);

        inquirer.prompt([
            {
                name: "ID",
                message: "What is the ID of the item you like to change the Overhead Costs?",
                type: "input",
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true
                    }
                    return false;
                }
            },
            {
                name: "overhead",
                message: "What is the new overhead costs?",
                type: "input",
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true
                    }
                    return false;
                }
            }

        ]).then(function (response) {
            let query = `SELECT * FROM departments WHERE department_id = ${response.ID}`;
            let updateOH = response.overhead;
          
            connection.query(query, function (err, res) {
                let newID = parseInt(res[0].department_id);
             

                connection.query(
                    "UPDATE departments SET ? WHERE ?",
                    [
                        {
                            over_head_costs: updateOH
                        },
                        {
                            department_id: newID
                        }
                    ],
                    function (error) {
                        if (error) throw err;
                        console.log("Success! Dept ID: " + response.ID + " was updated to: " + updateOH);
                        anythingElse();
                    }
                )
            });
        })
    })

}

//Function query to see Product List
function queryProducts() {
    let tableQuery = `SELECT products.item_id AS 'Item ID', products.product_name AS 'Product Name', products.department_name
    AS 'Department Name', products.price AS 'Price', products.stock_quantity AS 'Quantity in Stock'  
    FROM products;`;

    connection.query(tableQuery, function (err, res) {
        console.table(res);
        anythingElse();
    })
}

//Function that pulls up Product list and gives Supervisor the ability to remove. (Manager can also do this)
function removeProduct() {
    let tableQuery = `SELECT products.item_id AS 'Item ID', products.product_name AS 'Product Name', products.department_name
    AS 'Department Name', products.price AS 'Price', products.stock_quantity AS 'Quantity in Stock'  
    FROM products;`;
    connection.query(tableQuery, function (err, res) {
        console.table(res);

    inquirer
        .prompt([
            {
                name: "id",
                type: "input",
                message: "What is the ID of the item you'd like to remove?"
            },
            {
                name: "youSure",
                message: "Are you sure you want to remove this?",
                type: "confirm",
                default: false
            }
        ])
        .then(function (answer) {
            
            if (answer.youSure === true){
            connection.query(
                "DELETE FROM products WHERE products.item_id=" + answer.id + ";",
                function (err) {
                    if (err) throw err;
                    console.log("You have sucessfully removed: " + answer.id + " from the inventory!");
                    anythingElse();
                }
            );
            } else{
                anythingElse();
            }
            
        });
    })
};

//Function that pulls up Dept list and gives Supervisor the ability to remove. (Supervisor exclusive)
function removeDept() {
    let joinQuery = `SELECT departments.department_id AS 'Department ID', departments.department_name AS 'Department Name', 
    departments.over_head_costs AS 'Overhead Costs', SUM(products.product_sales) AS 'Product Sales', 
    (SUM(products.product_sales) - departments.over_head_costs) AS 'Total Profit'  
    FROM departments LEFT JOIN products on products.department_name=departments.department_name
    GROUP BY departments.department_name, departments.department_id, departments.over_head_costs
    ORDER BY departments.department_id;`;

    connection.query(joinQuery, function (err, res) {
        console.table(res);

    inquirer
        .prompt([
            {
                name: "id",
                type: "input",
                message: "What is the ID of the Dept you'd like to remove?"
            },
            {
                name: "youSure",
                message: "Are you sure you want to remove this?",
                type: "confirm",
                default: false
            }
        ])
        .then(function (answer) {
            
            if (answer.youSure === true){
            connection.query(
                "DELETE FROM departments WHERE department_id=" + answer.id + ";",
                function (err) {
                    if (err) throw err;
                    console.log("You have sucessfully removed: " + answer.id + " from the department list!");
                    anythingElse();
                }
            );
            } else{
                anythingElse();
            }
            
        });
    })
};

//Function to get you back into dispatch if you'd like to run anything else. Otherwise, ends the connection.
function anythingElse() {
    inquirer.prompt([
        {
            name: "anything",
            message: "Do you need to Supervise anything else?",
            type: "confirm",
            default: false
        }
    ]).then(function (response) {
        if (response.anything === true) {
            dispatch();
        } else {
            console.log("Okay, thanks for being a great supervisor with bAmazon");
            connection.end();
        }

    });
};


