const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('magyapp')
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`)
});

app.get('/word_list', (req, res) => {
  fs.readdir('/home/c/Documents/_dev/magyarul/backend/word_list', (err, files) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    } else {
      res.send(files);
    }
  });
});

app.get('/word_list/:word', (req, res) => {
  const word = req.params.word;
  fs.readFile(`/home/c/Documents/_dev/magyarul/backend/word_list/${word}`, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    } else {
      res.send(data);
    }
  });
});
