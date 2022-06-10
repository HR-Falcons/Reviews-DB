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
});

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
});

const Review = db.define('reviews', {
  product_id: {
    type: DataTypes.INTEGER,
  },
  rating: {
    type: DataTypes.INTEGER,
  },
  date: {
    type: DataTypes.STRING(16),
  },
  summary: {
    type: DataTypes.STRING(124),
  },
  body: {
    type: DataTypes.STRING(1024),
  },
  recommend: {
    type: DataTypes.BOOLEAN,
  },
  reported: {
    type: DataTypes.BOOLEAN,
  },
  reviewer_name: {
    type: DataTypes.STRING(32),
  },
  reviewer_email: {
    type: DataTypes.STRING(48),
  },
  response: {
    type: DataTypes.STRING(1024),
  },
  helpfulness: {
    type: DataTypes.INTEGER,
  }
}, {
  freezeTableName: true,
  timestamps: false
});

const Review_Photos = db.define('reviews_photos', {
  review_id: {
    type: DataTypes.INTEGER
  },
  url: {
    type: DataTypes.STRING(164)
  }
}, {
  freezeTableName: true,
  timestamps: false
})

Review.hasMany(Review_Photos, {
  foreignKey: 'review_id'
})

module.exports = {
  db,
  Characteristic,
  Characteristic_Review,
  Review,
  Review_Photos
}
