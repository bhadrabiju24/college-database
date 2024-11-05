const express = require('express');
const mysql = require('mysql');
const path = require('path');
const app = express();

// Create a connection to the MySQL database
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'CCD'
});

// Connect to the database
connection.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL database');
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'searchFilter.html'));
});

app.use(express.static('DBMS PROJECT'));

// Route to handle search filter request
app.get('/search', (req, res) => {
    const student_id = req.query.student_id;

    // SQL query to search for student by student_id
    let sql = 'SELECT s.student_id, s.student_name, s.year, s.age, s.address, ' +
        'c.course_id, c.course_name, c.course_duration, ' +
        'i.instructor_id, i.instructor_name, ' +
        'd.department_id, d.department_name ' +
        'FROM student s ' +
        'JOIN courses c ON s.course_id = c.course_id ' +
        'JOIN instructor i ON c.instructor_id = i.instructor_id ' +
        'JOIN department d ON c.department_id = d.department_id ' +
        'WHERE 1 = 1 ';

    if (student_id) {
        sql += `AND s.student_id = ${mysql.escape(student_id)} `; // Prevent SQL injection
    }

    // Execute the SQL query
    connection.query(sql, (err, result) => {
        if (err) throw err;
        res.json(result);
    });
});

// Start the server
app.listen(4000, () => {
    console.log('Server started on port 4000');
});
