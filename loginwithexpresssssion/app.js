const express = require('express');
const mongodb = require('mongodb');
const session = require('express-session');
const url = "mongodb://localhost:27017";
const port = process.env.PORT || 9700;
const bodyParser = require('body-parser');

let app = express()
let db;
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json())

app.use(session({
    secret:'mymysecret'
}))

var mongoClient = new mongodb.MongoClient(url)
mongoClient.connect((err) => {
    if(err) throw err;
    db = mongoClient.db('edufeb');
});

//register User
app.post('/register',(req,res) => {
    let user = {
        name:req.body.name,
        email:req.body.email,
        password:req.body.password,
        role:req.body.role?req.body.role:'user',
        isActive:true
    }
    db.collection('eduusers').insert(user,(err,data)=>{
        res.send('registerSuccess')
    })
});

app.post('/login',(req,res) => {
    let user = {
        email:req.body.email,
        password:req.body.password
    }
    db.collection('eduusers').findOne(user,(err,data) => {
        if(err || !data){
            res.send("Invalid Login! Please Try Again")
        }else{
            req.session.user=data
            res.redirect('/profile')
        }
    })
})

app.get('/profile',(req,res) => {
    if(!req.session.user){
        res.send("No Session founds! Please Try Again")
    }else{
        res.send(req.session.user)
    }
})


app.get('/logout',(req,res) => {
    req.session.user = null;
    res.send("Logout success")
});

app.listen(port)