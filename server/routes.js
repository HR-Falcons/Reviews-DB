// connect to database
const { Sequelize, DataTypes } = require('sequelize');
const reviews = require('./controllers/reviews');
var router = require('express').Router();

router.get('/reviews', (req, res, next) => {
  reviews.getReviews(req.query.product_id, req.query.page, req.query.count)
  .then(reviews => res.status(200).send(reviews))
  .catch(err => console.error('Couldnt send response for reviews', err));
})

router.get('/reviews/metadata', (req, res, next) => {
  let id = req.query.product_id;
  reviews.getMetaData(id)
  .then(data => res.status(200).send(data))
  .catch(err => res.status(400).send(err));
})

router.post('/reviews',  (req, res, next) => {
  reviews.postReview(req.body)
    .then(status => res.sendStatus(status))
    .catch(err => res.sendStatus(500));
})

router.put('/reviews/:review_id/helpful', (req, res, next) => {
  reviews.updateHelpful(req.params.review_id)
  .then(status => res.sendStatus(status))
  .catch(err => res.status(500).send(err));
})

router.put('/reviews/:review_id/report', (req, res, next) => {
  reviews.updateReported(req.params.review_id)
    .then(status => res.sendStatus(status))
    .catch(err => res.status(500).send(err));
})

module.exports = router;