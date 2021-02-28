//var express = require('express');var request = require('request');
import express from 'express';
import request from 'request';
let app = express();
let port = process.env.PORT || 7899;

// static file path
app.use(express.static(__dirname+'/public'));
// view file path
app.set('views','./src/views');
//view engine
app.set('view engine','ejs');

app.get('/weather',(req,res) => {
    let city = req.query.city?req.query.city:'Mumbai';
    let apiurl = `http://api.openweathermap.org/data/2.5/forecast/daily?q=${city}&mode=json&units=metric&cnt=5&appid=fbf712a5a83d7305c3cda4ca8fe7ef29`;
    request(apiurl,(err,data) => {
        if(err) throw err;
        let out = JSON.parse(data.body)
        //res.send(out)
        res.render('index',{title:'Weather App',result:out})
    })
})

app.listen(port,(err)=>{
    if(err) throw err;
    console.log(`Server is running on port ${port}`)
})