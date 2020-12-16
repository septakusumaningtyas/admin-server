const express = require('express');
const mysql = require("mysql");
const cors = require('cors');

const bodyParser = require('body-parser'); //modul nodejs yang digunakan untuk mengambil data dari form
const cookieParser = require('cookie-parser');
const session = require('express-session');

const bcrypt = require('bcrypt');
const { response } = require('express');
const saltRounds = 10;

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
app.use(cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true
}));
app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(session({
    key: "userId",
    secret: "darkblue",
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 60 * 60 *24,
    },
}));

app.get('/', (req, res) => {
    res.send('Server running...');
});

//Register User
app.post('/register', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const sqlInsert = "INSERT INTO tb_user (username, password, role) VALUES (?,?,'user')";
    bcrypt.hash(password,saltRounds, (err, hash) => {
        if(err)
        {
            console.log(err);
        }

        db.query(sqlInsert, [username, hash], (err, result)=> {
            if(err) throw err;
            console.log(result);
            res.send('User added...');
        })
    })
});

app.get("/login", (req, res) => {
    if(req.session.user) {
        res.send({loggedIn: true, user: req.session.user});
    } else {
        res.send({loggedIn: false});
    }
});

app.get("/logout", (req, res) => {
    if(req.session.user) {
        res.send({loggedIn: false, user: req.session.user});
    } else {
        res.send({loggedIn: true});
    }
});

//Login
app.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const sqlInsert = "SELECT * FROM tb_user WHERE username = ?;";
    db.query(sqlInsert, username, (err, result)=> {
        if(err) 
        {
            res.send({err: err});
        }

        if(result.length > 0)
        {
            bcrypt.compare(password, result[0].password, (err, response) => {
                if(response)
                {
                    req.session.user = result;
                    console.log(req.session.user);
                    res.send(result);
                } else {
                    res.send({message: "Wrong username/password combination!"})
                }
            })
        }else {
            res.send({message: "User doesn't exist"})
        }
    });
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

//Insert Alternatif Detail
app.post('/addalternatifdetail', (req, res) => {
    const nama = req.body.nama;
    const harga = req.body.harga;
    const konsumsi_bbm = req.body.konsumsi_bbm;
    const kapasitas_tangki = req.body.kapasitas_tangki;
    const popularitas = req.body.popularitas;
    const sqlInsert = "INSERT INTO tb_detail_alternatif (nama, harga, konsumsi_bbm, kapasitas_tangki, popularitas) VALUES (?,?,?,?,?)";
    db.query(sqlInsert, [nama, harga, konsumsi_bbm, kapasitas_tangki, popularitas], (err, result)=> {
        if(err) throw err;
        console.log(result);
        res.send('Alternatif Detail added...');
    })
});

//Select Alternatif Detail
app.get('/getalternatifdetail', (req, res) => {
    const sqlSelect = "SELECT * FROM tb_detail_alternatif";
    db.query(sqlSelect, (err, result)=> {
        if(err) throw err;
        console.log(result);
        res.send(result);
    })
});

//Select Single Alternatif Detail
app.get('/getasinglelternatifdetail/:id', (req, res) => {
    const id = req.params.id;
    const sqlSelect = "SELECT * FROM tb_detail_alternatif WHERE id = ?";
    db.query(sqlSelect, id, (err, result)=> {
        if(err) throw err;
        console.log(result);
        res.send(result);
    })
});

//Update Alternatif Detail
app.put('/updatealternatifdetail', (req, res) => {
    const id = req.body.id;
    const nama = req.body.nama;
    const harga = req.body.harga;
    const konsumsi_bbm = req.body.konsumsi_bbm;
    const kapasitas_tangki = req.body.kapasitas_tangki;
    const popularitas = req.body.popularitas;
    const sqlUpdate = "UPDATE tb_detail_alternatif SET nama = ?, harga = ?, konsumsi_bbm = ?, kapasitas_tangki = ?, popularitas = ? WHERE id = ?";
    db.query(sqlUpdate, [nama, harga, konsumsi_bbm, kapasitas_tangki, popularitas, id], (err, result) => {
        if(err) throw err;
        console.log(err);
    });
});

