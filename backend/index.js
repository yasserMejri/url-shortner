require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const shortnerRoutes = require('./server/url-shortner/routes');
const { redirectToFullUrl } = require('./server/url-shortner/controller');

const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true });

mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB successfully');
});

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.use('/api', shortnerRoutes);
app.get('/:shortKey', redirectToFullUrl);

app.get('/', (req, res) => {
  res.send('Okay! URL shortner is working');
});

const server = app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});

module.exports = { app, server };
