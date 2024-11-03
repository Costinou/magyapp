const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const app = express();
const wordListDir = path.join(__dirname, 'word_list');
const port = 3000;

app.use(cors());
app.use(express.json());

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
  console.log("get on /word_list/"+word);
  fs.readFile(`./word_list/${word}`, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    } else {
      res.send(data);
    }
    console.log("with " + Object.keys(JSON.parse(data)).length + " elements");
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


// Add files process

// Route POST pour /add-words/nomdufichier.json
app.post('/add-words/:filename', (req, res) => {
  const data = req.body;
  const filename = req.params.filename;
  console.log("File name: " + filename)
  console.log("Content: " + JSON.stringify(req.body, null, 2));

  // Vérifie si le corps est bien un objet JSON
  if (typeof data !== 'object' || Array.isArray(data) || data === null) {
    return res.status(400).json({ error: 'Le contenu doit être un objet JSON.' });
  }

  // Vérifie que toutes les valeurs sont primitives (à un seul niveau)
  for (let key in data) {
    if (typeof data[key] === 'object' && data[key] !== null) {
      return res.status(400).json({ error: `Le fichier JSON ne doit pas contenir d'objets imbriqués. Problème avec la clé: ${key}` });
    }
  }
  // Vérifie si l'objet est vide
  if (Object.keys(data).length === 0) {
    return res.status(400).json({ error: 'Le fichier JSON ne doit pas être vide.' });
  }

  // Vérifie que le nom de fichier se termine par ".json"
  if (!filename.endsWith('.json')) {
    return res.status(400).json({ error: 'Le nom du fichier doit se terminer par .json' });
  }

  // Écriture du fichier JSON accepté dans le répertoire ./word_list/
  const filePath = path.join(wordListDir, filename);
  console.log(filePath)

  // Vérifie si le fichier existe déjà
  if (fs.existsSync(filePath)) {
    return res.status(400).json({ error: `Le fichier ${filename} existe déjà.` });
  }

  fs.writeFile(filePath, JSON.stringify(data, null, 2), (err) => {
    if (err) {
      return res.status(500).json({ error: 'Erreur lors de l\'enregistrement du fichier.' });
    }

    // Si l'écriture est réussie, envoie une réponse 200
    console.log(data)
    res.status(200).json({ message: 'Fichier JSON accepté et sauvegardé.', file: filename });
  });
});