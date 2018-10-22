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
  *****************************************************
  **            Welcome bAmazon Supervisor           **
  *****************************************************

  You're the boss! Now let's do some big baller stuff!!

  `))
    dispatch();

});

function dispatch() {
    inquirer.prompt([
        {
            name: "dispatch",
            message: "What would you like to oversee?",
            type: "list",
            choices: ["View Product Sales by Department", "Create New Department"]
        }
    ]).then(function (response) {
        switch (response.dispatch) {
            case "View Product Sales by Department":
                queryAll()
                break;
            case "Create New Department":
                addDepartment()
                break;
        }
    });

}

function queryAll() {
    let joinQuery = 'SELECT product_name, products.department_name, products.price, products.stock_quantity, departments.over_head_costs, products.product_sales FROM products INNER JOIN departments ON products.department_name = departments.department_name;'
    connection.query(joinQuery, function (err, res) {
        res.forEach(item => {
            console.log(`${item.product_name} | ${item.department_name} | ${item.price} | ${item.stock_quantity} | ${item.product_sales} | ${item.over_head_costs}`)
        })
        anythingElse();
    })
}

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


