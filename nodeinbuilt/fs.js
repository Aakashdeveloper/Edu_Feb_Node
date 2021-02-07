var fs = require('fs');

//write file(overwrite)
/*fs.writeFile('mytext.pdf','This is my Node page',function(err){
    if(err) throw err;
    console.log('File Created')
})*/

//append
/*fs.appendFile('mydata.txt','This is line 3 \n',function(err){
    if(err) throw err;
    console.log("Append Done")
})*/

//read
/*fs.readFile('mydata.txt','utf-8',(err,data) => {
    if(err) throw err;
    console.log(data)
})*/

//rename
fs.rename('mydata.txt','myfile.txt',(err)=>{
    if(err) throw(err)
    console.log('file Renamed')
})

//delete file
/*fs.unlink('myfile.txt',(err) => {
    if(err) throw err;
    console.log('file Deleted')
})*/