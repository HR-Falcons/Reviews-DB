const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize('postgres://localhost:5432/postgres')

sequelize.authenticate()
  .then(res => console.log('connection established', res))
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

const readCharacteristicsById = function(id) {
  return Characteristic.findAll({
    where: {
      product_id: id
    }
  })
  .then(res => {
    // format response into data that the API is expecting
    console.log('our data lookin ugly rn', res);
    return res;
  })
  .catch(err => console.log('couldnt find characteristics by id', err));

}

// Characteristic.findAll()
//   .then(res => console.log('yo this is my data', res))
//   .catch(err => console.log('couldnt query data from database', err));

module.exports = {
  readCharacteristicsById,
}