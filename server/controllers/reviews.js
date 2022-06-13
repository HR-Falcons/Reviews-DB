const { db, Review, Review_Photos, Characteristic_Review, Characteristic } = require('../db/index.js');

function getReviews(id) {
  // Query for reviews and include any photos where 'review_id' equal to matching reviews
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
    .catch(err => console.error('Couldnt query database', err));
}

function getMetaData(id) {
  // Query for reviews and include any characteristics where 'product_id' matches id, via join table
  return Review.findAll({
    include: [
      {
        model: Characteristic,
        attributes: ['id', 'name'],
        through: {
          attributes: ['value']
        }
      }
    ],
    where: {
      product_id: id
    }
  })
    // Take all the data and reformat into the form that the client is expecting
    .then(reviews => {
      let metaData = reviews.reduce((data, review) => {
        //Tally up the ratings for a product
        if (data.ratings[review.rating] === undefined) {
          data.ratings[review.rating] = 1;
        } else {
          data.ratings[review.rating]++;
        }

        // Tally up the reviews that recommend the product
        if (data.recommend) {
          data.recommended.true++;
        } else {
          data.recommended.false++;
        }

        // Tally up the values of the characteristics
        review.characteristics.forEach(characteristic => {
          characteristic = characteristic.dataValues;
          data.characteristics[characteristic.name] = {
            id: characteristic.id,
            value: data.characteristics[characteristic.name].value + characteristic.characteristic_reviews.dataValues.value
          }
        })

        return data;
      }, {
        // This is the form that the client is expecting for metadata
        product_id: id,
        ratings: {},
        recommended: { true: 0, false: 0 },
        characteristics: {
          Fit: { id: 0, value: 0 },
          Length: { id: 0, value: 0 },
          Comfort: { id: 0, value: 0 },
          Quality: { id: 0, value: 0 }
        }
      });

      // Determine average value for each characteristic
      for (let name in metaData.characteristics) {
        metaData.characteristics[name].value /= reviews.length;
      }

      return metaData;
    })
    .catch(err => console.error('Couldnt get metadata', err));
}

function postReview(review) {
  // Take the review and save relevant data to the reviews table
  return Review.create({
    product_id: review.product_id,
    rating: review.rating,
    summary: review.summary,
    body: review.body,
    recommend: review.recommend,
    helpfulness: review.helpfulness,
    reviewer_name: review.name,
    reviewer_email: review.email
  })
    .then(newReview => {
      // After new review inserted, insert review photos and characteristics
      for (let photoUrl of review.photos) {
        Review_Photos.create({
          review_id: newReview.id,
          url: photoUrl
        })
      }

      // If it's a review for a new product, insert characteristics
      Characteristic.findAll({
        where: { product_id: newReview.product_id }
      })
        .then(res => {
          // if new product, create characteristics for product, then insert values into join table
          if (res.length === 0) {
            for (let characteristic of ['Fit', 'Length', 'Comfort', 'Quality']) {
              Characteristic.create({
                product_id: newReview.product_id,
                name: characteristic
              })
                .then(newCharacteristic => {
                  Characteristic_Review.create({
                    review_id: newReview.id,
                    characteristic_id: newCharacteristic.id,
                    value: review.characteristics[newCharacteristic.name]
                  })
                })
            }
          // Otherwise, just insert the values of the characteristics into the join table
          } else {
            for (let characteristic of res) {
              Characteristic_Review.create({
                review_id: newReview.id,
                characteristic_id: characteristic.dataValues.id,
                value: review.characteristics[characteristic.dataValues.name]
              })
            }
          }
        })
        .catch(err => console.error('couldnt figure this out', err));

      return 201;
    })
    .catch(err => console.error('couldnt insert review', err));
}

function updateHelpful(id) {
  return Review.findOne({ where: { id: id }})
    .then(match => match.increment('helpfulness', { by: 1 }))
    .then(() => 204)
    .catch(err => console.log('couldnt update helpfulness', err));
}

function updateReported(id) {
  return Review.update({ reported: true }, { where: { id: id }})
    .then(() => 204)
    .catch(err => console.log('couldnt report review', err));
}

module.exports = {
  getReviews,
  getMetaData,
  postReview,
  updateHelpful,
  updateReported
}