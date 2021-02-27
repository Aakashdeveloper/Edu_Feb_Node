const express = require('express');
const app = express();
const superagent = require('superagent');
const request = require('request');
const port = 7800;

app.get('/',(req,res) => {
    res.send("<a href='https://github.com/login/oauth/authorize?client_id=03d8f7d4a2a281cf18bd'>Login With Git</a>")
})

app.get('/user',(req,res) => {
    const code = req.query.code;
    superagent
        .post('https://github.com/login/oauth/access_token')
        .send({
            client_id:'',
            client_secret:'',
            code:code
        })
        .set('Accept','application/json')
        .end((err,result) => {
            if(err) throw err;
            var acctoken = result.body.access_token;
            const option = {
                url:'https://api.github.com/user',
                method:'GET',
                headers:{
                    'Accept':'application/json',
                    'Authorization':'token '+acctoken,
                    'User-Agent':'mycode'
                }
            }
            request(option,(err,response,body)=> {
                return res.send(body)
            })
        })
})

app.listen(port)