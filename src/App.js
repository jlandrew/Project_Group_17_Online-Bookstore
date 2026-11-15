
// import bootstrap dependencies
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Navbar from "react-bootstrap/Navbar";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from 'react-bootstrap/DropdownButton';


import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// create basic layout
function App() {
  return (
    <div className="App">
      <Navbar expand="lg" className="justify-content-between">
        <Container>
          <h3>Online Bookstore</h3>
        </Container>
      </Navbar>

      <Container>
        <Row>
          <Col lg="9">
            <Form>
              <InputGroup className="my-3">
                <Form.Control placeholder="Enter a title, genre, or author..." />
              </InputGroup>
            </Form>
          </Col>
          <Col lg="auto" className="pt-3">
            <DropdownButton id="filter" title="Search by...">
              <Dropdown.Item>Title</Dropdown.Item>
              <Dropdown.Item>Author</Dropdown.Item>
              <Dropdown.Item>Genre</Dropdown.Item>
            </DropdownButton>
          </Col>
        </Row>

        <Row className="mt-3">
          <Col lg="3">
            <Card className="mb-4">
              <Card.Body>
                <h4 className="mb-4 title">Example Book Title</h4>
                <p>Author: Example Author
                  <br></br>
                  Genre: Example Genre</p>
                <Button className="me-2">Find out more!</Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default App;
