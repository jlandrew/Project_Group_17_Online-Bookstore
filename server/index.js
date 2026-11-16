require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pool = require('./db');

const app = express();
const PORT = Number(process.env.PORT || 5000);
app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:3000' }));
app.use(express.json());

const handleError = (res, error) => {
  console.error('Database request failed:', error);
  return res.status(500).json({ error: 'Database request failed' });
};

app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok', database: 'connected' });
  } catch (error) {
    handleError(res, error);
  }
});

app.get('/api/books', async (req, res) => {
  const { search = '', filter = 'all' } = req.query;
  if (typeof search !== 'string' || typeof filter !== 'string') {
    return res.status(400).json({ error: 'Invalid search parameters' });
  }
  const fields = { title: 'b.title', author: 'b.author', genre: 'b.genre' };
  if (!['all', ...Object.keys(fields)].includes(filter)) {
    return res.status(400).json({ error: 'Filter must be all, title, author, or genre' });
  }

  const condition = filter === 'all'
    ? '(b.title ILIKE $1 OR b.author ILIKE $1 OR b.genre ILIKE $1)'
    : `${fields[filter]} ILIKE $1`;
  try {
    const result = await pool.query(`
      SELECT b.id, b.title, b.author, b.genre, b.description, b.price,
             ROUND(AVG(r.rating)::numeric, 1) AS average_rating,
             COUNT(r.id)::integer AS review_count
      FROM books b
      LEFT JOIN reviews r ON r.book_id = b.id
      WHERE ${condition}
      GROUP BY b.id
      ORDER BY b.title
    `, [`%${search}%`]);
    res.json(result.rows);
  } catch (error) {
    handleError(res, error);
  }
});

app.get('/api/books/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isSafeInteger(id) || id < 1) return res.status(400).json({ error: 'Invalid book ID' });
  try {
    const book = await pool.query('SELECT * FROM books WHERE id = $1', [id]);
    if (!book.rowCount) return res.status(404).json({ error: 'Book not found' });
    const reviews = await pool.query(`
      SELECT r.id, r.rating, r.comment, r.created_at, u.id AS user_id, u.name AS reviewer
      FROM reviews r JOIN users u ON u.id = r.user_id
      WHERE r.book_id = $1 ORDER BY r.created_at DESC
    `, [id]);
    res.json({ ...book.rows[0], reviews: reviews.rows });
  } catch (error) {
    handleError(res, error);
  }
});

app.get('/api/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, name, email, created_at FROM users ORDER BY id');
    res.json(result.rows);
  } catch (error) {
    handleError(res, error);
  }
});

app.get('/api/reviews', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT r.id, r.user_id, u.name AS reviewer, r.book_id, b.title AS book_title,
             r.rating, r.comment, r.created_at
      FROM reviews r JOIN users u ON u.id = r.user_id
      JOIN books b ON b.id = r.book_id ORDER BY r.id
    `);
    res.json(result.rows);
  } catch (error) {
    handleError(res, error);
  }
});

app.listen(PORT, () => console.log(`Bookstore API running at http://localhost:${PORT}`));
