const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const multer = require("multer");
const feedRoutes = require("./routes/feed");
const authRoutes = require("./routes/auth");

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
app.use("/feed", feedRoutes);
app.use("/auth", authRoutes);

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
    const server = app.listen(8000);
    const io = require('./socket').init(server)
    io.on('connection', socket => {
      console.log('Client connected.')
    })
  })
  .catch((err) => console.log(err));

  /*
  keep in mind, socket.io uses a different protocol, web sockets and therefore web socket requests 
  will not interfere with the normal http requests which are sent by default by the browser.
  Web sockets build up on http, now since this server here uses http, we used that http server to 
  establish our web socket connection that uses that http protocol as a basis you could say.
  to wait for new connections,

so whenever a new client connects to us. So then we execute a certain function where we get the 
client, the so-called socket that did connect as an argument or the connection as an argument to be 
precise, so this is the connection between our server and the client which connected and this 
function will be executed for every new client that connects,
  */