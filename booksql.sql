DROP TABLE IF EXISTS books;

CREATE TABLE books
(
    id SERIAL PRIMARY KEY,
    image_url VARCHAR(255),
    title VARCHAR(255),
    author VARCHAR(255),
    description TEXT,
    isbn VARCHAR(255),
    bookshelf VARCHAR(255)
);

INSERT INTO books
    (image_url, title, author, description, isbn, bookshelf)
VALUES
    (
        'http://books.google.com/books/content?id=zEOKHTpdp3kC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api',
        'Chemical Thermodynamics',
        'Byung Chan Eu',
        'Thermodynamics is an ever evolving subject. This book aims to introduce to advanced undergraduate students and graduate students the fundamental ideas and notions of the first and second laws of thermodynamics in a manner unavailable in the usual textbooks on the subject of thermodynamics. For example, it treats the notions of unavailable work, compensated and uncompensated heats, and dissipation, which make it possible to formulate the thermodynamic laws in more broadened forms than those in the conventional treatment of equilibrium thermodynamics. It thus strives to prepare students for more advanced subjects of irreversible processes, which are encountered in our everyday scientific activities. In addition, it also aims to provide them with functional and practical knowledge of equilibrium chemical thermodynamics of reversible processes in real fluids. It discusses temperature, work and heat, thermodynamic laws, equilibrium conditions and thermodynamic stability, thermodynamics of reversible processes in gases and liquids, in surfaces, chemical equilibria, reversible processes in electrolyte solutions and dielectrics in static electric and magnetic fields. A couple of examples for irreversible processes associated with fluid flows and chemical pattern formation and wave propagations are discussed as examples for applications of broader treatments of the thermodynamic laws in the realm of irreversible phenomena.',
        'ISBN_13 9789814295116',
        'mechanical engineering'
);