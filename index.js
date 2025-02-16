import express from 'express';
import cors from 'cors';
import pg from 'pg';
let serial_value = 6;
const QUERY_TO_SEARCH = 'SELECT id,name,main_ingredient,cuisine_type FROM recipes ORDER BY id DESC;';

// const { Client } = pg;
// const client = new Client({
//     user: 'recipeappuser',
//     password: 'recipe',
//     host: 'localhost',
//     port: 5432,
//     database: 'recipe_db'
// });
// await client.connect();
// const query_result = await client.query(QUERY_TO_SEARCH);
// await client.end();

const { Pool } = pg;
const pool = new Pool({
    user: 'recipeappuser',
    password: 'recipe',
    host: 'localhost',
    port: 5432,
    database: 'recipe_db'
});

const application = express();
application.use(cors());
application.use(express.json());
const port_interface = 3001;

application.get('/AboutPage', async(req,res) => {
    res.send("<!doctype><html><body><h1>AboutPage</h1></body></html>");
})
application.get('/data',async (req,res) => {
    try{
        const arrayWithJSON = [];
        const client = await pool.connect();
        const query_result = await client.query(QUERY_TO_SEARCH);
        for(let indx = 0; indx < query_result.rows.length; indx++){
            // response.json(
            arrayWithJSON.push(
                {
                    id: query_result.rows[indx].id,
                    name: query_result.rows[indx].name,
                    main_ingredient: query_result.rows[indx].main_ingredient,
                    cuisine: query_result.rows[indx].cuisine_type
                }
            );
        }
        client.release();
        res.json(arrayWithJSON);
    } catch(err){
        console.error(err);
        response.status(500).send("Error connecting to DB");
    }
});

application.post('/submit-data-form',async (request,response) => {
    try{
        const client = await pool.connect();
        const receivedFrom = request.body;
        const INSERT_QUERY = `
            INSERT INTO recipes (id,name,main_ingredient,cuisine_type) 
            VALUES ($1,$2,$3,$4);
        `;
        console.log(request.body);
        const values = [serial_value,`${receivedFrom.food_name}`, `${receivedFrom.main_ingr}`, `${receivedFrom.cuisine_type}`];
        await client.query(INSERT_QUERY, values);
        client.release();
        serial_value++;
        response.json({message: "Successfully Recieved... Refresh Screen"});
    } catch(err){
        console.error(err);
        response.status(500).send("Error connecting to DB");
    }
})

// Gracefully handle shutdown
process.on('SIGINT', async () => {
    console.log('Shutting down server...');
    
    // Close the pool and release all client connections
    await pool.end();
    console.log('Database connections closed from SIGINT...');
  
    process.exit(0); // Exit the process with a successful status code
});
  
process.on('SIGTERM', async () => {
    console.log('Shutting down server...');
    
    // Close the pool and release all client connections
    await pool.end();
    console.log('Database connections closed from SIGTERM...');
  
    process.exit(0); // Exit the process with a successful status code
});

application.listen(port_interface, () => {
    console.log(`Server is running on http://localhost:${port_interface}`);
});
