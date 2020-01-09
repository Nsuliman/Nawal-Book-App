DROP TABLE IF EXISTS books;

CREATE TABLE books
(
    id SERIAL PRIMARY KEY,
    image VARCHAR(255),
    title VARCHAR(255),
    author VARCHAR(255),
    des TEXT,
    isbn VARCHAR(255),
    bookshelf VARCHAR(255)
);

INSERT INTO books
    (image, title, author, des, isbn, bookshelf)
VALUES
    (
        'http://books.google.com/books/content?id=GCslDwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api',
        'Amman, a history with pictures',
        'Arslān Ramaḍān Bakig',
        'Amman, Jordan; history; pictorial work.',
        'OTHER',
        'Amman (Jordan)'
);
