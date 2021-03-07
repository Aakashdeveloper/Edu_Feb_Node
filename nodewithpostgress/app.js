const express = require('express');
const bodyParser = require('body-parser');
const app = express()
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

const Pool = require('pg').Pool;
const pool = new Pool({
    host:'localhost',
    user:'postgres',
    database:'postgres',
    port:5432
})

app.get('/users',(req,res)=>{
    pool.query('Select * from users',(err,data) => {
        if(err) throw err;
        res.send(result.rows)
    })
})

app.get('/addusers',(req,res)=>{
    var {fname,lname} = req.body
    /*var fname = req.body.fname
    var lname = req.body.lname*/
    pool.query('insert into users (fname,lname) values ($1,$2)',(fname,lname),(err,data) => {
        if(err) throw err;
        res.send("Data Added")
    })
})

app.listen(port)