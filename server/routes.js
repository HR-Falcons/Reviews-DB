// connect to database
const { Sequelize, DataTypes } = require('sequelize');
const characteristics = require('./controllers/characteristic');
const reviews = require('./controllers/reviews');
var router = require('express').Router();

router.get('/characteristics/:product_id', (req, res, next) => {
  characteristics.getById(req.params.product_id)
    .then(characteristics => res.status(200).send(characteristics))
    .catch(err => console.log('couldnt send characteristics data', err));
})

router.get('/reviews', (req, res, next) => {
  reviews.getReviews(req.query.product_id)
  .then(reviews => res.status(200).send(reviews))
  .catch(err => console.error('Couldnt send response for reviews', err));
})

router.get('/reviews/metadata', (req, res, next) => {
  reviews.getMetaData(req.query.product_id)
    .then(metadata => {

      let data = {
        id: req.query.product_id,
        ratings: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
        recommended: {
          0: 0
        },
        characteristics: {
          Fit: {
            value: 0
          },
          Width: {
            value: 0
          },
          Comfort: {
            value: 0
          },
          Quality: {
            value: 0
          }
        }
      }

      let totalProducts = 0;

      metadata.forEach(entry => {
        data.ratings[entry.rating]++;
        data.recommended[0] += entry.recommend ? 1 : 0;
        // data.characteristics[entry.name].value += entry.value;
        totalProducts++;
        console.log(entry);
      })
      totalProducts /= 4;
      for (let key in data.ratings) {
        data.ratings[key] /= 4;
      }
      data.recommended[0] /= 4;
      for (let key in data.characteristics) {
        data.characteristics[key].value = (data.characteristics[key].value / totalProducts).toFixed(4);
      }

      res.status(200).send(data)
    })
    .catch(err => console.log('couldnt send metadata', err));
})

module.exports = router;