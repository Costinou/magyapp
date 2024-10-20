const express = require('express');
const fs = require('fs');
const app = express();
const port = 8080;

const backend_url = process.env.REACT_APP_BACKEND_URL; // || 'http://backend:3000';

app.get('/index', (req, res) => {
  console.log('magyapp_front');
  const indexHtml = fs.readFileSync('index.html', 'utf8');
  res.send(indexHtml);
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`)
});

app.get('/word_list', (req, res) => {
  const apiUrl = `${backend_url}/word_list`;
  console.log("get on " + apiUrl);
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

app.get('/word_list/:word', (req, res) => {
  const word = req.params.word;
  const apiUrl = `${backend_url}/word_list/${word}`;
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

app.get('/word_all', (req, res) => {
  const apiUrl = `${backend_url}/word_all`;
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


