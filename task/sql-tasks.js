'use strict';

/********************************************************************************************
 *                                                                                          *
 * The goal of the task is to get basic knowledge of SQL functions and                      *
 * approaches to work with data in SQL.                                                     *
 * https://dev.mysql.com/doc/refman/5.7/en/function-reference.html                          *
 *                                                                                          *
 * The course do not includes basic syntax explanations. If you see the SQL first time,     *
 * you can find explanation and some trainings at W3S                                       *
 * https://www.w3schools.com/sql/sql_syntax.asp                                             *
 *                                                                                          *
 ********************************************************************************************/


/**
 *  Create a SQL query to return next data ordered by city and then by name:
 * | Employy Id | Employee Full Name | Title | City |
 *
 * @return {array}
 *
 */
async function task_1_1(db) {
    // The first task is example, please follow the style in the next functions.
    let result = await db.query(`
        SELECT
           EmployeeID as "Employee Id",
           CONCAT(FirstName, ' ', LastName) AS "Employee Full Name",
           Title as "Title",
           City as "City"
        FROM Employees
        ORDER BY City, "Employee Full Name"
    `);
    return result[0];
}

/**
 *  Create a query to return an Order list ordered by order id descending:
 * | Order Id | Order Total Price | Total Order Discount, % |
 *
 * NOTES: Discount in OrderDetails is a discount($) per Unit.
 * @return {array}
 *
 */
async function task_1_2(db) {
    let result = await db.query(`
        SELECT
            OrderId as "Order Id",
            SUM(UnitPrice * Quantity) AS "Order Total Price",
            ROUND(SUM(Discount * Quantity)/SUM(UnitPrice * Quantity) * 100, 3) AS "Total Order Discount, %"
        FROM OrderDetails
        GROUP BY OrderID
        ORDER BY OrderID desc
    `);
    return result[0];
}

/**
 *  Create a query to return all customers from USA without Fax:
 * | CustomerId | CompanyName |
 *
 * @return {array}
 *
 */
async function task_1_3(db) {
    let result = await db.query(`
        SELECT CustomerId, CompanyName
        FROM Customers
        WHERE Fax IS null AND Country = "USA"
    `);
    return result[0];
}

/**
 * Create a query to return:
 * | Customer Id | Total number of Orders | % of all orders |
 *
 * order data by % - higher percent at the top, then by CustomerID asc
 *
 * @return {array}
 *
 */
async function task_1_4(db) {
    let result = await db.query(`
        SELECT 
            CustomerID As "Customer Id", 
            Count(CustomerID) As "Total number of Orders",
            ROUND(Count(CustomerID) / (SELECT count(*) FROM Orders) * 100,5) as "% of all orders"
        FROM Orders
        GROUP BY CustomerID
        ORDER BY Count(CustomerID) / (SELECT count(*) FROM Orders) * 100 desc, CustomerID
    `);
    return result[0];
}

/**
 * Return all products where product name starts with 'A', 'B', .... 'F' ordered by name.
 * | ProductId | ProductName | QuantityPerUnit |
 *
 * @return {array}
 *
 */
async function task_1_5(db) {
    let result = await db.query(`
        SELECT
            ProductId,
            ProductName,
            QuantityPerUnit
        FROM Products
        WHERE ProductName REGEXP '^[A-F]'
        ORDER BY ProductName
    `);
    return result[0];
}

/**
 *
 * Create a query to return all products with category and supplier company names:
 * | ProductName | CategoryName | SupplierCompanyName |
 *
 * Order by ProductName then by SupplierCompanyName
 * @return {array}
 *
 */
async function task_1_6(db) {
    let result = await db.query(`
        SELECT 
            ProductName,
            c.CategoryName,
            s.CompanyName AS SupplierCompanyName
        FROM Products p JOIN Categories c ON p.CategoryID = c.CategoryID JOIN Suppliers s ON p.SupplierID = s.SupplierID
        ORDER BY ProductName, SupplierCompanyName
    `);
    return result[0];
}

