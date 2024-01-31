// Requiring module
const express = require('express');
var mysql = require('mysql2');
var bodyParser = require('body-parser');


 
// Creating express object
const app = express();
const path = require('path');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // Legg til støtte for JSON-parser

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "ali1212",
    database: "camping"
});

// Endpoint for å hente data basert på primærnøkkel
app.post('/fetch', function(req, res) {
    con.connect(function(err) {
        if (err) throw err;
        console.log("Connected!");

        var pk = req.body.pk;

        var sql = "SELECT * FROM utleietjeneste WHERE utleietjenestenr = ?";
        con.query(sql, [pk], function (err, result) {
            if (err) throw err;

            if (result.length > 0) {
                console.log("Record found");
                res.json(result[0]);  // Send the first (and only) record as JSON
            } else {
                console.log("Record not found");
                res.send('Record not found!');
            }
        });
    });
});
app.get('/heleTabell', function(req, res) {
    con.connect(function(err) {
        if (err) throw err;
        console.log("Connected!");

        var sql = "SELECT * FROM utleietjeneste";
        con.query(sql, function (err, result) {
            if (err) throw err;

            if (result.length > 0) {
                console.log("Records found");
                res.json(result);  // Send all records as JSON
            } else {
                console.log("No records found");
                res.send('No records found!');
            }
        });
    });
});
app.post('/sletteEnRad', function(req, res) {
    con.connect(function(err) {
        if (err) throw err;
        console.log("Connected!");

        var pk = req.body.pk;

        var sql = "DELETE FROM utleietjeneste WHERE utleietjenestenr = ?";
        con.query(sql, [pk], function (err, result) {
            if (err) throw err;

            if (result.affectedRows > 0) {
                console.log("1 record deleted");
                res.send('Record deleted successfully!');
            } else {
                console.log("Record not found");
                res.send('Record not found!');
            }
        });
    });
});

app.post('/submit', function(req, res) {
    con.connect(function(err) {
        if (err) throw err;
        console.log("Connected!");

        var utleietjenestenr = req.body.UtleietjenesteNr; // Corrected field name
        var tjenestenavn = req.body.Tjenestenavn;
        var dagertilgj = req.body.DagerTilgj;
        var tilgjtid = req.body.TilgjTid;
        var pris = req.body.Pris;

        var sql = "INSERT INTO utleietjeneste (utleietjenestenr, tjenestenavn, dagertilgj, tilgjtid, pris) VALUES (?, ?, ?, ?, ?)";
        con.query(sql, [utleietjenestenr, tjenestenavn, dagertilgj, tilgjtid, pris], function (err, result) {
            if (err) throw err;
            console.log("1 record inserted");
        });

        res.send('Form submitted successfully!');
    });
});

 
// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'camping')));

// Handling GET request
app.get('/', (req, res) => { 
    res.sendFile(path.join(__dirname, 'camping')); 
    //res.sendFile(__dirname + '/script.js');
    //res.end() 
});

/*app.get('/', (req, res) => { 
    res.sendFile(__dirname + '/script.js'); 
    //res.end() 
})*/

// Port Number
const PORT = process.env.PORT ||5000;
 
// Server Setup
app.listen(PORT,console.log(
  `Server started on port ${PORT}`));

