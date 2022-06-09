// connect to database
const { Sequelize, DataTypes } = require('sequelize');
const { getCharacteristicById } = require('controllers/characteristic.js');

const sequelize = new Sequelize('postgres://localhost:5432/postgres')

sequelize.authenticate()
  .then(res => console.log('connection established', res))
  .catch(err => console.log('couldnt connect to database', err));

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