let express = require('express');
let axios = require('axios');
let redis = require('redis');
let app = express();
let port = 8777;
var morgan = require('morgan')

app.use(morgan('tiny'));
//connect with redis
const client = redis.createClient({
    host:'localhost',
    port:6379
})

app.get('/data',(req,res) => {
    const country = req.query.country;
    const url=`https://en.wikipedia.org/w/api.php?action=parse&format=json&section=0&page=${country}`

    //check in redis
    return client.get(`${country}`,(err,result) => {
        // if present in the redis
        if(result){
            const output = JSON.parse(result);
            return res.send(output)
        }else{
            return axios.get(url)
                .then(response => {
                    //got response of api
                    const output = response.data;
                    //save data in redis
                    client.setex(`${country}`,3600,JSON.stringify({source:'redis',output}))
                    //return api response as data was not in redis
                    res.send({source:'api',output})
                })
        }
       
    })
})

app.listen(port)