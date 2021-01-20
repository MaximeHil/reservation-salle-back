const express = require('express');
const path = require("path");
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const roomsRoute = require("./routes/rooms");
const dotenv = require('dotenv').config()

mongoose.connect(process.env.MONGODB_URI,
    { useNewUrlParser: true,
        useUnifiedTopology: true })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));


app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(bodyParser.json());

app.use('/rooms', roomsRoute);


module.exports = app;
