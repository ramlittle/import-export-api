const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const Image = require('../models/Image');


// Set storage configuration for Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Specify the folder where you want to save the uploaded files
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const fileExtension = path.extname(file.originalname);
    const filename = file.fieldname + '-' + uniqueSuffix + fileExtension;
    cb(null, filename);
  },
});

// Create Multer instance with the storage configuration
const upload = multer({ storage: storage });

// POST route for file upload
router.post('/upload', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  // Get the file path
  const filePath = path.join(__dirname, '../uploads', req.file.filename);

  try {
    // Save the file information to the database using Mongoose
    const image = new Image({ filename: req.file.filename, filepath: filePath });
    await image.save();

    res.status(200).json({ message: 'File uploaded successfully', image });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;