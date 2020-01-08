'use strict';

/******** dependencies *****/

require('dotenv').config();

const express = require('express');

const cors = require('cors');

const superagent = require('superagent');

const PORT = process.env.PORT || 3000;

const server = express();

server.use(cors());

server.use(express.json());
server.use(express.static('./public'));
server.use(express.urlencoded({ extended: true }));
server.set('view engine', 'ejs');

/******************************* Routes ***********************************/

// RProof Of Life 
server.get('/pol', (req, res) => {
    res.render('pages/pol');
});

// Rendering index.ejs 
server.get('/', (req, res) => {
    res.render('pages/index');
});



/******************************* Server Listening  ***********************************/
server.listen(PORT, () => console.log('New Book App , listening On port # : ', PORT));
