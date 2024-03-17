const express = require('express');
const router = express.Router();
const { body, validationResult } = require("express-validator");
const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');
const multer = require('multer');

dotenv.config(); 
const uri = process.env.MONGO_URL;

// Multer configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Upload files to the 'uploads' directory
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); 
  }
});
const upload = multer({ storage: storage });

router.post(
    '/uploaddata',
    upload.array('documents'), 
    [
      body('email').isEmail(),
      body('name').isLength({ min: 4 }).withMessage('Name should be at least 5 characters long'),
      body('password').isLength({ min: 6 }).withMessage('Password should be at least 6 characters long'),
      body('phone').isLength({ min: 10 }).withMessage('Phone should be at least 10 characters long'),
      body('address').isLength({ min: 6 }).withMessage('Address should be at least 6 characters long'),
    ],
    async (req, res) => {
      const { name, email, password, phone, address } = req.body;
      const documents = req.files.map(file => file.filename); // Extract file names
      
      const client = new MongoClient(uri);
  
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      try {
        await client.connect();
  
        const collection = client.db("multiplesformdata").collection("formdata");
  
        const result = await collection.insertOne({ name, email, password, phone, address, documents });
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
