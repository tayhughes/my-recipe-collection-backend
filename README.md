# My Recipe Collection
This is a software that allows a user to keep a collection of recipes. Users have the ability to manually enter recipes, which can then be viewed on the my-recipe-collection-frontend application. This back end server allows http requests to be done, which get processed to make Queries to a PostgreSQL database which should exist already. 

## Project Creator
This project is created by Taylor Hughes

## PostgreSQL database
You will need to ensure that you have already created a database and a table for storing the recipes
Currently the `recipes` table should contain 4 columns, id, name, main_ingredient, and cuisine_type, respectively.

The following is an example of how the Pool object should be declared. The information in this object should reflect the actual credentials of the PostgreSQL database for which you are logged in:

```js
// index.js
const pool = new Pool({
    user: 'recipeappuser',
    password: 'recipe',
    host: 'localhost',
    port: 5432,
    database: 'recipe_db'
});
```

## Getting Started
Firstly, keep in mind that this is the backend component of the software. Without the frontend component, this software will only be capable of supplying get requests when observed in a browser. This Backend uses the Express.js library to operate.

### The Front Server
You should use the my-recipe-collection-frontend client software to interact with this server in order to interact with the database.

### Node.js
This project requires Node.js to be installed on the computer running the software. This project uses the React library for implementing the dynamic webpages. All the dependencies can be found in the `package.json`. In order to run the project you will need to make sure all these dependencies are installed, which can be done by running the following command within the root folder of the project.

```bash
$ npm install
```

### Running the Back End Server
In order to run the backend end you should be able to run the command line command:

```bash
# This will run the script that will run the front end
$ npm start

# Alternatively you can run
$ node index.js
```

## Creating Tables for the Database
```sql
CREATE TABLE recipes (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150),
    main_ingredient TEXT,
    main_instructions TEXT,
    cuisine_type VARCHAR(150)
);
```