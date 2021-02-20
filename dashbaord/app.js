const express = require('express');
const app = express();
const port = 9800;
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

// healthCheck
app.get('/',(req,res) =>{
    res.send("Health Ok")
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
    dbObj.collection(col_name).find({isActive:true,_id:Id}).toArray((err,result) =>{
        if(err) throw err;
        res.send(result)
    })
})

app.get('/users1',async (req,res) => {
    let output = await dbObj.collection(col_name).find().toArray()
    res.send(output)
})

// add users
app.post('/addUser',(req,res) => {
    // console.log(req.body)
    dbObj.collection(col_name).insert(req.body,(err,result) =>{
        if(err) throw err;
        res.status(200).send('Data Added')
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
                isActive:req.body.isActive
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


