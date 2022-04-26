let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let mysql = require('mysql');
const { ignore } = require('nodemon/lib/rules');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  return res.send({
    error: false,
    message: 'welcome to node js api crud',
    written_by: 'yo',
    published_on: 'www.yoshics6.com'
  });
});

// connect db
let dbCon = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  pass: '',
  database: 'nodejs_api'
});

dbCon.connect();

// retrieve all books
app.get('/books', (req, res) => {
  dbCon.query("select * from books", (error, results, fields) => {
    if (error) throw error;
    let message = '';
    if (results === undefined || results.length === 0) {
      message = 'empty';
    } else {
      message = 'success';
    }
    return res.send({ error: false, data: results, message: message });
  });
});

// add a new book
app.post('/book', (req, res) => {
  let name = req.body.name;
  let author = req.body.author;

  if (!name || !author) {
    return res.status(400).send({ error: true, message: 'กรุณาใส่หนังสือ' });
  }
  else {
    dbCon.query('insert into books (name , author) values(?,?)', [name, author], (error, results, fields) => {
      if (error) throw error;
      return res.send({ error: false, data: results, message: 'Book successful added' });
    });
  }
});

// retrieve book by id
app.get('/book/:id', (req, res) => {
  let id = req.params.id;
  if (!id) {
    return res.status(400).send({ error: true, message: 'ใส่ค่ามาด้วย' });
  } else {
    dbCon.query("select * from books where id = ?", id, (error, results, fields) => {
      if (error) throw error;
      let message = '';
      if (results === undefined || results.length == 0) {
        message = 'books not found';
      } else {
        message = 'successful';
      }
      return res.send({ error: false, data: results[0], message: message });
    });
  }
});

// update book with id
app.put('/book', (req, res) => {
  let id = req.body.id;
  let name = req.body.name;
  let author = req.body.author;

  // validation
  if (!id || !name || !author) {
    return res.status(400).send({ error: true, message: 'กรุณาเลือกการแก้ไขข้อมูล' });
  } else {
    dbCon.query("update books set name = ? , author = ? where id = ?", [name, author, id], (error, results, fields) => {
      if (error) throw error;
      let message = '';
      if (results.changedRow === 0) {
        message = 'Book not found';
      } else {
        message = 'Book successfully updated';
      }

      return res.send({ error: false, data: results, message: message });
    });
  }
});

// delete book
app.delete('/book', (req, res) => {
  let id = req.body.id;
  if (!id) {
    return res.status(400).send({ error: true, message: 'เลือกข้อมูลที่จะลบสิ' });
  }
  else {
    dbCon.query("delete from books where id = ?", [id], (error, results, fields) => {
      if (error) throw error;
      let message = '';
      if (results.affectedRows === 0) {
        message = 'book not found';
      } else {
        message = 'delete successfully';
      }

      return res.send({ error: false, data: results, message: message });

    });
  }
});

app.listen(3000, () => {
  console.log('node run on port 3000')
});

module.exports = app;