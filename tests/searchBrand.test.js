const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
const should = chai.should();
const expect = chai.expect;

chai.use(chaiHttp);

describe('# Search Brand Tests', () => {
  describe('Search brand phone by name', () => {
    it('should return 200 status and find brand phone number', (done) => {
      chai.request(app)
        .post('/brand/search')
        .send({ brand: 'EXPERDECO'})
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('phone').to.be.equal('04 50 34 63 54');
          done()
        })
    });

    it('should return 400 status with phone unavailable', (done) => {
      chai.request(app)
        .post('/brand/search')
        .send({ brand: 'undefined'})
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('error').to.be.equal('Phone is unavailable');
          done()
        })
    });
  });

  describe('Search brand phone by SIREN', () => {
    it('should return 200 status and find brand phone number with given SIREN (S.A LUBING INTERNATIONAL)', (done) => {
      chai.request(app)
        .post('/brand/search')
        .send({ brand: '301941407'})
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('phone').to.be.equal('03 21 27 60 68');
          done()
        })
    });

    it('should return 200 status with phone even if the brand isnt the first link (China Arts)', (done) => {
      chai.request(app)
        .post('/brand/search')
        .send({ brand: '310590773'})
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('phone').to.be.equal('01 45 83 88 68');
          done()
        })
    });

    it('should return 400 status with phone unavailable (Paris Ateliers)', (done) => {
      chai.request(app)
        .post('/brand/search')
        .send({ brand: '312936875'})
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('error').to.be.equal('Phone is unavailable');
          done()
        })
    });

    it('should return 400 status with invalid SIREN', (done) => {
      chai.request(app)
        .post('/brand/search')
        .send({ brand: '001001001'})
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('error').to.be.equal('Phone is unavailable');
          done()
        })
    });
  });
});
