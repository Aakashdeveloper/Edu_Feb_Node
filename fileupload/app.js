const express = require('express');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const app = express();
const port = 9800
//static path
app.use(express.static(__dirname+'/public'));
app.set('view engine','ejs')

app.use(bodyParser.json());
app.use(fileUpload());

app.get('/',(req,res) =>{
    res.render('app.ejs')
})

app.post('/profile',(req,res) => {
    console.log(req.files)
    console.log(req.body)
    const imagefile = req.files.avatar;
    imagefile.mv(`${__dirname}/public/images/${imagefile.name}`,(err,data)=>{
        if(err) throw err;
        //res.send('file uploaded')
        res.render('display',{image:`${imagefile.name}`,title:req.body.fname})
    })
})


app.listen(port)