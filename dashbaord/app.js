const express = require('express');
const app = express();
const port = process.env.PORT||9800;
const bodyParser = require('body-parser');
const cors = require('cors');
const mongo = require('mongodb');
const MongoClient = mongo.MongoClient;
const mongourl = 'mongodb://localhost:27017';
let dbObj;
let col_name="users";

app.use(cors());
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json())
// static file path
app.use(express.static(__dirname+'/public'));
// view file path
app.set('views','./src/views');
//view engine
app.set('view engine','ejs');

// healthCheck
app.get('/health',(req,res) =>{
    res.status(200).send("Health Ok")
})

app.get('/',(req,res) =>{
    dbObj.collection(col_name).find().toArray((err,result) =>{
        if(err) res.render('index',{data:'',err:err})
        res.render('index',{data:result})
    })
})

// getUser
app.get('/users',(req,res) => {
    var query = {}
    if(req.query.city && req.query.role){
        query={city:req.query.city,role:req.query.role,isActive:true}
    }
    else if(req.query.city){
        query={city:req.query.city,isActive:true}
    }else if(req.query.role){
        query={role:req.query.role,isActive:true}
    }else{
        query ={isActive:true} 
    }
    dbObj.collection(col_name).find(query).toArray((err,result) =>{
        if(err) throw err;
        res.send(result)
    })
})

// getUserbyid
app.get('/user/:id',(req,res) => {
    var Id  = mongo.ObjectId(req.params.id)
    dbObj.collection(col_name).find({_id:Id}).toArray((err,result) =>{
        if(err) throw err;
        res.send(result)
    })
});

app.get('/users1',async (req,res) => {
    let output = await dbObj.collection(col_name).find().toArray()
    res.send(output)
})

app.get('/new',(req,res) => {
    res.render('admin')
})

// add users
app.post('/addUser',(req,res) => {
    // console.log(req.body)
    var data = {
        "name":req.body.name,
        "city":req.body.city,
        "phone":req.body.phone,
        "email":req.body.email,
        "role":req.body.role?eq.body.role:'User',
        "isActive":req.body.isActive?req.body.isActive:true
    }
    dbObj.collection(col_name).find({email:req.body.email},(err,result)=>{
        if(result){
            res.send('Email Already taken')
        }else{
            dbObj.collection(col_name).insert(data,(err,result) =>{
                if(err) throw err;
                //res.status(200).send('Data Added')
                res.redirect('/')
            })
        }
    })  
})

// updateUser
app.put('/updateUser',(req,res)=>{
    var id = mongo.ObjectID(req.body._id);
    dbObj.collection(col_name).update(
        {_id:id},
        {
            $set:{
                name:req.body.name,
                city:req.body.city,
                phone:req.body.phone,
                email:req.body.email,
                role:req.body.role,
                isActive:req.body.isActive?req.body.isActive:true
            }
        },(err,result) => {
            if(err) throw err;
            res.send('Data Updated')
        }
    )

})

// deactivateUser
app.put('/deactivateUser',(req,res)=>{
    var id = mongo.ObjectID(req.body._id);
    dbObj.collection(col_name).update(
        {_id:id},
        {
            $set:{
                isActive:false
            }
        },(err,result) => {
            if(err) throw err;
            res.send('User Deactivated')
        }
    )
})

// activateUser
app.put('/activateUser',(req,res)=>{
    var id = mongo.ObjectID(req.body._id);
    dbObj.collection(col_name).update(
        {_id:id},
        {
            $set:{
                isActive:true
            }
        },(err,result) => {
            if(err) throw err;
            res.send('User Activated')
        }
    )
})

// delete user
app.delete('/deleteUser',(req,res) =>{
    var id = mongo.ObjectID(req.body._id);
    dbObj.collection(col_name).remove({_id:id},(err,result) =>{
        if(err) throw err;
        res.send('User Deleted')
    })
})

// Connection with mongo
MongoClient.connect(mongourl,(err,connection)=>{
    if(err) throw err;
    dbObj = connection.db('edufeb')
})

app.listen(port,(err) => {
    console.log(`Server is running on port ${port}`)
})


