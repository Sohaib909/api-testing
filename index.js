const express = require('express');
const multer = require('multer');
const path = require('path');
const app = express();
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.get('/api/boolean', (req, res) => {
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Server is running`);
});

app.post('/api/check-age', (req, res) => {
    const age = req.body.age;
    if (age >= 18) {
      res.json({ allowed: true });
    } else {
      res.json({ allowed: false });
    }
  });

  app.post('/api/verify', (req, res) => {
    const { value } = req.body;
  
     if (value === 'yes') {
      res.json({ boolean: true, number: 1 });
    } else {
      res.json({ boolean: false, number: 0 });
    }
  });

  app.get('/api/verify', (req, res) => {
   
    return res.json({
        success: true,
        message: 'Value is valid',
        data: false
      });
  });



  // ///
app.use('/uploads', express.static('uploads'));

// Configure Multer Storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const upload = multer({ storage: storage });

/////
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