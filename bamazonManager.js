const mysql = require("mysql");
const inquirer = require("inquirer");
const chalk = require("chalk");

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

function dispatch() {
    inquirer.prompt([
        {
            name: "dispatch",
            message: "What would you like to manage?",
            type: "list",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
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
        }
    });

}

function queryAll() {
    connection.query("SELECT * FROM products", function (err, res) {
        res.forEach(item => {
            console.log(`${item.item_id} | ${item.product_name} | ${item.department_name} | ${item.price} | ${item.stock_quantity}`)
        })
        anythingElse();
    })
}

function lowInventory() {
    connection.query("SELECT * FROM products WHERE stock_quantity <= 5", function (err, res) {
        res.forEach(item => {
            console.log(`${item.item_id} | ${item.product_name} | ${item.department_name} | ${item.price} | ${item.stock_quantity}`)
        })
        anythingElse();
    })

};


function addInventory() {
    connection.query("SELECT * FROM products", function (err, res) {
        res.forEach(item => {
            console.log(`${item.item_id} | ${item.product_name} | ${item.department_name} | ${item.price} | ${item.stock_quantity}`)
        })


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
            
        });
};

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

