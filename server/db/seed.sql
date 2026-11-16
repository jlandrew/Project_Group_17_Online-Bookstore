-- Safe to run multiple times for these sample records.
INSERT INTO users (id, name, email) VALUES
    (1, 'Alex Rivera', 'alex@example.com'),
    (2, 'Jordan Lee', 'jordan@example.com'),
    (3, 'Taylor Morgan', 'taylor@example.com')
ON CONFLICT (id) DO NOTHING;

INSERT INTO books (id, title, author, genre, description, price) VALUES
    (1, 'Pride and Prejudice', 'Jane Austen', 'Romance', 'A classic novel about family, class, and relationships.', 12.99),
    (2, 'Frankenstein', 'Mary Shelley', 'Science Fiction', 'A scientist confronts the consequences of his creation.', 10.50),
    (3, 'The Adventures of Sherlock Holmes', 'Arthur Conan Doyle', 'Mystery', 'A collection of detective stories.', 14.25),
    (4, 'The Time Machine', 'H. G. Wells', 'Science Fiction', 'A traveler explores the distant future.', 9.99)
ON CONFLICT (id) DO NOTHING;

INSERT INTO reviews (id, user_id, book_id, rating, comment) VALUES
    (1, 1, 1, 5, 'Great characters and story.'),
    (2, 2, 2, 4, 'A thoughtful and interesting book.'),
    (3, 3, 3, 5, 'Excellent mysteries.'),
    (4, 1, 2, 4, 'A memorable classic.')
ON CONFLICT (id) DO NOTHING;

SELECT setval(pg_get_serial_sequence('users', 'id'), (SELECT MAX(id) FROM users));
SELECT setval(pg_get_serial_sequence('books', 'id'), (SELECT MAX(id) FROM books));
SELECT setval(pg_get_serial_sequence('reviews', 'id'), (SELECT MAX(id) FROM reviews));
