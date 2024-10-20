const express = require('express');
const cors = require('cors');
const fs = require('fs');
const app = express();
const port = 3000;

app.use(cors());

app.get('/', (req, res) => {
  res.send('magyapp')
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`)
});

app.get('/word_list', (req, res) => {
  fs.readdir('./word_list', (err, files) => {
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
  console.log("get on /word_list/" + word);
  fs.readFile(`./word_list/${word}`, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    } else {
      res.send(data);
    }
    console.log(data);
  });
});

app.get('/word_all', (req, res) => {
  fs.readdir('./word_list', (err, files) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    } else {
      const fileContents = [];
      files.forEach((file) => {
        const filePath = `./word_list/${file}`;
        fs.readFile(filePath, 'utf8', (err, data) => {
          if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
          } else {
            const jsonData = JSON.parse(data);
            fileContents.push(jsonData);
            if (fileContents.length === files.length) {
              const mergedDictionary = fileContents.reduce((merged, dictionary) => {
                return { ...merged, ...dictionary };
              }, {});
              res.json(mergedDictionary);
            }
          }
        });
      });
    }
  });
});