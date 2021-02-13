var express = require('express');
var app = express();
var port = 9877;
var menu = [
    {link:'/',name:'Home'},
    {link:'/hotel',name:'Hotel'},
    {link:'/city',name:'City'},
    {link:'/city',name:'Admin'}
]

var hotelRouter= require('./src/routes/HotelRouter')(menu);
var cityRouter = require('./src/routes/CityRouter')(menu)

// static file path
app.use(express.static(__dirname+'/public'));
// view file path
app.set('views','./src/views');
//view engine
app.set('view engine','ejs');

//health Check
app.get('/health',(req,res) => {
    res.status(200).send('Health Ok')
});

app.get('/',(req,res) => {
    //res.send('<h1>Node With express</h1>')
    res.render('index',{title:'Home Page',menu:menu})
})

app.use('/hotel',hotelRouter)
app.use('/city',cityRouter)

app.listen(port,function(err){
    if(err) throw err;
    console.log(`Server is running on port ${port}`)
})
