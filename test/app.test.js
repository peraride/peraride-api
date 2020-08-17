'use strict'

process.env.NODE_ENV = 'test'

const chai = require('chai')
const chaiHttp = require('chai-http')
const app = require('../src/index').app
const should = chai.should()

chai.use(chaiHttp)

describe('Application', () => {
  it('It should return HTTP Internal Error for empty post login api call', (done) => {
    chai
      .request(app)
      .post('/api/auth/login')
      .end((err, res) => {
        res.should.have.status(500)
        res.body.should.be.a('object')
        res.body.should.have.property('message')
        res.body.message.should.be.eql('Email must be provided for login')
        done()
      })
  })



  it('It should return HTTP NOTFOUND', (done) => {
    chai
      .request(app)
      .get('/something/not/exists')
      .end((err, res) => {
        res.should.have.status(404)
        done()
      })
  })
});


/* LOGIN TEST*/
describe('/POST login test', () => {


  it('it should return no existing user for invalid email', done => {
    let body = {
      'email': 'kesh@gnail.cmo'
    }
   chai
    .request(app)
    .post('/api/auth/login')
    .send(body)
    .end((err, res) => {
     res.should.have.status(404)
     res.body.should.be.a('object')
     res.body.should.have.property('message')
     res.body.message.should.eql('No user associated with '+body.email)
     done()
    })
  }).timeout(15000)


  it('it should return incorrect arguments for correct email address but no password property in JSON object', done => {
    let body = {
      'email': 'keshara2032@gmail.com'
    }
   chai
    .request(app)
    .post('/api/auth/login')
    .send(body)
    .end((err, res) => {
     res.should.have.status(500)
     res.body.should.be.a('object')
     res.body.should.have.property('errors')
     res.body.errors.should.eql('Incorrect arguments')
     done()
    })
  }).timeout(15000)


  it('it should return invalid credentials for wrong password', done => {
    let body = {
      'email': 'keshara2032@gmail.com',
      'password': 'Myiiiii'
    }
   chai
    .request(app)
    .post('/api/auth/login')
    .send(body)
    .end((err, res) => {
     res.should.have.status(401)
     res.body.should.be.a('object')
     res.body.should.have.property('message')
     res.body.message.should.eql('Password mismatch')
     done()
    })
  }).timeout(15000)



  it('it should return login succesful for valid credentials', done => {
    let body = {
      'email': 'keshara2032@gmail.com',
      'password': 'MyiPhone10'
    }
   chai
    .request(app)
    .post('/api/auth/login')
    .send(body)
    .end((err, res) => {
     res.should.have.status(200)
     res.body.should.be.a('object')
     res.body.should.have.property('message')
     res.body.should.have.property('token')
     res.body.should.have.property('name')
     res.body.should.have.property('role')
     res.body.message.should.eql('OK')
     done()
    })
  }).timeout(15000)


 })



