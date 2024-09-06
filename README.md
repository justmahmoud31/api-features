# Api-Feaatures
To adapt the README.md for api-features so that it covers both SQL and NoSQL (e.g., MongoDB) databases, you’ll need to update the installation and usage instructions to reflect the flexibility of the package for different database types. Below is a revised version of the README.md that covers both SQL and NoSQL usage:

## api-features
api-features is an npm package designed to simplify query operations for both SQL and NoSQL databases. It provides a unified API for common features such as pagination, filtering, sorting, field selection, and search, making it easier to work with different database systems.

## Installation
You can install the api-features package via npm. Run the following command in your project directory:

### bash
Copy code
```
npm install api-features
```
## Usage
For SQL Databases (e.g., using Sequelize)
javascript
Copy code
```
const ApiFeature = require('api-features');  // Use require if you are using CommonJS
// or
import ApiFeature from 'api-features';  // Use import if you are using ES Modules

const { Op } = require('sequelize');  // Import Sequelize operators if using SQL
const sequelizeQuery = SomeModel.findAll();  // Replace with your Sequelize query
const searchQuery = {
    page: 2, // take the pageNumber from req.query 
    limit: 10, // add the limit for pagination
    sort: 'name,-createdAt', // specify sorting fields
    fields: 'name,logo', // select which fields to include
    search: 'example' // add search keyword
};

const apiFeature = new ApiFeature(sequelizeQuery, searchQuery, 'sql');

// Apply pagination
apiFeature.pagination(10);

// Apply filtering
apiFeature.filter();

// Apply sorting
apiFeature.sort();

// Apply field selection
apiFeature.fields();

// Apply search
apiFeature.search(['name', 'description']); 

const results = await apiFeature.apply();  // Execute the query
console.log(results);
For NoSQL Databases (e.g., using MongoDB)
javascript
Copy code
const ApiFeature = require('api-features');  // Use require if you are using CommonJS
// or
import ApiFeature from 'api-features';  // Use import if you are using ES Modules

const mongooseQuery = SomeModel.find();  // Replace with your Mongoose query
const searchQuery = {
    page: 2, // take the pageNumber from req.query 
    limit: 10, // add the limit for pagination
    sort: 'name,-createdAt', // specify sorting fields
    fields: 'name,logo', // select which fields to include
    search: 'example' // add search keyword
};

const apiFeature = new ApiFeature(mongooseQuery, searchQuery, 'mongodb');

// Apply pagination
apiFeature.pagination(10);

// Apply filtering
apiFeature.filter();

// Apply sorting
apiFeature.sort();

// Apply field selection
apiFeature.fields();

// Apply search
apiFeature.search(['name', 'description']); 

const results = await apiFeature.apply();  // Execute the query
console.log(results);
```
API
### ApiFeature
`constructor(query, queryString, dbType)`

query: A query object (e.g., Mongoose query for NoSQL, Sequelize query for SQL).
queryString: An object containing query parameters (e.g., page, sort, fields, search).
dbType: Type of database ('sql' or 'mongodb').
`pagination(limit)`

Applies pagination to the query. Takes a limit parameter for the number of items per page.
`filter()`

Applies filtering to the query based on the queryString object.
`sort()`

Applies sorting to the query based on the queryString object.
`fields()`

Selects specific fields to include in the query results.
`search(fields)`

Applies a search to the query based on the queryString.search parameter. Takes an array of field names to search.
Example Queries
SQL:

sql
Copy code
```
SELECT * FROM Products WHERE name LIKE '%example%' LIMIT 10 OFFSET 20;
```
NoSQL (MongoDB):

javascript
Copy code
```
db.products.find({ name: /example/i }).skip(20).limit(10);
```
Made By Just Mahmoud