import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import evasRoutes from "./routes/evas.routes.js";
import emailRoutes from "./routes/email.routes.js";
import uploadRoutes from "./routes/upload.routes.js";
import compression from "compression";

const app = express();

// Configuración mejorada de CORS
const corsOptions = {
  origin: [
    "http://localhost:5173",
    "https://evas-del-eden-frontend.vercel.app",
    "https://www.evasdeleden.com",
    "https://evasdeleden.com"
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  maxAge: 86400,
  preflightContinue: false,
  optionsSuccessStatus: 204
};

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors(corsOptions));

app.use(morgan("dev"));
app.use(compression());
app.use(cookieParser());

app.options('*', cors(corsOptions));

app.use("/api/upload", uploadRoutes);
app.use("/api/evas", evasRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/send-email", emailRoutes);

export default app;