var http=require('http')

var server=http.createServer((req,res)=>{
    res.write(`<h1>hii from node js</h1>`);
    res.end();
})

server.listen(8097);