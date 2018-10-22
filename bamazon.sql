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
VALUES ("JavaScript for Dummies", "Books", 5.50, 200),
("Eloquent JavaScript", "Books", 35.00, 200),
("Python for Dummies", "Books", 5.99, 25),
("MacBook Pro", "Electronics", 1200.00, 50),
("Galaxy S8", "Electronics", 500.25, 100),
("Iphone X", "Electronics", 899.99, 100),
("Dirty Socks", "Clothing", .99, 100),
("Xmas Socks", "Clothing", 3.00, 200),
("Halloween Socks", "Clothing", 4.00, 400),
("The Holy Grail", "Antiques", 10000.99, 1);


CREATE TABLE departments(
    department_id INTEGER NOT NULL AUTO_INCREMENT,
    department_name VARCHAR(55) NULL,
    over_head_costs DECIMAL(10,2),
    PRIMARY KEY (department_id)
);

INSERT INTO departments (department_name, over_head_costs)
VALUES ( "Books", 500),
( "Electronics", 1000),
( "Clothing", 800),
( "Antiques", 5000);

SELECT * FROM products;
SELECT * FROM departments;

SELECT product_name, products.department_name, products.price, products.stock_quantity, departments.over_head_costs, products.product_sales
FROM products INNER JOIN departments ON products.department_name = departments.department_name;