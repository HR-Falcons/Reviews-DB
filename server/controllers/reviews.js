const { db, Review, Review_Photos, Characteristic_Review, Characteristic } = require('../db/index.js');

function getReviews(id, page = 1, count = 5) {
  // Query for reviews and include any photos where 'review_id' equal to matching reviews
  return Review.findAll({
    include: [
      {
        model: Review_Photos,
        attributes: ['url']
      }
    ],
    where: {
      product_id: id,
      reported: false
    },
    limit: count,
    offset: (page - 1) * count
  })
    .then(reviews => reviews.map(review => {
      return {
        review_id: review.id,
        rating: review.rating,
        summary: review.summary,
        recommend: review.recommend,
        response: review.response,
        body: review.body,
        date: Date(review.date).toString()
      }
    }))
    .catch(err => 400);
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

        // Tally up the values of the characteristics (Please ignore the ugly code, I tried to make it readable)
        review.characteristics.forEach(characteristic => {
          let characteristicInfo = characteristic.dataValues;
          let newCharacteristic = data.characteristics[characteristic.name];
          let isDefined = Boolean(newCharacteristic);
          let origValue = isDefined ? newCharacteristic.value : 0;
          let newValue = origValue + characteristic.characteristic_reviews.dataValues.value;
          data.characteristics[characteristic.name] = {
            id: characteristic.id,
            value: newValue,
            count: isDefined ? newCharacteristic.count + 1 : 1
          }
        })

        return data;
      }, {
        // This is the form that the client is expecting for metadata
        product_id: id,
        ratings: {},
        recommended: { true: 0, false: 0 },
        characteristics: {}
      });

      // Determine average value for each characteristic
      for (let name in metaData.characteristics) {
        metaData.characteristics[name].value /= metaData.characteristics[name].count;
        delete metaData.characteristics[name].count;
      }

      return metaData;
    })
    .catch(err => 400);
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

      // Query all characteristics that exist for product
      return Characteristic.findAll({
        attributes: ['id', 'name'],
        where: { product_id: newReview.product_id }
      })
        .then(res => {
          let data = res.dataValues || [];
          // For any characteristics in submitted review not contained in query, insert into Characteristic
          let charFilter = function(data) {
            let absentChars = [];

            // Determine which characteristics don't exist in Characteristic table
            for (let name in review.characteristics) {
              let matched = false;
              for (let char of data) {
                if (name === char.name) {
                  matched = true;
                }
              }
              if (!matched) {
                absentChars.push(name)
              }
            }

            // Return an array of async insert queries (remember this is the argument to Promise.all)
            return absentChars.map(name => Characteristic.create({ product_id: review.product_id, name: name }))
          }

          // Insert any characteristics missing for product
          return Promise.all(charFilter(data))
            .then(newChars => {
              // Data now includes all characteritiscs with relevant characteristic_id
              newChars.forEach(char => data.push({ id: char.dataValues.id, name: char.dataValues.name }));

              // Finally create all things
              return Promise.all(data.map(char => Characteristic_Review.create({
                review_id: newReview.id,
                characteristic_id: char.id,
                value: review.characteristics[char.name]
              })))
                .then(() => 201)
            })
            .catch(err => 400)
        })
    })
    .catch(err => 400);
}

function updateHelpful(id) {
  return Review.findOne({ where: { id: id }})
    .then(match => match.increment('helpfulness', { by: 1 }))
    .then(() => 204)
    .catch(err => 400);
}

function updateReported(id) {
  return Review.update({ reported: true }, { where: { id: id }})
    .then(() => 204)
    .catch(err => 400);
}

module.exports = {
  getReviews,
  getMetaData,
  postReview,
  updateHelpful,
  updateReported
}