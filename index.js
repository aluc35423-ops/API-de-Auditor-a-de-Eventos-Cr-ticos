require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/database');

//RUTAS
const auditoriaRoutes = require('./src/routes/auditoriaRoutes');

//SWAGGER
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./src/config/swagger');


//SWAGGER
const app = express();
const PORT = process.env.PORT || 5100;

app.use(cors());
app.use(express.json()); // Communication

// DB connection
connectDB();

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

//Rutas base de RUGP
app.use("/api/auditoria", auditoriaRoutes);

app.listen(PORT, () => {
    console.log(`Servidor de API-AEC corriendo en: http://localhost:${PORT}`);
    console.log(`Revisa la documentación en: http://localhost:${PORT}/api-docs`);
});