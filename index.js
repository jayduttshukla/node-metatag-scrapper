const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const port = 3000;

app.use(function(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});
app.use(bodyParser.json());

var osmosis = require('osmosis');

app.post('/scrapeMetadata', (req, res) => {
  getOpenGraphMeta(req.body.url).then(op => {
    res.send({ reqUrl: req.body.url, result : op});
  })
  .catch((err) => {
    res.send(err)
  });
});

function getOpenGraphMeta(url) {
  return new Promise((resolve, reject) => {
      let response;

      osmosis
          .get(url)
          .find('head')
          .set({
              image: "meta[property='og:image']@content",
              title: "meta[property='og:title']@content",
              description: "meta[property='og:description']@content",
              url: "meta[property='og:url']@content",
          })
          .find('body')
          .set({
            image: "img@src" 
          })
          .data(res => response = res)
          .error(err => reject(err))
          .done(() => resolve(response));
  });
}

app.listen(port, () => { console.log(`Server is started and running on Port: ${port}`) })