require('dotenv').config();
const express = require('express');
const connectDB = require('./src/config/database');

//SWAGGER
const app = express();
const PORT = process.env.PORT || 5100;

app.use(express.json()); // Communication

// DB connection
connectDB();

app.listen(PORT, () => {
    console.log(`Servidor de API-AEC corriendo en: http://localhost:${PORT}`);
});