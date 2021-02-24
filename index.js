const express = require('express');
const faceapi = require('face-api.js');
const canvas = require('canvas');
const mongoose = require('mongoose');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;
const { Canvas, Image, ImageData } = canvas;

faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

mongoose
  .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => console.log('Connected DB！'))
  .catch((err) => console.log(err));

Promise.all([
  faceapi.nets.faceLandmark68Net.loadFromDisk('./weights'),
  faceapi.nets.faceRecognitionNet.loadFromDisk('./weights'),
  faceapi.nets.ssdMobilenetv1.loadFromDisk('./weights'),
  faceapi.nets.tinyFaceDetector.loadFromDisk('./weights'),
])
  .then(() => console.log('Loaded Models！'))
  .catch((err) => console.log(err));

app.use(morgan('dev'));
app.use(helmet());
app.use(cors({ origin: true }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: '100mb' }));

app.use('/api/register', require('./routes/register'));
app.use('/api/recognition', require('./routes/recognition'));

app.listen(port, () => console.log(`start localhost ${port}`));
