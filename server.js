import express from 'express';


const app = express();

app.get("/", (req,res)=>{
    res.json({
        "hello":"hello",
        
    })
})



app.listen("3000",()=>{
    console.log("Server Started listening 3000")
    
    
})