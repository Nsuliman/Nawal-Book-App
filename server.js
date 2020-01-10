'use strict';

/******** dependencies *****/

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const superagent = require('superagent');
const pg = require('pg');
const methodOverride = require('method-override')
const expressLayouts = require('express-ejs-layouts')

const PORT = process.env.PORT || 3000;

const server = express();

server.use(cors());

// DataBase
const client = new pg.Client(process.env.DB_URL);
client.on('error', err => console.error(err));

server.use(express.json());
server.use(express.static('./public'));
server.use(express.urlencoded({ extended: true }));
server.set('view engine', 'ejs');
server.use(methodOverride(middleware));
// server.use(expressLayouts);


/******************************* Routes ***********************************/

// Proof Of Life 
server.get('/pol', (req, res) => {
    res.render('pages/pol');
});

// ERRORS  
server.get('/error', (request, response) => {
    response.render('pages/error');
});

// Rendering New Search
server.get('/new', (req, res) => {
    res.render('pages/serches/new');
});

//Restore Data From DataBase 
server.get('/', (req, res) => {
    let SQL = `SELECT * FROM books `
    // // console.log('SQL : ', SQL);
    client.query(SQL)
        .then(data => {
            res.render('pages/index', { books: data.rows })
            // res.render('pages/indexshow');
        })
});


// Shows the Results 
server.post('/searches', (req, res) => {
    let url = 'https://www.googleapis.com/books/v1/volumes?q=';
    // console.log('urllllllllllllllllllllllllllllll : ', url);

    if (req.body.searchtype === 'title') {
        url = url + req.body.search;
        // console.log(' Title url : \n\n\n\n\n\n ', url);   
    }
    else if (req.body.searchtype === 'author') {
        url = url + req.body.search;
        // console.log(' Author url : \n\n\n\n\n\n', url);   
    }

    superagent.get(url)
        .then(data => {
            // console.log('dataaaaaaaaaaaaaaaaaaaaaaaaaaaaa Boddddddddddddddy : ', data.body);
            // console.log('dataaaaaaaaaaaaaaaaaaaaaaaaaaaaa Itemmmmmmmmmmmmmmmms : ', data.body.items);
            let arr = data.body.items;
            let books = arr.map(book => {
                // console.log('book : ', book);
                return new Book(book);
            });
            // let listBooks = data.body.items;
            // console.log('books : \n\n\n\n\n', books);
            res.render('pages/books/show', { books: books })
        })
        .catch(error => {
            // console.log('Errorrrrrrrrrrrr : ', error);
            res.render('pages/error');
        });
});


// View Details
server.get('/books/:books_id', (req, res) => {
    let SQL = `SELECT * FROM books WHERE id=$1`
    // // console.log('SQL : ', SQL);
    let values = [req.params.books_id]
    // console.log('req.params.books_id : ', req.params.books_id);

    client.query(SQL, values)
        .then(results => {
            res.render('pages/books/detail', { books: results.rows })
        });
});

// Add Book To DataBase 
server.post('/add', (req, res) => {
    // console.log('req.body : ', req.body);

    res.render('pages/serches/add', { books: req.body });
});

// Save Book Details into DataBase then redirect me to the homePage with All saved books in DB 
server.post('/books', (req, res) => {
    // console.log('req.body : ', req.body);
    let { image, title, author, des, isbn, bookshelf } = req.body

    let SQL = `INSERT INTO books (image, title, author, des, isbn, bookshelf) VALUES ($1, $2, $3, $4, $5, $6)`
    // // console.log('SQL : ', SQL);
    let values = [image, title, author, des, isbn, bookshelf]
    // console.log('values : ', values);

    client.query(SQL, values)
        .then(() => {
            res.redirect('/')
        })
});

// Update book details by clicking and show up the form to be able to update 
server.post('/update', (req, res) => {
    // console.log('req.body : ', req.body);
    res.render('pages/books/edit', { books: req.body });
})

// After finished update save the updated details into DB then redirect me to Homepage 
server.put('/update/:books_id', (req, res) => {

    let { image, title, author, des, isbn, bookshelf } = req.body;
    // // console.log('req.body : ', req.body);

    let SQL = `UPDATE books SET image=$1, title=$2, author=$3, des=$4, isbn=$5, bookshelf=$6 WHERE id=$7`
    // console.log('SQL : ', SQL);

    let values = [image, title, author, des, isbn, bookshelf, req.params.books_id];
    // console.log('values : ', values);
    
    client.query(SQL, values)
        .then(() => {
            res.redirect('/')
        })
});

// Delete Book 
server.delete('/delete/:books_id', (req,res) =>
{
    let SQL = `DELETE FROM books WHERE id=$1`
    // // console.log('SQL : ', SQL);
    let values = [req.params.books_id]
    // // console.log('values : ', values);

    client.query(SQL, values)
        .then(() => {
            res.redirect('/')
        })
});

// If you want to use Constructor function you must use the keys names inside the ejs file
// Otherwise just pass the data inside the object of the render line {anyname: data Path} , "anyname" use same name in the EJS file for foreach
function Book(data) {

    //The PIPE used if there's an empty data , to avoid error 
    this.author = (data.volumeInfo.authors && data.volumeInfo.authors[0]) || ' Unknown Authors';
    this.title = data.volumeInfo.title;
    this.isbn = (data.volumeInfo.industryIdentifiers && data.volumeInfo.industryIdentifiers[0].identifier) || ' No ISBN Found';
    this.image = (data.volumeInfo.imageLinks && data.volumeInfo.imageLinks.thumbnail) || ' No Image Found ';
    this.des = (data.volumeInfo.description && data.volumeInfo) || ' No Description Found ';
} // End of location constructor function 

// For update and Delete , build-in function as it is .
function middleware(req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        let method = req.body._method;
        delete req.body._method;
        return method;
    }
} // end of middleware function 

/******************************* Server Listening  ***********************************/
client.connect()
    .then(() => {
        server.listen(PORT, () => console.log('New Book App , listening On port # : ', PORT));
    });
