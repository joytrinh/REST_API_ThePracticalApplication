const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const multer = require("multer");
const graphqlHttp = require('express-graphql')
const graphqlSchema = require('./graphql/schema')
const graphqlResolver = require('./graphql/resolvers')

const app = express();

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true)
  }
  else {
    cb(null, false)
  }
};
app.use(bodyParser.json()); // application/json
app.use(multer({storage: fileStorage, fileFilter: fileFilter}).single('image'))
app.use("/images", express.static(path.join(__dirname, "images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); //Fix the CORS error when client and server run on different servers // '*' allows all client can send request
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use('/graphql', graphqlHttp({
  schema: graphqlSchema,
  rootValue: graphqlResolver,
  graphiql: true,
  customFormatErrorFn(err) { //"`formatError` is deprecated and replaced by `customFormatErrorFn`. It will be removed in version 1.0.0."
    if (!err.originalError) {
      return err
    }
    const data = err.originalError.data
    const message = err.message || 'An error occurred.'
    const code = err.originalError.code || 500
    return { message: message, status: code, data: data}
  }
}))

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

mongoose
  .connect(
    "mongodb+srv://tuyentrinh:tuyen1234@cluster0-7dvwp.azure.mongodb.net/messages?authSource=admin&replicaSet=Cluster0-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true"
  )
  .then((result) => {
    app.listen(8000);
  })
  .catch((err) => console.log(err));