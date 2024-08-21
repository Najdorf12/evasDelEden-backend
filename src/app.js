import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";
/* import fileUpload from "express-fileupload"; */

/* import authRoutes from "./routes/auth.routes.js";
import usdPriceRoutes from "./routes/usdPrice.routes.js"; */
import evasRoutes from "./routes/evas.routes.js";

const app = express();
app.use(cors({/*  http://localhost:5173  https://www.grupolacomunidad.com.ar*/
    origin:"http://localhost:5173",
    credentials: true,
}));

app.use(morgan("dev"));
app.use(express.json());

/* app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : './uploads'
}));
 */
app.use(cookieParser()); 

app.use("/api/evas", evasRoutes );
/* app.use("/api/auth", authRoutes);

app.use("/api/usdprice", usdPriceRoutes); */


export default app;