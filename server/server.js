const express = require('express')
const router = require('./routes.js');
require('dotenv').config();


const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use('/', router);

app.listen(port, () => {
  // console.log(`Database listening on port ${port}`);
})

module.exports = app;