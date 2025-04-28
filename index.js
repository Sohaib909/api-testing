const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Create uploads folder if it doesn't exist (Important for Railway)
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Serve static files from 'uploads' folder
app.use('/uploads', express.static(uploadDir));

// Configure Multer Storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const upload = multer({ storage: storage });


// Test API
app.get('/api/boolean', (req, res) => {
  res.json({ success: true });
});

// Upload Image API
app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'No file uploaded',
      data: null
    });
  }

  const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

  res.json({
    success: true,
    message: 'Image uploaded successfully',
    data: imageUrl
  });
});

// Get All Uploaded Images
app.get('/api/get-images', (req, res) => {
  fs.readdir(uploadDir, (err, files) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Unable to scan uploaded files',
        error: err
      });
    }

    const imageUrls = files.map(file => {
      return `${req.protocol}://${req.get('host')}/uploads/${file}`;
    });

    res.json({
      success: true,
      message: 'List of uploaded images',
      data: imageUrls
    });
  });
});

// Temporary storage (in-memory)
let storedData = null;

// POST API to receive array, object, array of objects
app.post('/post-data', (req, res) => {
  const data = req.body;

  if (!data) {
    return res.status(400).json({ message: 'No data provided' });
  }

  storedData = data; // Save the posted data

  res.status(200).json({ message: 'Data received successfully', data: storedData });
});

// GET API to display the stored data
app.get('/get-data', (req, res) => {
  if (!storedData) {
    return res.status(404).json({ message: 'No data found' });
  }

  res.status(200).json({ message: 'Here is the stored data', data: storedData });
});


app.listen(PORT, () => {
  console.log(`Server is running`);
});
