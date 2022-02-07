var fs=require('fs')
/*
fs.writeFile('my text.txt','My code file',(err)=>{
    if(err) throw err;
    console.log('file readed')
})

fs.appendFile('my text1.txt','My code file1\n',(err)=>{
    if(err) throw err;
    console.log('file readed')
})*/

fs.readFile('my text1.txt','utf-8',(err,data)=>{
    if(err) throw err;
    console.log(data)
})