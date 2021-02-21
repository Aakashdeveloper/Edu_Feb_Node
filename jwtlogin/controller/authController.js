const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('../config');
const User = require('../model/UserSchema');

router.use(bodyParser.urlencoded({extended:true}));
router.use(bodyParser.json())

//get All user
router.get('/users',(req,res) => {
    User.find({},(err,user) => {
        if(err) throw err;
        res.send(user)
    })
})

//register
router.post('/register',(req,res)=>{
    var hashpassword = bcrypt.hashSync(req.body.password,8);
    User.create({
        name:req.body.name,
        password:hashpassword,
        email:req.body.email,
        role:req.body.role?req.body.role:'User'
    },(err,user) => {
        if(err) return res.status(500).send('Error')
        res.status(200).send('Registration Success')
    })
})

//loginUser
router.post('/login',(req,res) => {
    User.findOne({email:req.body.email},(err,user) => {
        if(err) return res.status(500).send('Error While Login')
        if(!user) return res.status(400).send('No User Found')
        else{
            const passIsvalid = bcrypt.compareSync(req.body.password,user.password);
            if(!passIsvalid) return res.status(401).send("Invalid Password");
            var token = jwt.sign({id:user._id},config.secret,{expiresIn:3600})
            res.send({auth:true,token:token})
        }
    })
})

//userinfo
router.get('/userinfo',(req,res) => {
    var token = req.headers['x-access-token'];
    if(!token) res.send("No Token Provided");
    jwt.verify(token,config.secret,(err,data) => {
        if(err) return res.status(500).send('Invalid token')
        User.findById(data.id,{password:0},(err,result) => {
            res.send(result)
        })
    })
})
module.exports = router;