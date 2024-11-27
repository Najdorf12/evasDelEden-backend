import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import evasRoutes from "./routes/evas.routes.js";
import emailRoutes from "./routes/email.routes.js"; 

const app = express();
app.use(cors({/* http://localhost:5173 https://evas-del-eden-frontend.vercel.app */
    origin:"https://www.evasdeleden.com",
    credentials: true,
}));

app.use(morgan("dev"));
app.use(express.json());

app.use(cookieParser()); 

app.use("/api/evas", evasRoutes );
app.use("/api/auth", authRoutes);
app.use("/api/email", emailRoutes); 


export default app;