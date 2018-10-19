DROP DATABASE IF EXISTS bamazonDB;
CREATE DATABASE bamazonDB;
USE bamazonDB;

CREATE TABLE products(
    item_id INT NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(45) NULL,
    department_name VARCHAR(50) NULL,
    price DECIMAL(10,2),
    stock_quantity INT NULL,
    PRIMARY KEY (item_id),

);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("JavaScript for Dummies", "Books", 5, 20),
("Eloquent JavaScript", "Books", 35, 20),
("Python for Dummies", "Books", 5, 2),
("MacBook Pro", "Electronics", 1200, 5),
("Galaxy S8", "Electronics", 500, 10),
("Iphone X", "Electronics", 899, 1),
("Dirty Socks", "Clothing", 1, 100),
("Xmas Socks", "Clothing", 3, 20),
("Halloween Socks", "Clothing", 4, 40),
("The Holy Grail", "Antique", 10000, 1);