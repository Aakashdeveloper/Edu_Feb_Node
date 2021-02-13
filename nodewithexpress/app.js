var express = require('express');
var app = express();
var port = 9877;
var hotelRouter= require('./src/routes/HotelRouter');
var cityRouter = require('./src/routes/CityRouter');

//health Check
app.get('/health',(req,res) => {
    res.status(200).send('Health Ok')
});

app.get('/',(req,res) => {
    res.send('<h1>Node With express</h1>')
})

app.use('/hotel',hotelRouter)
app.use('/city',cityRouter)

app.listen(port,function(err){
    if(err) throw err;
    console.log(`Server is running on port ${port}`)
})
