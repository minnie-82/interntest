
const express=require("express");
const cors=require("cors");
const dotenv=require("dotenv");
const connectDB=require('./db.js');
const apiRouter=require('./api.js')

const app=express();
app.use(cors());
app.use(express.json());




//For configuring env
dotenv.config({ path: "../.env" }); 
const PORT=process.env.PORT;

// console.log(process.env.PORT);
// console.log(process.env.DEV_MODE);


//connect DB
connectDB().catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });
  app.use('/api', apiRouter);

app.get("/",(req,res)=>{
    res.send({
     message: " Welcome to the INTERN TEST",
    });
});


app.listen(PORT,()=>{
     console.log(`Server is running on  ${process.env.DEV_MODE} mode on port ${PORT}`);
});