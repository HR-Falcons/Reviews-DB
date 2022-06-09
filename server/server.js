const express = require('express')
const router = require('./routes.js');
require('dotenv').config();


const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use('/', router);

// app.get('/', (req, res) => {
//   res.status(200).send('got your message');
// })

// app.get('/characteristics/:characteristic_id', (req, res) =>{
//   res.status(200).send('cool stuff!');
// })

app.listen(port, () => {
  console.log(`Database listening on port ${port}`);
})