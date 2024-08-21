import app from "./src/app.js";
 import { connectDB } from "./src/db.js"; 
import dotenv from 'dotenv';

dotenv.config({ path: './src/.env' });

 connectDB(); 

const port =  process.env.PORT ||  8080;
app.listen(port);

console.log("Server on port", port);