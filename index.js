//import express, { query } from 'express';
import express from 'express';
import cors from 'cors';
import pg from 'pg';
//import {RecipePage} from './src/RecipePage';

//let serial_value = 16;
const QUERY_TO_SEARCH = 'SELECT id,name,main_ingredient,cuisine_type FROM recipes ORDER BY id DESC;';

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


application.get('/recipe_id=:id', async(req,res) => {
    const recipe_req = [];
    const Recipe_To_Find = `
        SELECT name,main_ingredient,main_instructions, cuisine_type FROM recipes 
        WHERE id = ${req.params.id}`;
    const client = await pool.connect();
    const query_result = await client.query(Recipe_To_Find);
    for(let indx = 0; indx < query_result.rows.length; indx++){
        // response.json(
        recipe_req.push(
            {
                id: query_result.rows[indx].id,
                name: query_result.rows[indx].name,
                main_ingredient: query_result.rows[indx].main_ingredient,
                main_instructions: query_result.rows[indx].main_instructions,
                cuisine: query_result.rows[indx].cuisine_type
            }
        );
    }
    client.release();
    res.json(recipe_req);
});

// application.get('/recipe_id=:id', async(req,res) => {
//     const Recipe_To_Find = `
//         SELECT name,main_ingredient,cuisine_type FROM recipes 
//         WHERE id = ${req.params.id}`;
//     const client = await pool.connect();
//     const query_result = await client.query(Recipe_To_Find);
//     client.release();
//     let ingredients = '';
//     ingredients = `<ul>`;
//     for(let i = 0; i < query_result.rows[0].main_ingredient.length;i++){
//         const ListItem = '<li>';
//         const CloseListItem = '</li>'
//         let word = '';
//         for(let j = i; j < query_result.rows[0].main_ingredient.length;j++){
//             if(query_result.rows[0].main_ingredient[j] != ","){
//                 word = `${word}${query_result.rows[0].main_ingredient[j]}`;
//                 i++;
//             }
//             else
//                 break;
//         }
//         ingredients = `${ingredients}${ListItem}${word}${CloseListItem}`;
//         word = '';
//     }
//     ingredients = `${ingredients}</ul>`;
//     console.log(query_result.rows[0].main_ingredient);
//     res.send(`
//         <h1>${query_result.rows[0].name}</h1>
//         <p>${ingredients}</p>
//         `);
// });

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
                    main_instructions: query_result.rows[indx].main_instructions,
                    cuisine: query_result.rows[indx].cuisine_type
                }
            );
        }
        client.release();
        res.json(arrayWithJSON);
    } catch(err){
        console.error(err);
        res.status(500).send("Error connecting to DB");
    }
});

application.post('/login-form', async (req,res) => {
    try{
        const client = await pool.connect();
        const credsToVerify = req.body;
        console.log(credsToVerify);
        const QUERY_USER_CREDS = `
            SELECT user_token 
            FROM user_accounts 
            WHERE user_email = '${credsToVerify.email}' AND user_pass = '${credsToVerify.pass}';
        `;
        const answerFromDB = await client.query(QUERY_USER_CREDS);
        client.release();
        if(answerFromDB.rows[0] != null)
            res.json({message: "true"});
        else
            res.json({message: "false"});
    } catch(err){
        console.error(err);
        res.status(500).send("Error collecting login verification-number");
    }
});

application.post('/submit-data-form',async (request,response) => {
    try{
        const client = await pool.connect();
        const receivedFrom = request.body;
        const INSERT_QUERY = `
            INSERT INTO recipes (name,main_ingredient,main_instructions, cuisine_type) 
            VALUES ($1,$2,$3,$4);
        `;
        console.log(request.body);
        const values = [`${receivedFrom.food_name}`, `${receivedFrom.main_ingr}`, `${receivedFrom.main_instr}`,`${receivedFrom.cuisine_type}`];
        await client.query(INSERT_QUERY, values);
        client.release();
        //serial_value++;
        response.json({message: "Successfully Recieved... Refresh Screen"});
    } catch(err){
        console.error(err);
        response.status(500).send("Error connecting to DB");
    }
});

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
