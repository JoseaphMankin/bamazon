DROP DATABASE IF EXISTS bamazonDB;
CREATE DATABASE bamazonDB;
USE bamazonDB;

CREATE TABLE products(
    item_id INT NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(45) NULL,
    department_name VARCHAR(50) NULL,
    price DECIMAL(10,2),
    stock_quantity INT NULL,
    product_sales INT NULL,
    PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("JavaScript for Dummies", "Books", 5.50, 20),
("Eloquent JavaScript", "Books", 35.00, 20),
("Python for Dummies", "Books", 5.99, 2),
("MacBook Pro", "Electronics", 1200.00, 5),
("Galaxy S8", "Electronics", 500.25, 10),
("Iphone X", "Electronics", 899.99, 1),
("Dirty Socks", "Clothing", .99, 100),
("Xmas Socks", "Clothing", 3.00, 20),
("Halloween Socks", "Clothing", 4.00, 40),
("The Holy Grail", "Antiques", 10000.99, 1);


CREATE TABLE departments(
    department_id INTEGER NOT NULL AUTO_INCREMENT,
    department_name VARCHAR(55) NULL,
    over_head_costs DECIMAL(10,2),
    PRIMARY KEY (department_id)
);

INSERT INTO departments (department_name, over_head_costs)
VALUES ( "Books", 1000),
( "Electronics", 2000),
( "Clothing", 1500),
( "Antiques", 5000);

SELECT * FROM products;
SELECT * FROM departments;