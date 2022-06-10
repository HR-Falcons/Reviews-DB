const { db } = require('../db/index.js');

const getById = function(id) {
  return db.query(`SELECT characteristics.*, characteristic_reviews.*
                  FROM characteristics INNER JOIN characteristic_reviews
                  ON characteristics.id = characteristic_reviews.characteristic_id
                  WHERE product_id = ${id}`)
  .then(res => {
    let data = res[0];
    return data;
  })
  .catch(err => console.log('couldnt find characteristics by id', err));

}

module.exports = {
  getById,
}