
# api-features

`api-features` is an npm package for simplifying MongoDB queries with common features like pagination, filtering, sorting, field selection, and search. This package helps streamline MongoDB queries by providing a unified API for these operations.

## Installation

You can install the `api-features` package via npm. Run the following command in your project directory:

 ```bash
   npm install api-features
 ```
# Usage
Here's how you can use the api-features package in your project:
```
const ApiFeature = require('api-features');  // Use require if you are using CommonJS
// or
import ApiFeature from 'api-features';  // Use import if you are using ES Modules

const mongooseQuery = SomeModel.find();  // Replace with your Mongoose query
const searchQuery = {
    page: 2, // take the pageNumber from req.query 
    limit: 10, //add the limit for pagination
    sort: 'name,-createdAt', // add what you want to search for in your model
    fields: 'name,logo', // select which fields you want to appear 
    search: 'example' // add what you want to search for 
};

const apiFeature = new ApiFeature(mongooseQuery, searchQuery);

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

const results = await apiFeature.mongooseQuery.exec();
console.log(results);
```
# API
ApiFeature
`constructor(mongooseQuery, searchQuery)`
mongooseQuery: A Mongoose query object.
`searchQuery`: An object containing query parameters (e.g., page, sort, fields, search).
pagination(limit)
Applies pagination to the Mongoose query. Takes a limit parameter for the number of items per page.

`filter()`
Applies filtering to the Mongoose query based on the searchQuery object.

`sort()`
Applies sorting to the Mongoose query based on the searchQuery object.

`fields()`
Selects specific fields to include in the Mongoose query results.

`search(fields)`
Applies a search to the Mongoose query based on the searchQuery.search parameter. Takes an array of field names to search.


### Made By Just Mahmoud ;
