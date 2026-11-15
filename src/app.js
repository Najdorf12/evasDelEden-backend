import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";
import compression from "compression";
import authRoutes from "./routes/auth.routes.js";
import evasRoutes from "./routes/evas.routes.js";
import emailRoutes from "./routes/email.routes.js";
import uploadRoutes from "./routes/upload.routes.js";
import modeloAuthRoutes from "./routes/modeloAuth.routes.js";
import evaModeloRoutes from "./routes/evaModelo.routes.js";
import commentRoutes from "./routes/comment.routes.js";

const app = express();

app.set("trust proxy", 1);

const corsOptions = {
  origin: [
    "http://localhost:5173",
    "https://evas-del-eden-frontend.vercel.app",
    "https://www.evasdeleden.com",
    "https://evasdeleden.com",
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
    "Origin",
  ],
  maxAge: 86400,
  optionsSuccessStatus: 204,
};

app.use(compression());
app.use(cors(corsOptions));

// Health check liviano (sin base de datos) para el warm-up y el ping
app.get("/health", (req, res) => res.status(200).send("ok"));

app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
app.use(cookieParser());

const bigJson = express.json({ limit: "120mb" });
app.use("/api/upload", bigJson, uploadRoutes);
app.use("/api/eva-modelo", bigJson, evaModeloRoutes);
app.use("/api/evas", bigJson, evasRoutes)    

// Resto de rutas: límite chico
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ limit: "2mb", extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/send-email", emailRoutes);
app.use("/api/modelo-auth", modeloAuthRoutes);
app.use("/api/comments", commentRoutes);

export default app;