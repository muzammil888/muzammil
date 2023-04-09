const express = require('express');
const jwt = require('jsonwebtoken');
const fs = require('fs')
const users = require('./users.json');
const port = 3000;
const app = express();
app.use(express.json());

app.use(function (req,res,next) {
    console.log('Request :', req)
    console.log ('Response :', res)
    next()
})


app.get('/', function (req,res) {
    res.send('MuzammilHusaeri')
  })
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  // Cek apakah username dan password sesuai dengan data users
  const user = users.find(user => user.username === username && user.password === password);
  if (!user) {
    return res.status(401).send('Username atau password salah');
  }

  // Buat token JWT dengan payload berisi data user
  const payload = { userId: user.id, username: user.username };
  const token = jwt.sign(payload, secretKey); 

  // Kirim token sebagai respon sukses
  res.json({ token });
});
 const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization');
    // Cek apakah token valid
    if (token !== 'YOUR_AUTH_TOKEN') {
      return res.status(401).send({ message: 'Invalid auth token' });
    }
    next();
  }
  
  // API endpoint untuk mendapatkan semua data dari teachers.json
  app.get('/api/teachers', authMiddleware, (req, res) => {
    fs.readFile('teachers.json', (err, data) => {
      if (err) {
        return res.status(500).send({ message: 'Error reading file' });
      }
      const teachers = JSON.parse(data);
      res.send(teachers);
    });
  });
  
app.listen(port, () => {
  console.log('Server berjalan pada port 3000');
});
