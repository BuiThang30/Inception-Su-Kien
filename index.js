const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Router
const mailRouter = require("./routes/mail");
app.use("/api/mail", mailRouter);

// Static
app.use(express.static(path.join(__dirname, 'public')));

// Trang chủ
app.get('/', (req, res) => {
  res.redirect('/home');
});

// Dynamic page
app.get('/:page', (req, res) => {
  const filePath = path.join(__dirname, 'public', `${req.params.page}.html`);

  if (require('fs').existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).send('Trang không tồn tại');
  }
});

// Run server
app.listen(PORT, () => {
  console.log(`Server chạy: http://localhost:${PORT}`);
});