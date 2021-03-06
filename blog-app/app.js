const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongodb = require('mongodb');
const session = require('express-session');
const url = "mongodb://localhost:27017";
const port = process.env.PORT || 9700;
//make object of express so that you can use there methods
let app = express();
// use as a middleware for cross origin resource sharing
app.use(cors());
let db;
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json())

//use session
app.use(session({
    secret:'mysessionid'
}))

//static path
app.use(express.static(__dirname+'/public'));
//html
app.set('views','./src/views');
//view engine
app.set('view engine','ejs')

//we connected with mongo database
var mongoClient = new mongodb.MongoClient(url,{useNewUrlParser:true,useUnifiedTopology: true})
mongoClient.connect((err) => {
    if(err) throw err;
    db = mongoClient.db('myblog');
});

app.get('/',(req,res)=>{
    let message = req.query.message?req.query.message:''
    res.render('login',{message:message})
})

app.get('/health',(req,res)=>{
    res.send("Health Ok")
});

//get all post
app.get('/posts',(req,res) => {
    if(!req.session.user) { 
        res.redirect("/?message=No Session founds! Please Try Again")
    }
    //db.collection('posts').find({name:req.session.user._id})
    db.collection('posts').find({isActive:true}).toArray((err,postdata) => {
        if(err) throw err;
        res.render('blog',{postdata:postdata, userdata:req.session.user})
    })
});
//for add post ui
app.get('/addPost',(req,res) => {
    res.render('addPost',{userdata:req.session.user})
})

app.post('/addpost',(req,res) => {
    if(!req.session.user) { 
        res.redirect("/?message=No Session founds! Please Try Again")
    }

    let data = {
        title: req.body.title,
        description:req.body.description, 
        createBy:req.session.user._id,
        name:req.session.user.name,
        isActive:true
    }

    //console.log(data)
    //res.send(data)
    db.collection('posts').insert(data,(err,result) => {
        if(err) throw err;
        //res.send("Post added")
        res.redirect('posts')
    })

})

//display UI
app.get('/register',(req,res) => {
    res.render('register')
})

//register User
app.post('/register',(req,res) => {
    let user = {
        name:req.body.name,
        email:req.body.email,
        password:req.body.password,
        role:req.body.role?req.body.role:'user',
        isActive:true

    }
    db.collection('users').insert(user,(err,data)=>{
        res.redirect('/')
    })
});

app.post('/login',(req,res) => {
    let user = {
        email:req.body.email,
        password:req.body.password 
    }
    db.collection("users").findOne(user,(err,data) => {
        if(err || !data){
            res.redirect("/?message=Invalid Login! Please Try Again")
        }else{
           req.session.user=data;
           res.redirect("/posts")
        }
    });
});

//EditPost
app.get("/edit/:id",(req,res) => {
    if(!req.session.user) { 
        res.redirect("/?message=No Session founds! Please Try Again")
    }
    let Id = req.params.id;
    db.collection('posts').findOne({_id:mongodb.ObjectID(Id)},
        (err,data)=>{
            if(err) throw err;
            console.log(data)
            res.render('edit',{data,userdata:req.session.user})
        }
    )
})

//update post
app.post('/editPost/:id',(req,res) => {
    if(!req.session.user) { 
        res.redirect("/?message=No Session founds! Please Try Again")
    }
    let Id = req.params.id;
    db.collection('posts').update(
        {_id: mongodb.ObjectID(Id)},
        {
            $set:{
                title:req.body.title,
                description:req.body.description
            }
        },(err,result) => {
            if(err) throw err;
            res.redirect('/posts');
        }
    )
}) 

//update users
app.put('/editUser/:id',(req,res) => {
    let Id = req.params.id;

    db.collection('posts').update(
        {_id: mongodb.ObjectID(Id)},
        {
            $set:{
                title:req.body.title,
                description:req.body.description
            }
        },(err,result) => {
            if(err) throw err;
            res.send('Data Updated')
        }
    )
});

//Hard Delete Post
app.get('/deletePost/:id',(req,res) => {
    let id = req.params.id;
    db.collection('users').remove({_id:mongodb.ObjectID(id)},(err,result) => {
        if(err) throw err;
        res.redirect('/posts');
    })
})

//Edit User
app.put('/editUser',(req,res) => {
    let Id = req.body._id;

    db.collection('users').update(
        {_id: mongodb.ObjectID(Id)},
        {
            $set:{
                name:req.body.name,
                email:req.body.email,
                role:req.body.update_type,
                isActive:req.body.update_active,
            }
        },(err,result) => {
            if(err) throw err;
            res.send('Data Updated')
        }
    )
});

//Soft Delete User
app.put('/deactivateDelete/:id',(req,res) => {
    let Id = req.params.id;

    db.collection('users').update(
        {_id: mongodb.ObjectID(Id)},
        {
            $set:{
                isActive:false
            }
        },(err,result) => {
            if(err) throw err;
            res.send('Data Updated')
        }
    )
});


app.get('/logout',(req,res) => {
    req.session.user = null;
    res.redirect("/?message=Logout Success! Please Login Again")
});

//all users
app.get('/allusers',(req,res) => {
    if(!req.session.user) { 
        res.redirect("/?message=No Session founds! Please Try Again")
    }
    if(req.session.user.role !== "Admin"){
        res.redirect("/posts?message=You are Not Auth") 
    }
    db.collection('users').find().toArray((err,data) => {
        //res.send(data)
        res.render('users',{data:data})
    })
});

app.get('/usersbyid',(req,res) => {
    if(!req.session.user) { 
        res.redirect("/?message=No Session founds! Please Try Again")
    }
    if(req.session.user.role !== "Admin"){
        res.redirect("/posts?message=You are Not Auth") 
    }
    let query = {}
    if(req.query.id){
        query= {_id: mongodb.ObjectID(req.query.id)}
    }
    db.collection('users').find(query).toArray((err,data) => {
        res.send(data)
    })
});

app.listen(port,(err) => {

    if(err) throw err;
    console.log(`App is running on port ${port}`)
})




