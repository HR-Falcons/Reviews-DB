const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('postgres://localhost:5432/postgres');

sequelize.authenticate()
  .then(res => console.log('connection established'))
  .catch(err => console.log('couldnt connect to database', err));

const Characteristic = sequelize.define('characteristics', {
  product_id:  {
    type: DataTypes.INTEGER
  },
  name: {
    type: DataTypes.STRING(32)
  }
}, {
  freezeTableName: true,
  timestamps: false
})

const Characteristic_Review = sequelize.define('characteristic_reviews', {
  characteristic_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'characteristics'
    }
  },
  review_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'reviews'
    }
  },
  value: {
    type: DataTypes.INTEGER
  }
}, {
  freezeTableName: true,
  timestamps: false
})

module.exports = {
  Characteristic,
  Characteristic_Review
}
