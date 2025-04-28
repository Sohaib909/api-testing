const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
  
const app = express();
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.get('/api/boolean', (req, res) => {
  res.json({ success: true });
});



// app.post('/api/check-age', (req, res) => {
//     const age = req.body.age;
//     if (age >= 18) {
//       res.json({ allowed: true });
//     } else {
//       res.json({ allowed: false });
//     }
//   });

//   app.post('/api/verify', (req, res) => {
//     const { value } = req.body;
  
//      if (value === 'yes') {
//       res.json({ boolean: true, number: 1 });
//     } else {
//       res.json({ boolean: false, number: 0 });
//     }
//   });

//   app.get('/api/verify', (req, res) => {
   
//     return res.json({
//         success: true,
//         message: 'Value is valid',
//         data: false
//       });
//   });



  // ///
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

// Upload API
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

app.listen(PORT, () => {
  console.log(`Server is running`);
});