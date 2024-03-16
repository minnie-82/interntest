const express = require('express');
const router = express.Router();
const { body, validationResult } = require("express-validator");
const { MongoClient} = require('mongodb');
const dotenv = require('dotenv');
dotenv.config({ path: "../.env" }); 
const uri = process.env.MONGO_URL;
router.post(
    '/upload',
    [
      body('email').isEmail(),
      body('name').isLength({ min: 5 }).withMessage('Name should be at least 5 characters long'),
      body('password').isLength({ min: 6 }).withMessage('Password should be at least 6 characters long'),
      body('phone').isLength({ min: 10 }).withMessage('Phone should be at least 10 characters long'),
      body('address').isLength({ min: 6 }).withMessage('Address should be at least 6 characters long'),
    ],
    async (req, res) => {
      const { name, email, password, phone, address,documents } = req.body;
  
      const client = new MongoClient(uri);
  
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      try {
        await client.connect();
  
        const collection = client.db("multiplesformdata").collection("formdata");
  
       
  
        // Save the user to the database
        const result = await collection.insertOne({ name, email, password, phone, address,documents });
        console.log("Data inserted:", result);
  
        res.status(200).json({ message: "Data uploaded successfully" });
  
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: "An error occurred during upload" });
      } finally {
        await client.close();
      }
    }
  );
  module.exports = router;