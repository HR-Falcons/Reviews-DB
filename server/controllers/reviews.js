const { db } = require('../db/index.js');

function getMetaData(id) {
  return db.query(`SELECT reviews.id, reviews.rating, reviews.recommend, characteristics.name, characteristic_reviews.value
                  FROM reviews
                  INNER JOIN characteristic_reviews
                  ON reviews.id = characteristic_reviews.review_id
                  INNER JOIN characteristics
                  ON characteristic_reviews.characteristic_id = characteristics.id
                  WHERE reviews.product_id = ${id}`)
          .then(res => res)
          .catch(err => console.log('couldnt get metadata for product', err));
}

module.exports = {
  getMetaData,
}