const express = require('express');
const path = require('path');

const app = express();
app.use(express.static(path.join(__dirname)));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'payment-form.html'));
});

const PORT = Number(process.env.PORT) || 8080;

process.on('uncaughtException', (err) => {
  console.error('uncaughtException', err && err.stack ? err.stack : err);
  process.exit(1);
});
process.on('unhandledRejection', (err) => {
  console.error('unhandledRejection', err && err.stack ? err.stack : err);
  process.exit(1);
});

app.listen(PORT, () => {
  console.log(`Frontend server running at http://localhost:${PORT}`);
});