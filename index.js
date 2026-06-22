const express = require('express');

const app = express();

const PORT = process.env.PORT || 5100;

app.listen(PORT, () => {
    console.log(`Hello World: http://localhost:${PORT}`);
});