
// import bootstrap dependencies
import { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Navbar from 'react-bootstrap/Navbar';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function App() {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedBook, setSelectedBook] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    const params = new URLSearchParams({ search, filter });
    fetch(`${API_URL}/api/books?${params}`, { signal: controller.signal })
      .then(response => {
        if (!response.ok) throw new Error('Could not load books');
        return response.json();
      })
      .then(data => { setBooks(data); setError(''); })
      .catch(err => { if (err.name !== 'AbortError') setError(err.message); });
    return () => controller.abort();
  }, [search, filter]);

  async function showBook(id) {
    try {
      const response = await fetch(`${API_URL}/api/books/${id}`);
      if (!response.ok) throw new Error('Could not load book details');
      setSelectedBook(await response.json());
      setError('');
    } catch (err) { setError(err.message); }
  }

  return (
    <div className="App">
      <Navbar expand="lg" className="justify-content-between">
        <Container><h3>Online Bookstore</h3></Container>
      </Navbar>
      <Container>
        <Row>
          <Col lg="9">
            <Form onSubmit={event => event.preventDefault()}>
              <InputGroup className="my-3">
                <Form.Control aria-label="Search books" placeholder="Enter a title, genre, or author..."
                  value={search} onChange={event => setSearch(event.target.value)} />
              </InputGroup>
            </Form>
          </Col>
          <Col lg="auto" className="pt-3">
            <DropdownButton id="filter" title={`Search by: ${filter}`}>
              {['all', 'title', 'author', 'genre'].map(option => (
                <Dropdown.Item key={option} onClick={() => setFilter(option)}>{option}</Dropdown.Item>
              ))}
            </DropdownButton>
          </Col>
        </Row>
        {error && <p role="alert">{error}. Make sure the backend is running.</p>}
        {!error && books.length === 0 && <p>No books found.</p>}
        <Row className="mt-3">
          {books.map(book => (
            <Col lg="3" md="6" key={book.id}>
              <Card className="mb-4"><Card.Body>
                <h4 className="mb-4 title">{book.title}</h4>
                <p>Author: {book.author}<br />Genre: {book.genre}</p>
                <p>${Number(book.price).toFixed(2)} | Rating: {book.average_rating ?? 'Not rated'}</p>
                <Button onClick={() => showBook(book.id)}>Find out more!</Button>
              </Card.Body></Card>
            </Col>
          ))}
        </Row>
        {selectedBook && (
          <Card className="mb-4"><Card.Body>
            <Button className="float-end" onClick={() => setSelectedBook(null)}>Close</Button>
            <h4>{selectedBook.title}</h4>
            <p>{selectedBook.description}</p>
            <h5>Reviews</h5>
            {selectedBook.reviews.length === 0 ? <p>No reviews yet.</p> :
              selectedBook.reviews.map(review => (
                <p key={review.id}><strong>{review.reviewer} ({review.rating}/5):</strong> {review.comment}</p>
              ))}
          </Card.Body></Card>
        )}
      </Container>
    </div>
  );
}
export default App;
