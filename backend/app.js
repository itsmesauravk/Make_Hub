const express = require('express');
const app = express();

const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const http = require('http');





// Middleware
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE','PATCH'],
    credentials: true,
    })
);

app.use(express.json());

app.use(cookieParser());



const userRoutes = require('./routes/user.routes');
const recipeRoutes = require('./routes/recipe.routes');
const botRoutes = require('./routes/bot.routes');

const authRoutes = require('./auth/authRoutes');
const { create } = require('./models/user.models');


app.use('/',authRoutes)
app.use('/api', userRoutes);
app.use('/api/recipe', recipeRoutes);
app.use('/api', botRoutes);





// healthcheck 
 app.get('/api/healthcheck', (req, res) => {
    res.send('I am alive');
    });


 



module.exports = app;