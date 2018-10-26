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
    console.log(chalk.magenta(`
  ********************************************************
  **                 Welcome to bAmazon                 **
  ********************************************************

  Your One Stop Spot to Shop at a One Stop Shopping Spot!!

  `))

    dispatch();
});

//Switch statement I like to create to manage High Level menu options
function dispatch() {
    inquirer.prompt([
        {
            name: "dispatch",
            message: "What would you like to do today?",
            type: "list",
            choices: ["Make a Purchase from the Store", "Sell a Product to the Store"]
        }
    ]).then(function (response) {
        switch (response.dispatch) {
            case "Make a Purchase from the Store":
                queryBuy()
                break;
            case "Sell a Product to the Store":
                querySell()
                break;
        }
    });
}


//Function that displays all current inventory, taylored to buying
function queryBuy() {
    let tableQuery = `SELECT products.item_id AS 'Item ID', products.product_name AS 'Product Name', products.department_name
    AS 'Department Name', products.price AS 'Price', products.stock_quantity AS 'Quantity in Stock'  
    FROM products;`;

    connection.query(tableQuery, function (err, res) {
        console.table(res);
        buyMenu();
    })
}

//Function that Inquires customer to select an item ID and quantity to purchase
function buyMenu() {
    inquirer.prompt([
        {
            name: "ID",
            message: "What is the ID of the item you like to purchase?",
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
            message: "How many units of the product they would like to buy?",
            type: "input",
            validate: function (value) {
                if (isNaN(value) === false) {
                    return true
                }
                return false;
            }
        }

    ]).then(function (response) {

        console.log("You want item: " + response.ID + "\nYou want this many: " + response.quantity);
        checkQuant(response.ID, response.quantity)

    });

}

//Function to check if there's suffecient inventory, and if so, complete the sale
function checkQuant(id, quantity) {
    let query = `SELECT * FROM products WHERE item_id = ${id}`

    connection.query(query, function (err, res) {
        let stockQuant = res[0].stock_quantity;
        let currentSales = res[0].product_sales;
        let itemPrice = res[0].price;
        let total = quantity * itemPrice

        if (quantity > stockQuant) {
            console.log(chalk.red("Insufficient quantity!"));
            anythingElse();
        } else {

            connection.query(
                "UPDATE products SET ?, ? WHERE ?",
                [
                    {
                        stock_quantity: stockQuant - quantity
                    },
                    {
                        product_sales: currentSales + total
                    },
                    {
                        item_id: id
                    }
                ],
                function (error) {
                    if (error) throw err;
                    console.log("Order placed successfully!");
                    console.log("Your total price is: $" + (total))
                    anythingElse();
                }
            );

        }
    });

}

//Function that displays all current inventory, taylored to selling, which is offering buy back price as half.
function querySell() {
    let tableQuery = `SELECT products.item_id AS 'Item ID', products.product_name AS 'Product Name', products.department_name
    AS 'Department Name', (products.price/2) AS 'Buyback Price', products.stock_quantity AS 'Quantity in Stock'  
    FROM products;`;

    connection.query(tableQuery, function (err, res) {
        console.table(res);
        sellMenu();
    })
}

//Function that Inquires customer to select an item ID and quantity to sell back
function sellMenu() {

    inquirer.prompt([
        {
            name: "ID",
            message: "What is the ID of the item you like to sell to bAmazon?",
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
            message: "How many units of the product are you selling?",
            type: "input",
            validate: function (value) {
                if (isNaN(value) === false) {
                    return true
                }
                return false;
            }
        }

    ]).then(function (response) {
        console.log("You want to sell item: " + response.ID + "\nYou want to sell this many: " + response.quantity);
        let query = `SELECT * FROM products WHERE item_id = ${response.ID}`;
            let increase = response.quantity;

            connection.query(query, function (err, res) {
                let newQuant = parseInt(res[0].stock_quantity) + parseInt(increase);
                let newID = res[0].item_id
                //Completes the sale and updates the inventory. 
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
                        console.log("Success! Item: " + response.ID + " was sold. " + "We'll send you $" + response.quantity * (res[0].price/2) + " on a gift card.");
                        anythingElse();
                    }
                )
            });

    });

}

//Function to get you back into dispatch if you'd like to run anything else. Otherwise, ends the connection.
function anythingElse() {
    inquirer.prompt([
        {
            name: "again",
            message: "Would You Like To Keep Buying/Selling?",
            type: "confirm",
            default: false
        }
    ]).then(function (response) {
        if (response.again === true) {
            dispatch();
        } else {
            console.log(chalk.green("Okay, thanks for shopping with bAmazon"));
            connection.end();
        }

    });
}
