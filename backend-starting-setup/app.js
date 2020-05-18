const path = require('path')
const express = require("express");
const bodyParser = require("body-parser");
const feedRoutes = require("./routes/feed");
const mongoose = require("mongoose");
const app = express();

app.use(bodyParser.json()); // application/json
app.use('/images', express.static(path.join(__dirname, 'images')))

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); //Fix the CORS error when client and server run on different servers // '*' allows all client can send request
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next()
});
app.use("/feed", feedRoutes);
app.use((error, req, res, next) => {
  console.log(error)
  const status = error.statusCode || 500
  const message = error.message
  res.status(status).join({message: message})
})

mongoose.connect(
  "mongodb+srv://tuyentrinh:tuyen1234@cluster0-7dvwp.azure.mongodb.net/messages?authSource=admin&replicaSet=Cluster0-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true"
)
.then(result => {
    app.listen(8080)
})
.catch(err => console.log(err))
app.listen(8000);
