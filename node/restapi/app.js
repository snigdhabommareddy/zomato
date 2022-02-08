let express=require('express')
let app=express();
const mongo = require('mongodb');
const MongoClient = mongo.MongoClient;
//const mongoUrl = "mongodb://localhost:27017"
const mongoUrl="mongodb+srv://zomato:test12@cluster0.a9yt6.mongodb.net/zomatointern?retryWrites=true&w=majority"
const dotenv=require('dotenv')
dotenv.config();
const bodyParser=require('body-parser')
const cors=require('cors')
let port=process.env.PORT || 8210;
var db;

app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())
app.use(cors())

//get
app.get('/',(req,res)=>{
    res.send("welcome to express");
})
//location
app.get('/location',(req,res)=>{
    db.collection('location').find().toArray((err,result)=>{
        if(err) throw err;
        res.send(result)
    })
})
//resturant as per location
/*app.get('/hotels/:id',(req,res)=>{
    let hotId=Number(req.params.id);
    console.log(">>>hotId",hotId)
    db.collection('ResturantData').find({state_id:hotId}).toArray((err,result)=>{
        if(err) throw err;
        res.send(result)
    })
})*/

app.get('/hotels',(req,res)=>{
    let stateId  = Number(req.query.state_id)
    let mealId=Number(req.query.mealtype_id)
    let query={};
    if(stateId && mealId){
        query={"mealTypes.mealtype_id":mealId,state_id:stateId}
    }
    else if(stateId){
        query = {state_id:stateId}
    }
    else if(mealId){
        query={"mealTypes.mealtype_id":mealId}
    }
    console.log(">>>hotId",stateId)
    db.collection('ResturantData').find(query).toArray((err,result)=>{
        if(err) throw err;
        res.send(result)
    })
})

//filters
app.get('/filter/:mealId',(req,res)=>{
    let sort={cost:1}
    let mealId = Number(req.params.mealId)
    let skip=0;
    let limit=10000000000000;
    let cuisineId=Number(req.query.cuisine)
    let lcost=Number(req.query.lcost);
    let hcost=Number(req.query.hcost);
    let query={};
    if(req.query.sort){
        sort={cost:req.query.sort}
    }
    if(req.query.skip && req.query.limit){
        skip=Number(req.query.skip);
        limit=Number(req.query.limit);
    }
    if(cuisineId&lcost&hcost){
        query={
            "cuisines.cuisine_id":cuisineId,
            "mealTypes.mealtype_id":mealId,
            $and:[{cost:{$gt:lcost,$lt:hcost}}]
        }
    }
    else if( cuisineId){
        query={"cuisines.cuisine_id":cuisineId,"mealTypes.mealtype_id":mealId}
    }
    else if(lcost&hcost){
        query={$and:[{cost:{$gt:lcost,$lt:hcost}}],"mealTypes.mealtype_id":mealId}
    }
    db.collection('ResturantData').find(query).sort(sort).skip(skip).limit(limit).toArray((err,result)=>{
        if(err) throw err;
        res.send(result)
    })
})

//mealtypes
app.get('/mealtypes',(req,res)=>{
    db.collection('mealtypes').find().toArray((err,result)=>{
        if(err) throw err;
        res.send(result)
    })
})

//restrant details
app.get('/details/:id',(req,res)=>{
    let restId  = Number(req.params.id)
   // let restId=mongo.ObjectId(req.params.id)
    db.collection('ResturantData').find({restaurant_id:restId}).toArray((err,result)=>{
        if(err) throw err;
        res.send(result)
    })
})
//menu wrt resturant
app.get('/menu/:id',(req,res)=>{
    let restId  = Number(req.params.id)
    db.collection('ResturantMenu').find({restaurant_id:restId}).toArray((err,result)=>{
        if(err) throw err;
        res.send(result)
    })
})
//menu when user selects

//get all orders
app.get('/orders',(req,res)=>{
    let email  = req.query.email
    let query={};
    if(email){
        query={"email":email}
    }
    db.collection('orders').find(query).toArray((err,result)=>{
        if(err) throw err;
        res.send(result)
    })
})

//place order(post)
app.post('/placeorder',(req,res) => {
    //console.log(req.body)
    db.collection('orders').insert(req.body,(err,result) =>{
        if(err) throw err;
        res.send('Order Added')
    })
})


app.post('/menuItem',(req,res)=>{
    console.log(req.body)
    db.collection('ResturantMenu').find({menu_id:{$in:req.body}}).toArray((err,result)=>{
        if(err) throw err;
        res.send(result)
    })
})

app.delete('/deleteorder',(req,res)=>{
    db.collection('orders').remove({},(err,result)=>{
        if(err) throw err;
        res.send(result)
    })
})


app.put('/updateorder/:id',(req,res) => {
    let oId = mongo.ObjectId(req.params.id)
    let status = req.query.status?req.query.status:'Pending'
    db.collection('orders').updateOne(
        {_id:oId},
        {$set:{
            "status":status,
            "bank_name":req.body.bank_name,
            "bank_status":req.body.bank_status
        }},(err,result)=>{
            if(err) throw err;
            res.send(`Status Updated to ${status}`)
        }
    )
})

MongoClient.connect(mongoUrl, (err,client) => {
    if(err) console.log("Error While Connecting");
    db = client.db('zomatointern');
    app.listen(port,()=>{
        console.log(`listening to the port ${port}`);
    });
})