//Delete Alternatif Detail
app.delete('/deletealternatifdetail/:id', (req, res) => {
    const id = req.params.id;
    const sqlDelete = "DELETE FROM tb_detail_alternatif WHERE id = ?";
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

//Select Single Kriteria
app.get('/getsinglekriteria/:id', (req, res) => {
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

//Delete Kriteria
app.delete('/deletekriteria/:id', (req, res) => {
    const id = req.params.id;
    const sqlDelete = "DELETE FROM tb_kriteria WHERE id = ?";
    db.query(sqlDelete, id, (err, result) => {
        if(err) throw err;
        console.log(err);
    });
});

//Insert Sub Kriteria
app.post('/addsubkriteria', (req, res) => {
    const kriteria = req.body.kriteria;
    const sub_kriteria = req.body.sub_kriteria;
    const bobot = req.body.bobot;
    const sqlInsert = "INSERT INTO tb_subkriteria (kriteria, sub_kriteria, bobot) VALUES (?,?,?)";
    db.query(sqlInsert, [kriteria, sub_kriteria, bobot], (err, result)=> {
        if(err) throw err;
        console.log(result);
        res.send('Sub Kriteria added...');
    })
});

//Select Sub Kriteria
app.get('/getsubkriteria', (req, res) => {
    const sqlSelect = "SELECT * FROM tb_subkriteria";
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

//Update Sub Kriteria
app.put('/updatesubkriteria', (req, res) => {
    const id = req.body.id;
    const kriteria = req.body.kriteria;
    const sub_kriteria = req.body.sub_kriteria;
    const bobot = req.body.bobot;
    const sqlUpdate = "UPDATE tb_subkriteria SET kriteria = ?, sub_kriteria = ?, bobot = ? WHERE id = ?";
    db.query(sqlUpdate, [kriteria, sub_kriteria, bobot, id], (err, result) => {
        if(err) throw err;
        console.log(err);
    });
});

//Delete Sub Kriteria
app.delete('/deletesubkriteria/:id', (req, res) => {
    const id = req.params.id;
    const sqlDelete = "DELETE FROM tb_subkriteria WHERE id = ?";
    db.query(sqlDelete, id, (err, result) => {
        if(err) throw err;
        console.log(err);
    });
});

//Select Pesan
app.get('/getpesan', (req, res) => {
    const sqlSelect = "SELECT * FROM tb_pesan";
    db.query(sqlSelect, (err, result)=> {
        if(err) throw err;
        console.log(result);
        res.send(result);
    })
});

//Insert Pesan
app.post('/addpesan', (req, res) => {
    const nama = req.body.nama;
    const alamat_email = req.body.alamat_email;
    const pesan = req.body.pesan;
    const sqlInsert = "INSERT INTO tb_pesan (nama, alamat_email, pesan) VALUES (?,?,?)";
    db.query(sqlInsert, [nama, alamat_email, pesan], (err, result)=> {
        if(err) throw err;
        console.log(result);
        res.send('Pesan added...');
    })
});

//Select History/Data Pengguna
app.get('/getpengguna', (req, res) => {
    const sqlSelect = "SELECT * FROM tb_pengguna";
    db.query(sqlSelect, (err, result)=> {
        if(err) throw err;
        console.log(result);
        res.send(result);
    })
});

//Insert Konsultasi
app.post('/addkonsultasi', (req, res) => {
    const nama_pengguna = req.body.nama_pengguna;
    const email_pengguna = req.body.email_pengguna;
    const tgl_akses = req.body.tgl_akses;
    const alamat_pengguna = req.body.alamat_pengguna;
    const bobot_harga = req.body.bobot_harga;
    const bobot_bbm = req.body.bobot_bbm;
    const bobot_tangki = req.body.bobot_tangki;
    const bobot_popularitas = req.body.bobot_popularitas;
    const sqlInsert = "INSERT INTO tb_konsultasi (nama_pengguna, email_pengguna, tgl_akses, alamat_pengguna, bobot_harga, bobot_bbm, bobot_tangki, bobot_popularitas) VALUES (?,?,?,?,?,?,?,?)";
    db.query(sqlInsert, [nama_pengguna, email_pengguna, tgl_akses, alamat_pengguna, bobot_harga, bobot_bbm, bobot_tangki, bobot_popularitas], (err, result)=> {
        if(err) throw err;
        console.log(result);
        res.send('Data Konsultasi added...');
    })
});

//Select Data Konsultasi
app.get('/getkonsultasi', (req, res) => {
    const sqlSelect = "SELECT * FROM tb_konsultasi";
    db.query(sqlSelect, (err, result)=> {
        if(err) throw err;
        console.log(result);
        res.send(result);
    })
});

//Select Data Hasil Konsultasi
app.get('/gethasil', (req, res) => {
    const sqlSelect = "SELECT * FROM tb_hasil";
    db.query(sqlSelect, (err, result)=> {
        if(err) throw err;
        console.log(result);
        res.send(result);
    })
});

//Hitung Alternatif
app.get('/hitungalternatif', (req, res) => {
    const sqlSelect = "SELECT COUNT(id) FROM tb_alternatif";
    db.query(sqlSelect, (err, result)=> {
        if(err) throw err;
        console.log(result);
        res.send(result);
    })
});

//Hitung Kriteria
app.get('/hitungkriteria', (req, res) => {
    const sqlSelect = "SELECT COUNT(id) FROM tb_kriteria";
    db.query(sqlSelect, (err, result)=> {
        if(err) throw err;
        console.log(result);
        res.send(result);
    })
});

//Hitung Pengguna
app.get('/hitungpengguna', (req, res) => {
    const sqlSelect = "SELECT COUNT(id) FROM tb_pengguna";
    db.query(sqlSelect, (err, result)=> {
        if(err) throw err;
        console.log(result);
        res.send(result);
    })
});

app.listen('3001', () => {
    console.log('Server started on port 3001');
});