/**
 *
 * Create a query to return all employees and full name of person to whom this employee reports to:
 * | EmployeeId | FullName | ReportsTo |
 *
 * Order data by EmployeeId.
 * Reports To - Full name. If the employee does not report to anybody leave "-" in the column.
 * @return {array}
 *
 */
async function task_1_7(db) {
    let result = await db.query(`
        SELECT 
            e1.EmployeeId,
            CONCAT(e1.FirstName, ' ', e1.LastName) AS FullName,
            ifNull(CONCAT(e2.FirstName, ' ', e2.LastName), '-') AS ReportsTo
        FROM Employees e1 LEFT JOIN Employees e2 ON e1.ReportsTo = e2.EmployeeID
        ORDER BY EmployeeId
    `);
    return result[0];
}

/**
 *
 * Create a query to return:
 * | CategoryName | TotalNumberOfProducts |
 *
 * @return {array}
 *
 */
async function task_1_8(db) {
    let result = await db.query(`
        SELECT 
            CategoryName,
            COUNT(*) AS TotalNumberOfProducts
        FROM Categories c JOIN Products p ON c.CategoryID = p.CategoryID
        GROUP BY c.CategoryID
        ORDER BY CategoryName
    `);
    return result[0];
}

/**
 *
 * Create a SQL query to find those customers whose contact name containing the 1st character is 'F' and the 4th character is 'n' and rests may be any character.
 * | CustomerID | ContactName |
 *
 * @return {array}
 *
 */
async function task_1_9(db) {
    let result = await db.query(`
        SELECT 
            CustomerID,
            ContactName
        FROM Customers
        WHERE ContactName LIKE "F__n%"
    `);
    return result[0];
}

/**
 * Write a query to get discontinued Product list:
 * | ProductID | ProductName |
 *
 * @return {array}
 *
 */
async function task_1_10(db) {
    let result = await db.query(`
        SELECT
            ProductID,
            ProductName
        FROM Products
        WHERE Discontinued = 1
    `);
    return result[0];
}

/**
 * Create a SQL query to get Product list (name, unit price) where products cost between $5 and $15:
 * | ProductName | UnitPrice |
 *
 * Order by UnitPrice then by ProductName
 *
 * @return {array}
 *
 */
async function task_1_11(db) {
    let result = await db.query(`
        SELECT
            ProductName,
            UnitPrice
        FROM Products
        WHERE UnitPrice BETWEEN 5 AND 15
        ORDER BY UnitPrice, ProductName
    `);
    return result[0];
}

/**
 * Write a SQL query to get Product list of twenty most expensive products:
 * | ProductName | UnitPrice |
 *
 * Order products by price then by ProductName.
 *
 * @return {array}
 *
 */
async function task_1_12(db) {
    let result = await db.query(`
        SELECT *
        FROM (
            SELECT 
		        ProductName,
		        UnitPrice 
	        FROM Products
	        ORDER BY UnitPrice desc
	        LIMIT 20) t
        ORDER BY UnitPrice, ProductName
    `);
    return result[0];
}

/**
 * Create a SQL query to count current and discontinued products:
 * | TotalOfCurrentProducts | TotalOfDiscontinuedProducts |
 *
 * @return {array}
 *
 */
async function task_1_13(db) {
    let result = await db.query(`
        SELECT *
        FROM 
            (SELECT COUNT(ProductID) AS TotalOfCurrentProducts  FROM Products) a 
            JOIN 
            (SELECT COUNT(ProductID) AS TotalOfDiscontinuedProducts  FROM Products WHERE Discontinued = 1) b
    `);
    return result[0];
}

/**
 * Create a SQL query to get Product list of stock is less than the quantity on order:
 * | ProductName | UnitsOnOrder| UnitsInStock |
 *
 * @return {array}
 *
 */
