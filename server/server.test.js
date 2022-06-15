const request = require('supertest');
const app = require('./server.js');

describe('GET /reviews', () => {

  test('Should response with a 200 status code', (done) => {
    request(app)
      .get('/reviews')
      .query({ product_id: 1 })
      .then(res => {
        expect(res.statusCode).toBe(200);
        done();
      });
  });

  test('Should response with a 400 status code', (done) => {
    request(app)
      .get('/reviews')
      .query({ product_id: 'i' })
      .then(res => {
        expect(res.statusCode).toBe(400);
        done();
      });
  });

  test('Should response with a 200 status code', (done) => {
    request(app)
      .get('/reviews')
      .query({
        product_id: 1,
        page: 2,
        limit: 4
      })
      .then(res => {
        expect(res.statusCode).toBe(200);
        done();
      });
  });
});

describe('GET reviews/metadata', () => {

  test('Should response with status code 200', (done) => {
    request(app)
      .get('/reviews/metadata')
      .query({ product_id: 1 })
      .then(res => {
        expect(res.statusCode).toBe(200);
        done();
      });
  });

  test('Should response with status code 400', (done) => {
    request(app)
      .get('/reviews/metadata')
      .query({ product_id: 'i' })
      .then(res => {
        expect(res.statusCode).toBe(400);
        done();
      });
  });
});

describe('POST reviews', () => {

  test('Should response with status code 201', (done) => {
    request(app)
      .post('/reviews')
      .send({
        "product_id": 68335,
        "rating": 5,
        "date": "123454321",
        "summary": "this is my test",
        "body": "woah I've got such a big bod",
        "recommend": false,
        "name": "Addleman waddle",
        "email": "ag@utube.com",
        "response": null,
        "helpfulness": 2,
        "photos": [
            "url1.com",
            "url2.com"
        ],
        "characteristics": {
            "Width": 5,
            "Length": 4,
            "Comfort": 3,
            "Quality": 5,
            "Fit": 3
        }
      })
      .then(res => {
        expect(res.statusCode).toBe(201);
        done();
      })
  })

  test('Should respond with status code 400', (done) => {
    request(app)
      .post('/reviews')
      .send({ empty: true })
      .then(res => {
        expect(res.statusCode).toBe(400);
        done();
      })
  })
});

describe('PUT /reviews/review_id/helpful && /reviews/review_id/report', () => {

  test('Should response with status code 204', (done) => {
    request(app)
      .put('/reviews/1/helpful')
      .then((res) => {
        expect(res.statusCode).toBe(204);
        done();
      })
  })

  test('Should response with status code 400', (done) => {
    request(app)
      .put('/reviews/i/helpful')
      .then((res) => {
        expect(res.statusCode).toBe(400);
        done();
      })
  })

  test('Should response with status code 204', (done) => {
    request(app)
      .put('/reviews/1/report')
      .then((res) => {
        expect(res.statusCode).toBe(204);
        done();
      })
  })

  test('Should response with status code 400', (done) => {
    request(app)
      .put('/reviews/i/report')
      .then((res) => {
        expect(res.statusCode).toBe(400);
        done();
      })
  })
})