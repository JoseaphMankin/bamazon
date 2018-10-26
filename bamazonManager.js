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
    console.log(chalk.blue(`
  *********************************************************
  **               Welcome bAmazon Manager               **
  *********************************************************

  You work hard for the money... and for that we thank you!

  `))
    dispatch();

});

//Switch statement I like to create to manage High Level menu options
function dispatch() {
    inquirer.prompt([
        {
            name: "dispatch",
            message: "What would you like to manage?",
            type: "list",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Remove a Product"]
        }
    ]).then(function (response) {
        switch (response.dispatch) {
            case "View Products for Sale":
                queryAll()
                break;
            case "View Low Inventory":
                lowInventory()
                break;
            case "Add to Inventory":
                addInventory()
                break;
            case "Add New Product":
                addProduct()
                break;
            case "Remove a Product":
                removeProduct()
                break;
        }
    });

}

//Function for viewing the current inventory
function queryAll() {
    let tableQuery = `SELECT products.item_id AS 'Item ID', products.product_name AS 'Product Name', products.department_name
    AS 'Department Name', products.price AS 'Price', products.stock_quantity AS 'Quantity in Stock'  
    FROM products;`;

    connection.query(tableQuery, function (err, res) {
        console.table(res);
        anythingElse();
    })
}


//Function for viewing any items in the inventory whose stock is less than 5
function lowInventory() {
    let tableQuery = `SELECT products.item_id AS 'Item ID', products.product_name AS 'Product Name', products.department_name
    AS 'Department Name', products.price AS 'Price', products.stock_quantity AS 'Quantity in Stock'  
    FROM products WHERE products.stock_quantity < 5;`;

    connection.query(tableQuery, function (err, res) {
        console.table(res);
        anythingElse();
    })

};

//Function that gives Manager ability to increase stock numbers
function addInventory() {
    let tableQuery = `SELECT products.item_id AS 'Item ID', products.product_name AS 'Product Name', products.department_name
    AS 'Department Name', products.price AS 'Price', products.stock_quantity AS 'Quantity in Stock'  
    FROM products;`;
    connection.query(tableQuery, function (err, res) {
    
        console.table(res);
    
        inquirer.prompt([
            {
                name: "ID",
                message: "What is the ID of the item you like to increase the inventory of?",
                type: "input",
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true
                    }
                    return false;
                }
            },
            {
                name: "quantity",
                message: "How many units of the product they would like to add?",
                type: "input",
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true
                    }
                    return false;
                }
            }

        ]).then(function (response) {
            let query = `SELECT * FROM products WHERE item_id = ${response.ID}`;
            let increase = response.quantity;

            connection.query(query, function (err, res) {
                let newQuant = parseInt(res[0].stock_quantity) + parseInt(increase);
                let newID = res[0].item_id

                connection.query(
                    "UPDATE products SET ? WHERE ?",
                    [
                        {
                            stock_quantity: newQuant
                        },
                        {
                            item_id: newID
                        }
                    ],
                    function (error) {
                        if (error) throw err;
                        console.log("Success! Item: " + response.ID + " was increased by: " + response.quantity);
                        anythingElse();
                    }
                )
            });
        })
    })
}

//Function that gives manager ability to create a product. If the dept is new, it's also added to the Dept Table 
function addProduct() {
    inquirer
        .prompt([
            {
                name: "name",
                type: "input",
                message: "What is the name of the item you'd like to create?"
            },
            {
                name: "dept",
                type: "input",
                message: "What department should this be added to?"
            },
            {
                name: "price",
                type: "input",
                message: "What is the item price?",
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            },
            {
                name: "amount",
                type: "input",
                message: "How many should we stock?",
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            }
        ])
        .then(function (answer) {
            // when finished prompting, insert a new item into the db with that info
            connection.query(
                "INSERT INTO products SET ?",
                {
                    product_name: answer.name,
                    department_name: answer.dept,
                    price: answer.price,
                    stock_quantity: answer.amount,
                },
                function (err) {
                    if (err) throw err;
                    console.log("You have sucessfully added: " + answer.name + " to the inventory!");
                    anythingElse();
                }
            );

            connection.query(
                "INSERT INTO departments SET ?",
                {
                    department_name: answer.dept,
                },
                function (err) {
                    if (err) throw err;
                    
                }
            );
            
        });
};

//Gives manager the ability to delete a product from the Products table
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

//Function to get you back into dispatch if you'd like to run anything else. Otherwise, ends the connection.
function anythingElse() {
    inquirer.prompt([
        {
            name: "anything",
            message: "Do you need to manage anything else?",
            type: "confirm",
            default: false
        }
    ]).then(function (response) {
        if (response.anything === true) {
            dispatch();
        } else {
            console.log("Okay, thanks for being a great manager with bAmazon");
            connection.end();
        }

    });
};


