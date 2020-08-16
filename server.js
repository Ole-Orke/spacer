const express = require('express')
const app = express()
const path = require('path')
const PORT = process.env.PORT || 5000

app.use(express.static("public"));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + "/public/index.html"));
})

console.log("Hello world!");

app.listen(PORT);
