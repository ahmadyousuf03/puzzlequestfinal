const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware for parsing JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
const apiRouter = require('./routes/api');
app.use('/api', apiRouter);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

