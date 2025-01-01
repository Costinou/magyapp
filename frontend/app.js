const express = require('express');
const fs = require('fs');
const app = express();
const port = 8080;

// css
app.use(express.static(__dirname));


const backend_url = 'http://localhost:3000'; // process.env.REACT_APP_BACKEND_URL; // || 'http://backend:3000'; // 


app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`)
});

app.get('/', (req, res) => {
  res.redirect('/index');
});


app.get('/index', (req, res) => {
  console.log('magyapp_front');
  const indexHtml = fs.readFileSync('index.html', 'utf8');
  res.send(indexHtml);
});


app.get('/profiles', (req, res) => { 
  const apiUrl = `${backend_url}/profiles`;
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

app.get('/word_list/:profile', (req, res) => {
  const profile = req.params.profile;
  const apiUrl = `${backend_url}/word_list/${profile}`;
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

app.get('/word_list/:profile/:word', (req, res) => {
  const profile = req.params.profile;
  const word = req.params.word;
  const apiUrl = `${backend_url}/word_list/${profile}/${word}`;
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


/* ------------- Useless for now -------------
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

*/
