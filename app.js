require('dotenv').config();
const express=require('express')
const logger=require('./middlewares/logger')
const app = express();

const PORT = 3000;
const pool = require('./config/db');
const usuarioRoutes=require('./routes/usuarios.routes');
const libroRoutes=require('./routes/libro.routes');
const prestamoRoutes=require('./routes/prestamo.routes');
const authRoutes=require('./routes/auth.routes');

// Middleware para leer JSON
app.use(express.json());
app.use(logger.logger);

app.use('/usuarios',usuarioRoutes);
app.use('/libros',libroRoutes);
app.use('/prestamos',prestamoRoutes);
app.use('/auth',authRoutes);
app.listen(PORT, () => {
console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
