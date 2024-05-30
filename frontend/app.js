const express = require('express');
const fs = require('fs');
const app = express();
const port = 8080;
const backend_url = 'http://localhost:3000';

app.get('/', (req, res) => {
  console.log('magyapp_front');
  const indexHtml = fs.readFileSync('index.html', 'utf8');
  res.send(indexHtml);
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`)
});

app.get('/word_list', (req, res) => {
  const apiUrl = `${backend_url}/word_list`;
  fetch(apiUrl)
  .then(response => response.json())
  .then(
      data => {
      res.send(data);
  })
  .catch(error => {
      console.error(error);
      res.status(500).send(`An error occurred ${error}`);
  });
});