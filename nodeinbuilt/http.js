var http = require('http');

var server = http.createServer(function(req,res){
    if(req.url === '/hotel'){
        res.write('<h1>This is Hotel Page</h1>')
    }
    if(req.url === '/'){
        res.write('<h1>This is Home Page</h1>');
    }
    res.end()
});

server.listen(61)
//http://127.0.0.1:61/
//http://localhost:61/
//1-65535