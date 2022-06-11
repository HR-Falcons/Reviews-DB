const { db, Review, Review_Photos, Characteristic_Review, Characteristic } = require('../db/index.js');

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
      return res;
    })
    .catch(err => console.error('Couldnt query database', err));
}

function getMetaData(id) {
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
        product_id: id,
        ratings: {},
        recommended: {
          true: 0,
          false: 0
        },
        characteristics: {
          Fit: {
            id: 0,
            value: 0
          },
          Length: {
            id: 0,
            value: 0
          },
          Comfort: {
            id: 0,
            value: 0
          },
          Quality: {
            id: 0,
            value: 0
          }
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
  Review.create({
    product_id: review.product_id,
    rating: review.product_id,
    summary: review.summary,
    body: review.body,
    recommend: review.recommend,
    helpfulness: review.helpfulness,
    reviewer_name: review.name,
    reviewer_email: review.email
  })
    .then(newReview => {
      // After new review inserted, insert review photos
      for (let photoUrl of review.photos) {
        Review_Photos.create({
          review_id: newReview.id,
          url: photoUrl
        })
      }

      // If review for new product, insert characteristics
      Characteristic.findAll({
        where: {
          product_id: review.newReview.product_id
        }
      })
        .then(res => console.log('what my result?', res))
        .catch(err => console.error('couldnt figure this out', err));

    })
    .catch(err => console.error('couldnt insert review', err));
}


module.exports = {
  getReviews,
  getMetaData,
  postReview,
}