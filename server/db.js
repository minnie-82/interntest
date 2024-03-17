const { MongoClient, ServerApiVersion } = require('mongodb');
const dotenv=require("dotenv");

dotenv.config({ path: "../.env" });
console.log("MongoDB URI:", process.env.MONGO_URL); 

const uri = process.env.MONGO_URL;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

 const connectDB = async () =>{
  try {
    
    await client.connect();
    
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
   
    await client.close();
  }
}

module.exports = connectDB;
