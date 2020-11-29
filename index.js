const express = require('express');
const mysql = require("mysql");
const cors = require('cors');
const bodyParser = require('body-parser'); //modul nodejs yang digunakan untuk mengambil data dari form

//Create connection
const db = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'spk_electretopsis'
});

//Connect
db.connect((err) => {
    if(err){
        throw err;
    }
    console.log('MySql Connected...');
});

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', (req, res) => {
    res.send('Server running...');
});

//Insert Alternatif
app.post('/addalternatif', (req, res) => {
    const nama_alternatif = req.body.nama_alternatif;
    const sqlInsert = "INSERT INTO tb_alternatif (nama_alternatif) VALUES (?)";
    db.query(sqlInsert, [nama_alternatif], (err, result)=> {
        if(err) throw err;
        console.log(result);
        res.send('Alternatif added...');
    })
});

//Select Alternatif
app.get('/getalternatif', (req, res) => {
    const sqlSelect = "SELECT * FROM tb_alternatif";
    db.query(sqlSelect, (err, result)=> {
        if(err) throw err;
        console.log(result);
        res.send(result);
    })
});

//Select Single Alternatif
app.get('/getalternatif/:id', (req, res) => {
    const id = req.params.id;
    const sqlSelect = "SELECT * FROM tb_alternatif WHERE id = ?";
    db.query(sqlSelect, id, (err, result)=> {
        if(err) throw err;
        console.log(result);
        res.send(result);
    })
});

//Update Alternatif
app.put('/updatealternatif', (req, res) => {
    const id = req.body.id;
    const nama_alternatif = req.body.nama_alternatif;
    const sqlUpdate = "UPDATE tb_alternatif SET nama_alternatif = ? WHERE id = ?";
    db.query(sqlUpdate, [nama_alternatif, id], (err, result) => {
        if(err) throw err;
        console.log(err);
    });
});

//Delete Alternatif
app.delete('/deletealternatif/:id', (req, res) => {
    const id = req.params.id;
    const sqlDelete = "DELETE FROM tb_alternatif WHERE id = ?";
    db.query(sqlDelete, id, (err, result) => {
        if(err) throw err;
        console.log(err);
    });
});

//Insert Kriteria
app.post('/addkriteria', (req, res) => {
    const nama_kriteria = req.body.nama_kriteria;
    const sqlInsert = "INSERT INTO tb_kriteria (nama_kriteria) VALUES (?)";
    db.query(sqlInsert, [nama_kriteria], (err, result)=> {
        if(err) throw err;
        console.log(result);
        res.send('Kriteria added...');
    })
});

//Select Kriteria
app.get('/getkriteria', (req, res) => {
    const sqlSelect = "SELECT * FROM tb_kriteria";
    db.query(sqlSelect, (err, result)=> {
        if(err) throw err;
        console.log(result);
        res.send(result);
    })
});

//Select Single Alternatif
app.get('/getkriteria/:id', (req, res) => {
    const id = req.params.id;
    const sqlSelect = "SELECT * FROM tb_kriteria WHERE id = ?";
    db.query(sqlSelect, id, (err, result)=> {
        if(err) throw err;
        console.log(result);
        res.send(result);
    })
});

//Update Kriteria
app.put('/updatekriteria', (req, res) => {
    const id = req.body.id;
    const nama_kriteria = req.body.nama_kriteria;
    const sqlUpdate = "UPDATE tb_kriteria SET nama_kriteria = ? WHERE id = ?";
    db.query(sqlUpdate, [nama_kriteria, id], (err, result) => {
        if(err) throw err;
        console.log(err);
    });
});

//Delete Alternatif
app.delete('/deletekriteria/:id', (req, res) => {
    const id = req.params.id;
    const sqlDelete = "DELETE FROM tb_kriteria WHERE id = ?";
    db.query(sqlDelete, id, (err, result) => {
        if(err) throw err;
        console.log(err);
    });
});

app.listen('3001', () => {
    console.log('Server started on port 3001');
});