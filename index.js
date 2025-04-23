const express = require('express');
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
        data: true
      });
  });
  