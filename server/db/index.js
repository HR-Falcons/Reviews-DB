const { Sequelize, DataTypes } = require('sequelize');
const db = new Sequelize('postgres://localhost:5432/postgres');

db.authenticate()
  .then(res => console.log('connection established'))
  .catch(err => console.log('couldnt connect to database', err));

const Characteristic = db.define('characteristics', {
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

const Characteristic_Review = db.define('characteristic_reviews', {
  characteristic_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Characteristic
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
  db,
  Characteristic,
  Characteristic_Review
}
