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

// 1. Configuración CORS mejorada
const corsOptions = {
  origin: [
    "https://evasdeleden.com",
    "https://www.evasdeleden.com",
    "http://localhost:5173",
    "https://evas-del-eden-frontend.vercel.app"
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  exposedHeaders: ['Content-Length', 'Content-Range', 'X-Request-ID'],
  maxAge: 86400,
  optionsSuccessStatus: 204
};

// 2. Aplicar middleware CORS de forma consistente
app.use(cors(corsOptions));

// 3. Configuración para archivos grandes
app.use(express.json({ 
  limit: '120mb',
  verify: (req, res, buf) => {
    req.rawBody = buf; // Guardar el buffer completo para posibles verificaciones
  }
}));

app.use(express.urlencoded({ 
  limit: '120mb', 
  extended: true,
  parameterLimit: 100000
}));

// 4. Middleware para manejar preflight OPTIONS explícitamente
app.options('*', cors(corsOptions));

// 5. Otros middlewares
app.use(morgan("dev"));
app.use(compression({
  level: 6,
  threshold: '10kb',
  filter: (req, res) => {
    if (req.headers['x-no-compression']) return false;
    return compression.filter(req, res);
  }
}));
app.use(cookieParser());

// 6. Middleware personalizado para verificar CORS en cada request
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (corsOptions.origin.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', 'true');
  }
  
  // Manejo especial para preflight
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', corsOptions.methods.join(','));
    res.header('Access-Control-Allow-Headers', corsOptions.allowedHeaders.join(','));
    return res.status(204).end();
  }
  
  next();
});

// 7. Rutas
app.use("/api/upload", uploadRoutes);
app.use("/api/evas", evasRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/send-email", emailRoutes);

// 8. Middleware de errores mejorado
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  // Manejo específico para errores de tamaño de archivo
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({
      success: false,
      message: 'El archivo excede el límite de tamaño (120MB máximo)'
    });
  }
  
  // Manejo de errores CORS
  if (err.name === 'CorsError') {
    return res.status(403).json({
      success: false,
      message: 'Acceso no permitido por política CORS'
    });
  }
  
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

export default app;