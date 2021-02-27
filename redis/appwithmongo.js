let express = require('express');
let mongo = require('mongodb');
let mongodb = mongo.MongoClient;
let redis = require('redis');
let app = express();
let port = 8777;

const url = "mongodb://localhost:27017";



const client = redis.createClient({
    host:'localhost',
    port:6379
})

app.get('/data',(req,res) => {
    const userid = (req.query.id);
    
    // check in redis
    return client.get(`uid:${userid}`,(err,result) => {
        if(result){
            const output = JSON.parse(result);
            //return res as found in redis
            return res.send(output)
        }else{
            mongodb.connect(url,(err,connection)=> {
                const dbo = connection.db('aryalogin');
                let id = mongo.ObjectID(userid);
                dbo.collection('users').findOne({_id:id},(err,data)=>{
                    const output = data;
                    // store data in redis
                    client.setex(`uid:${userid}`,3600,JSON.stringify({source:'Redis',output}))
                    return res.send({source:'mongo',output})
                })
            })
        }
    })

})

app.listen(port,(err) => {
    console.log(`Server is running on port ${port}`)
})