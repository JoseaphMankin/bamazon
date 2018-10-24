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

SELECT * FROM departments INNER JOIN products ON products.department_name = departments.department_name;

SELECT department_id AS ID, department_name AS DEPT_NAME, over_head_costs 
AS OVER_HEAD_COSTS, (over_head_costs * 20) AS Total_Profits FROM departments;

Select department_id AS department_id, department_name AS department_name, over_head_costs 
AS over_head_costs, total_sales AS total_sales, (total_sales - over_head_costs) AS total_profit FROM departments;

SELECT product_name, products.department_name, products.price, products.stock_quantity, departments.over_head_costs, products.product_sales
FROM products
INNER JOIN departments ON products.department_name = departments.department_name
GROUP BY department_name;

SELECT departments.department_name, departments.over_head_cost, products.product_sales
FROM departments
INNER JOIN products
ON departments.department_name = products.department_name;

SELECT department_name AS 'Department Name', SUM(departments.over_head_costs) AS 'Overhead Costs', SUM(products.product_sales) AS 'Total Sales' 
FROM departments
INNER JOIN departments on products.department_name = departments.department_name
GROUP BY departments.department_name;

SELECT department_name AS 'Department Name', SUM(departments.over_head_costs) AS 'Overhead Cost' FROM departments 
GROUP BY departments.department_name;	

SELECT department_name AS 'Department Name', SUM(products.product_sales) AS 'Total Sales' FROM products 
GROUP BY products.department_name;

SELECT products.product_name AS 'Product Name', products.department_name
AS 'Department Name', products.price AS 'Price', products.stock_quantity AS 'Quantity in Stock'  
FROM products;

SELECT products.product_name AS 'Product Name', products.department_name
    AS 'Department Name', products.price AS 'Price', products.stock_quantity AS 'Quantity in Stock'  
    FROM products WHERE products.stock_quantity < 5;

SELECT departments.department_id AS 'Department ID', departments.department_name AS 'Department Name', 
departments.over_head_costs AS 'Overhead Costs', 
SUM(products.product_sales) AS 'Product Sales', 
(SUM(products.product_sales) - departments.over_head_costs) AS 'Total Profit'  
FROM departments
LEFT JOIN products on products.department_name=departments.department_name
GROUP BY departments.department_name, departments.department_id, departments.over_head_costs
ORDER BY departments.department_id;
                        