async function task_1_14(db) {
    let result = await db.query(`
        SELECT 
            ProductName,
            UnitsOnOrder,
            UnitsInStock
        FROM Products
        WHERE UnitsInStock < UnitsOnOrder
    `);
    return result[0];
}

/**
 * Create a SQL query to return the total number of orders for every month in 1997 year:
 * | January | February | March | April | May | June | July | August | September | November | December |
 *
 * @return {array}
 *
 */
async function task_1_15(db) {
    let result = await db.query(`
        SELECT 
            (SELECT COUNT(*) FROM Orders WHERE YEAR(OrderDate) = 1997 AND MONTH(OrderDate)=1) AS January,
            (SELECT COUNT(*) FROM Orders WHERE YEAR(OrderDate) = 1997 AND MONTH(OrderDate)=2) AS February,
            (SELECT COUNT(*) FROM Orders WHERE YEAR(OrderDate) = 1997 AND MONTH(OrderDate)=3) AS March,
            (SELECT COUNT(*) FROM Orders WHERE YEAR(OrderDate) = 1997 AND MONTH(OrderDate)=4) AS April,
            (SELECT COUNT(*) FROM Orders WHERE YEAR(OrderDate) = 1997 AND MONTH(OrderDate)=5) AS May,
            (SELECT COUNT(*) FROM Orders WHERE YEAR(OrderDate) = 1997 AND MONTH(OrderDate)=6) AS June,
            (SELECT COUNT(*) FROM Orders WHERE YEAR(OrderDate) = 1997 AND MONTH(OrderDate)=7) AS July,
            (SELECT COUNT(*) FROM Orders WHERE YEAR(OrderDate) = 1997 AND MONTH(OrderDate)=8) AS August,
            (SELECT COUNT(*) FROM Orders WHERE YEAR(OrderDate) = 1997 AND MONTH(OrderDate)=9) AS September,
            (SELECT COUNT(*) FROM Orders WHERE YEAR(OrderDate) = 1997 AND MONTH(OrderDate)=10) AS October,
            (SELECT COUNT(*) FROM Orders WHERE YEAR(OrderDate) = 1997 AND MONTH(OrderDate)=11) AS November,
            (SELECT COUNT(*) FROM Orders WHERE YEAR(OrderDate) = 1997 AND MONTH(OrderDate)=12) AS December
        FROM Orders
        LIMIT 1
    `);
    return result[0];
}

/**
 * Create a SQL query to return all orders where ship postal code is provided:
 * | OrderID | CustomerID | ShipCountry |
 *
 * @return {array}
 *
 */
async function task_1_16(db) {
    let result = await db.query(`
        SELECT
            OrderID,
            CustomerID,
            ShipCountry
        FROM Orders
        WHERE ShipPostalCode IS not null
    `);
    return result[0];
}

/**
 * Create SQL query to display the average price of each categories's products:
 * | CategoryName | AvgPrice |
 *
 * @return {array}
 *
 * Order by AvgPrice descending then by CategoryName
 *
 */
async function task_1_17(db) {
    let result = await db.query(`
        SELECT
            CategoryName,
            SUM(UnitPrice) / COUNT(*) AS AvgPrice
        FROM Products p JOIN Categories c ON p.CategoryID = c.CategoryID
        GROUP BY p.CategoryID
        ORDER BY AvgPrice desc, CategoryName
    `);
    return result[0];
}

/**
 * Create a SQL query to calcualte total orders count by each day in 1998:
 * | OrderDate | Total Number of Orders |
 *
 * Order Date needs to be in the format '%Y-%m-%d %T'
 * @return {array}
 *
 */
async function task_1_18(db) {
    let result = await db.query(`
        SELECT
            DATE_FORMAT(OrderDate, '%Y-%m-%d %T') AS OrderDate, 
            COUNT(*) AS "Total Number of Orders"
        FROM Orders
        WHERE YEAR(OrderDate) = 1998
        GROUP BY OrderDate
    `);
    return result[0];
}

