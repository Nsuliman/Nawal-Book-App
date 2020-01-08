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

// Proof Of Life 
server.get('/pol', (req, res) => {
    res.render('pages/pol');
});

// ERRORS  
server.get('/error', (request, response) => {
    response.render('pages/error');
});

// Rendering index.ejs 
server.get('/', (req, res) => {
    res.render('pages/index');
});

// Shows the Results 

server.post('/searches', (req, res) => {
    let url = 'https://www.googleapis.com/books/v1/volumes?q=';
    // console.log('urllllllllllllllllllllllllllllll : ', url);

    if (req.body.searchtype === 'title') {
        url = url + req.body.search;
    }
    else if (req.body.searchtype === 'author') {
        url = url + req.body.search;
        // console.log(url)
    }

    superagent.get(url)
        .then(data => {
            // console.log('dataaaaaaaaaaaaaaaaaaaaaaaaaaaaa Boddddddddddddddy : ', data.body);
            // console.log('dataaaaaaaaaaaaaaaaaaaaaaaaaaaaa Itemmmmmmmmmmmmmmmms : ', data.body.items);
            let arr = data.body.items;
            let books = arr.map(book =>
                {   
                    // console.log('book : ', book);
                    return new Book(book);
                });
            // let listBooks = data.body.items;
            console.log('books : \n\n\n\n\n', books);
            res.render('pages/serches/show', {books: books})
        })
        .catch(error => {
            // console.log('Errorrrrrrrrrrrr : ', error);
            res.render('pages/error');
        });
});


// If you want to use Constructor function you must use the keys names inside the ejs file
// Otherwise just pass the data inside the object of the render line {anyname: data Path} , "anyname" use same name in the EJS file for foreach
function Book(data) {

    //The PIPE used if there's an empty data , to avoid error 
    this.author = (data.volumeInfo.authors && data.volumeInfo.authors[0]) || ' Unknown Authors';
    this.title = data.volumeInfo.title;
    this.isbn = (data.volumeInfo.industryIdentifiers && data.volumeInfo.industryIdentifiers[0].identifier) || ' No ISBN Found';
    this.image = (data.volumeInfo.imageLinks && data.volumeInfo.imageLinks.thumbnail) || ' No Image Found ';
    this.des = data.volumeInfo.description;
} // End of location constructor function 



/******************************* Server Listening  ***********************************/
server.listen(PORT, () => console.log('New Book App , listening On port # : ', PORT));
