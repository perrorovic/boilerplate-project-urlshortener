require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

// Body-Parser
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

//counter for urlShort generate
let urlCounter = 1;
//maplist for stored urlShort
const urlMap = {};

// Your first API endpoint
app.post('/api/shorturl', function(req, res) {
  const url = req.body.url;
  //regex to allow both http and https also optional www
  const urlCheck = /^(https?:\/\/)?(www\.)?[A-Za-z0-9-]+\.[A-Za-z]{2,}/.test(url);
  //check if url is valid or not
  if (urlCheck) {
    const urlShort = urlCounter;
    urlCounter++;
    urlMap[urlShort] = url;
    res.json({original_url: url,short_url: urlShort});
  } else {
    res.json({error: 'invalid url'});
  }
});

app.get('/api/shorturl/:parameter', (req, res) => {
  const parameter = parseInt(req.params.parameter);
  //check if the parameter is exist or not in map
  if (urlMap.hasOwnProperty(parameter)) {
    const url = urlMap[parameter];
    res.redirect(url);
  } else {
    res.json({error: 'invalid url'});
  }
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
