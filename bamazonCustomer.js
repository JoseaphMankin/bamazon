const mysql = require("mysql");
const inquirer = require("inquirer");
const chalk = require("chalk");
const cTable = require('console.table');

//Create Connection to mySQL
const connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "",
    database: "bamazonDB"
});

//Loading of Main Menu
connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    console.log(chalk.red(`
  ********************************************************
  **                 Welcome to bAmazon                 **
  ********************************************************

  Your One Stop Spot to Shop at a One Stop Shopping Spot!!

  `))
    
    queryAll();
});


//Function that displays all current inventory
function queryAll() {
    let tableQuery = `SELECT products.item_id AS 'Item ID', products.product_name AS 'Product Name', products.department_name
    AS 'Department Name', products.price AS 'Price', products.stock_quantity AS 'Quantity in Stock'  
    FROM products;`;

    connection.query(tableQuery, function (err, res) {
        console.table(res);
        mainMenu();
    })
}

//Function that Inquires customer to select an item ID and quantity to purchase
function mainMenu() {
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
            console.log("Insufficient quantity!")
            buyAgain();
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
                    buyAgain();
                }
            );

        }
    });

}

function buyAgain() {
    inquirer.prompt([
        {
            name: "again",
            message: "Would you like to Buy again?",
            type: "confirm",
            default: false
        }
    ]).then(function (response) {
        if (response.again === true) {
            queryAll();
        } else {
            console.log("Okay, thanks for shopping with bAmazon");
            connection.end();
        }

    });
}


