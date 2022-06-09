const express = require('express')
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).send('got your message');
})

app.get('/characteristics/:characteristic_id', (req, res) =>{
  res.status(200).send('cool stuff!');
})

app.listen(port, () => {
  console.log(`Database listening on port ${port}`);
})