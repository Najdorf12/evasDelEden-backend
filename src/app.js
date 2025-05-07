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
const allowedOrigins = [
  "http://localhost:5173",
  "https://evas-del-eden-frontend.vercel.app",
  "https://www.evasdeleden.com",
  "https://evasdeleden.com"
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  maxAge: 86400,
  optionsSuccessStatus: 204
};

// Middleware para aumentar límites
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));

// Configuración especial para preflight OPTIONS
app.options('*', cors(corsOptions));

// Middleware CORS principal
app.use(cors(corsOptions));

// Otros middlewares
app.use(morgan("dev"));
app.use(compression());
app.use(cookieParser());

// Rutas
app.use("/api/upload", uploadRoutes);
app.use("/api/evas", evasRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/send-email", emailRoutes);

// Manejo de errores CORS
app.use((err, req, res, next) => {
  if (err.name === 'CorsError') {
    return res.status(403).json({ 
      success: false,
      message: 'Not allowed by CORS policy'
    });
  }
  next(err);
});

export default app;