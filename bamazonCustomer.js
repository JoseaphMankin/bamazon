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
  ***************************
  ** Welcome to bAmazon **
  ***************************

  Your One Stop Shop to Shop fo One Stop Shop Stops
  `))
    // dispatch();
    queryAll();
});

function queryAll() {
    connection.query("SELECT * FROM products", function (err, res) {
        res.forEach(item => {
            console.log(`${item.item_id} | ${item.product_name} | ${item.department_name} | ${item.price} | ${item.stock_quantity}`)
        })
        mainMenu();
    })
}

function mainMenu() {
    inquirer.prompt([
        {
            name: "ID",
            message: "What is the ID of the item you like to purchase?",
            type: "input",
            validate: function (value) {
                if (isNaN(value) === false){
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
                if (isNaN(value) === false){
                    return true
                } 
                return false;
            }
        } 

    ]).then(function (response) {
        console.log("You want item: " + response.ID + "\nYou want this many: " + response.quantity);
        checkQuant(response.ID,response.quantity)
        // connection.end();

    });

}

function checkQuant(id, quantity){
    let query = `SELECT * FROM products WHERE item_id = ${id}`

    connection.query(query, function (err, res) {
     
        if (quantity > res[0].stock_quantity){
            console.log("Insufficient quantity!")
        } else {
            //ADD YOUR UPDATING FUNCTION HERE
            console.log("YOU GOT IT")
        }

    });

}

function dispatch() {
    inquirer.prompt([
        {
            name: "dispatch",
            message: "Would you like to POST or BID?",
            type: "list",
            choices: ["POST", "BID"]
        }
    ]).then(function (response) {
        if (response.dispatch === "POST") {
            poster();
        } else {
            bidder();
        }

    });

}

// function poster() {

//     let item = "";
//     let category = "";
//     let startingBid = "";

//     inquirer.prompt([
//         {
//             name: "item",
//             message: "What is the item you would like to bid?",
//             type: "input",
//         }
//     ]).then(function (itemResp) {
//         item = itemResp.item;

//         inquirer.prompt([
//             {
//                 type: "input",
//                 message: "What category would you like to place your auction in?",
//                 name: "category"
//             }
//         ]).then(function (catResponse) {
//             category = catResponse.category

//             inquirer.prompt([
//                 {
//                     type: "input",
//                     message: "What Would You Like Your Starting Bid to Be",
//                     name: "bid"
//                 }
//             ]).then(function (bidResponse) {
//                 startingBid = bidResponse.bid


//                 console.log("HERE'S YOUR AUCTION ITEM!! \nItem: " + item + "\ncategory: " + category + "\nStarting Bid: $" + startingBid)
//                 inserter(item, category, startingBid);
//             });

//         });

//     });

// }

// function bidder() {

//     inquirer.prompt([
//         {
//             name: "selector",
//             message: "What item would you like to bid on?",
//             type: "list",
//             choices: ["Pearl Harbor 2: The Revenge", "Transformers 14", "Newer Ghostbusters?"]
//         }
//     ]).then(function (resp) {
//         choice = resp.selector

//         console.log("You Chose: " + choice)
//         connection.end();
//     });

// }



// function inserter(item, category, bid) {
//     const newItem = {
//         item, category, bid
//     }
//     connection.query("INSERT INTO products SET ?", newItem, function (err, res) {
//         queryAll();
//     })
// }

// function addSong() {
//     console.log("Inserting a new song");
//     const newSong = {
//         title: "No Excuses",
//         artist: "Alice In Chains",
//         genre: "Grunge"
//     }
//     connection.query("INSERT INTO songs SET ?", newSong, function (err, res) {
//         console.log(res.affectedRows + "")
//     })
// }