/**
 * Create a SQL query to display customer details whose total orders amount is more than 10000$:
 * | CustomerID | CompanyName | TotalOrdersAmount, $ |
 *
 * Order by "TotalOrdersAmount, $" descending then by CustomerID
 * @return {array}
 *
 */
async function task_1_19(db) {
    let result = await db.query(`
        SELECT
            o.CustomerID,
            CompanyName,
            SUM(od.UnitPrice * Quantity) AS "TotalOrdersAmount, $"
        FROM Orders o JOIN Customers c ON o.CustomerID = c.CustomerID JOIN OrderDetails od ON o.OrderID = od.OrderID
        GROUP BY CustomerID
        HAVING SUM(od.UnitPrice * Quantity) > 10000
        ORDER BY SUM(od.UnitPrice * Quantity) desc, CustomerID
    `);
    return result[0];
}

/**
 *
 * Create a SQL query to find the employee that sold products for the largest amount:
 * | EmployeeID | Employee Full Name | Amount, $ |
 *
 * @return {array}
 *
 */
async function task_1_20(db) {
    let result = await db.query(`
        SELECT
            e.EmployeeID,
            CONCAT(e.FirstName, ' ', e.LastName) AS "Employee Full Name",
            SUM(UnitPrice * Quantity) AS "Amount, $"
        FROM OrderDetails od JOIN Orders o ON od.OrderID = o.OrderID JOIN Employees e ON o.EmployeeID = e.EmployeeID
        GROUP BY EmployeeID
        ORDER BY SUM(UnitPrice * Quantity) desc
        LIMIT 1
    `);
    return result[0];
}

/**
 * Write a SQL statement to get the maximum purchase amount of all the orders.
 * | OrderID | Maximum Purchase Amount, $ |
 *
 * @return {array}
 */
async function task_1_21(db) {
    let result = await db.query(`
        SELECT
            OrderID,
            SUM(UnitPrice * Quantity) AS "Maximum Purchase Amount, $"
        FROM OrderDetails
        GROUP BY OrderID
        ORDER BY SUM(UnitPrice * Quantity) desc
        LIMIT 1
    `);
    return result[0];
}

/**
 * Create a SQL query to display the name of each customer along with their most expensive purchased product:
 * | CompanyName | ProductName | PricePerItem |
 *
 * order by PricePerItem descending and them by CompanyName and ProductName acceding
 * @return {array}
 */
async function task_1_22(db) {
    let result = await db.query(`
        SELECT DISTINCT
            CompanyName,
            ProductName,
            od1.UnitPrice AS "PricePerItem"
        FROM Customers c1 JOIN Orders o1 ON o1.CustomerID = c1.CustomerID JOIN OrderDetails od1 ON od1.OrderID = o1.OrderID JOIN Products p ON p.ProductID = od1.ProductID
        WHERE od1.UnitPrice = (
            SELECT 
                MAX(od2.UnitPrice) 
            FROM Customers c2 JOIN Orders o2 ON o2.CustomerID = c2.CustomerID JOIN OrderDetails od2 ON od2.OrderID = o2.OrderID
            WHERE c2.CompanyName = c1.CompanyName)
        ORDER BY PricePerItem desc, CompanyName, ProductName
    `);
    return result[0];
}

module.exports = {
    task_1_1: task_1_1,
    task_1_2: task_1_2,
    task_1_3: task_1_3,
    task_1_4: task_1_4,
    task_1_5: task_1_5,
    task_1_6: task_1_6,
    task_1_7: task_1_7,
    task_1_8: task_1_8,
    task_1_9: task_1_9,
    task_1_10: task_1_10,
    task_1_11: task_1_11,
    task_1_12: task_1_12,
    task_1_13: task_1_13,
    task_1_14: task_1_14,
    task_1_15: task_1_15,
    task_1_16: task_1_16,
    task_1_17: task_1_17,
    task_1_18: task_1_18,
    task_1_19: task_1_19,
    task_1_20: task_1_20,
    task_1_21: task_1_21,
    task_1_22: task_1_22
};
