// connect to database
const { Sequelize, DataTypes } = require('sequelize');
const characteristics = require('./controllers/characteristic');
var router = require('express').Router();

// given
router.get('/characteristics/:product_id', (req, res, next) => {
  //
  characteristics.getById(req.params.product_id)
    .then(characteristics => res.status(200).send(characteristics))
    .catch(err => console.log('couldnt send characteristics data', err));
})

// const Reviews = sequelize.design('reviews', {
//   id: {
//     type: DataTypes.INT PRIMARY KEY,
//     allowNull: false
//   },
//   product_id: {
//     type: DataTypes.INT,
//   },
//   rating: {
//     type: DataTypes.INT,
//   },
//   date: {
//     type: DataTypes.STRING(16),
//   },
//   summary: {
//     type: DataTypes.STRING(124),
//   },
//   body: {
//     type: DataTypes.STRING(1024),
//   },
//   recommend: {
//     type: DataTypes.BOOLEAN,
//   },
//   reported: {
//     type: DataTypes.BOOLEAN,
//   },
//   reviewer_name: {
//     type: DataTypes.STRING(32),
//   },
//   reviewer_email: {
//     type: DataTypes.STRING(48),
//   },
//   response: {
//     type: DataTypes.STRING(1024),
//   },
//   helpfulness: {
//     type: DataTypes.INT,
//   }
// }, {
//   freezeTableName: true
// })

module.exports = router;