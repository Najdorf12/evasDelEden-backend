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

// Configuración ampliada de CORS
const corsOptions = {
  origin:[
    "http://localhost:5173", 
    "https://evas-del-eden-frontend.vercel.app",
    "https://www.evasdeleden.com",
    "https://evasdeleden.com"
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  exposedHeaders: ['Content-Length', 'X-Foo', 'X-Bar'],
  maxAge: 86400,
  preflightContinue: false,
  optionsSuccessStatus: 204
};

// Aumentar límites para requests con payloads grandes
app.use(express.json({ limit: '120mb' }));
app.use(express.urlencoded({ limit: '120mb', extended: true }));

// Middleware CORS mejorado
app.use((req, res, next) => {
  const allowedOrigins = [
    "https://evasdeleden.com",
    "https://www.evasdeleden.com",
    "http://localhost:5173"
  ];
  
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  }
  
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  
  next();
});

app.use(morgan("dev"));
app.use(compression());
app.use(cookieParser());

// Rutas
app.use("/api/upload", uploadRoutes);
app.use("/api/evas", evasRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/send-email", emailRoutes);

export default app;