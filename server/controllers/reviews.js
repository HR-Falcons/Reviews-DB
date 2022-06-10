const { db, Review, Review_Photos } = require('../db/index.js');

function getReviews(id) {
  return Review.findAll({
    include: [
      {
        model: Review_Photos,
        attributes: ['url']
      }
    ],
    where: {
      product_id: id
    }
  })
  .then(res => {
    console.log('what the response?', res);
    return res;
  })
  .catch(err => console.error('Couldnt query database', err));
}

function getMetaData(id) {
  // return db.query(`SELECT reviews.id, reviews.rating, reviews.recommend, characteristics.name, characteristic_reviews.value
  //                 FROM reviews
  //                 INNER JOIN characteristic_reviews
  //                 ON reviews.id = characteristic_reviews.review_id
  //                 INNER JOIN characteristics
  //                 ON characteristic_reviews.characteristic_id = characteristics.id
  //                 WHERE reviews.product_id = ${id}`)
  //         .then(res => res[0])
  //         .catch(err => console.log('couldnt get metadata for product', err));
}

module.exports = {
  getReviews,
  getMetaData,
}