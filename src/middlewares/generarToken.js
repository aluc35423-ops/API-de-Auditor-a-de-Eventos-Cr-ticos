require('dotenv').config();
const jwt = require('jsonwebtoken');

const appToken = jwt.sign(
    { app: 'API-AEC', role: 'admin' }, 
    process.env.JWT_SECRET, 
    { expiresIn: '100y' }
);
console.log("----- TU APP TOKEN ES: -----");
console.log(appToken);
console.log("----------------------------");