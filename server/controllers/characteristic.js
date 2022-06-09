const { Characteristic } = require('../db/index.js');

const getById = function(id) {
  return Characteristic.findAll({
    where: {
      product_id: id
    },
    include: {

    }
  })
  .then(res => {
    // TODO:
    // format response into data that the API is expecting
    let data = {};
    res.forEach(characteristic => {
      data[characteristic.dataValues.name] = characteristic.dataValues.product_id;
    })
    return data;
  })
  .catch(err => console.log('couldnt find characteristics by id', err));

}

module.exports = {
  getById,
}