import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import evasRoutes from "./routes/evas.routes.js";

const app = express();
app.use(cors({/*  http://localhost:5173 https://evas-del-eden-frontend.vercel.app  https://www.grupolacomunidad.com.ar */
    origin:"https://evas-del-eden-frontend.vercel.app",
    credentials: true,
}));

app.use(morgan("dev"));
app.use(express.json());

app.use(cookieParser()); 

app.use("/api/evas", evasRoutes );
app.use("/api/auth", authRoutes);



export default app;