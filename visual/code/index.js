var express = require('express');
var app = express();
var mysql = require('mysql');

var database = {
    host: 'localhost',
    user: 'root',
    password: '0712',
    database: 'project'
};

app.use(express.static('public'));

app.get('/adm_dongs', function(req, res) {
    var connection = mysql.createConnection(database);
    connection.connect();
    connection.query("SELECT * FROM `adm_dongs` WHERE `code` LIKE '11%'", function(error, results, fields) {
        res.json(results);
    });
    connection.end();
});

app.get('/adm_dongs/:code', function(req, res) {
    var connection = mysql.createConnection(database);
    connection.connect();
    connection.query('SELECT * FROM `adm_dongs` WHERE `code`=?', [req.params['code']],
        function(error, results, fields) {
            res.json(results[0]);
        });
    connection.end();
});

app.get('/borders/:code', function(req, res) {
    var connection = mysql.createConnection(database);
    connection.connect();
    connection.query('SELECT `latitude`, `longtitude` FROM `adm_dong_borders` WHERE `code`=?', [req.params['code']],
        function(error, results, fields) {
            res.json(results);
        });
    connection.end();
});

app.get('/scores/life_populations', function(req, res) {
    var connection = mysql.createConnection(database);
    connection.connect();
    connection.query('SELECT * FROM `life_pop_scores` ORDER BY score DESC',
        function(error, results, fields) {
            res.json(results);
        });
    connection.end();
});

app.get('/scores/hotels', function(req, res) {
    var connection = mysql.createConnection(database);
    connection.connect();
    connection.query('SELECT * FROM `hotel_scores` ORDER BY score DESC LIMIT 0, 10',
        function(error, results, fields) {
            res.json(results);
        });
    connection.end();
});

app.listen(50077, function() {
    console.log('Visualizer listening on port 50077.');
});
