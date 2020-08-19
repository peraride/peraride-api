'use strict'

process.env.NODE_ENV = 'test'

const chai = require('chai')
const chaiHttp = require('chai-http')
const app = require('../src/index').app
const should = chai.should()


chai.use(chaiHttp)

describe('Invalid API test', () => {

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
describe('Login API test', () => {


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
  }).timeout(25000)


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
  }).timeout(25000)


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
  }).timeout(25000)



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
  }).timeout(25000)


 })




/* REGISTRATION TEST*/
describe('Registration API test', () => {


  it('it should return validation error for missing info', done => {
    let body = {
    }
   chai
    .request(app)
    .post('/api/auth/register')
    .send(body)
    .end((err, res) => {
     res.should.have.status(400)
     res.body.should.be.a('object')
     res.body.should.have.property('message')
     res.body.message.should.eql('validation error')
     done()
    })
  }).timeout(25000)


  it('it should return validation error for missing info', done => {
    let body = {
      email:'keshara2032@gmail.com'
    }
   chai
    .request(app)
    .post('/api/auth/register')
    .send(body)
    .end((err, res) => {
     res.should.have.status(400)
     res.body.should.be.a('object')
     res.body.should.have.property('message')
     res.body.message.should.eql('validation error')
     done()
    })
  }).timeout(25000)


  it('it should return user exists with existing email', done => {
    let body = {
      email:'keshara2032@gmail.com',
      password:'heahah',
      name:'keshara'
    }
   chai
    .request(app)
    .post('/api/auth/register')
    .send(body)
    .end((err, res) => {
     res.should.have.status(409)
     res.body.should.be.a('object')
     res.body.should.have.property('message')
     res.body.message.should.eql('Email already taken')
     done()
    })
  }).timeout(25000)


  it('it should return user exists with existing email', done => {
    let body = {
      email:'keshara2032@gmail.com',
      password:'heahah',
      name:'keshara'
    }
   chai
    .request(app)
    .post('/api/auth/register')
    .send(body)
    .end((err, res) => {
     res.should.have.status(409)
     res.body.should.be.a('object')
     res.body.should.have.property('message')
     res.body.message.should.eql('Email already taken')
     done()
    })
  }).timeout(25000)

})




/* UPDATE & DELETE USER TEST*/
describe('Update+Delete API test', () => {


  it('it should return validation error for missing info', done => {
    let body = {
    }
   chai
    .request(app)
    .post('/api/auth/register')
    .send(body)
    .end((err, res) => {
     res.should.have.status(400)
     res.body.should.be.a('object')
     res.body.should.have.property('message')
     res.body.message.should.eql('validation error')
     done()
    })
  }).timeout(25000)


  it('it should return validation error for missing info', done => {
    let body = {
      email:'keshara2032@gmail.com'
    }
   chai
    .request(app)
    .post('/api/auth/register')
    .send(body)
    .end((err, res) => {
     res.should.have.status(400)
     res.body.should.be.a('object')
     res.body.should.have.property('message')
     res.body.message.should.eql('validation error')
     done()
    })
  }).timeout(25000)


  it('it should return user exists with existing email', done => {
    let body = {
      email:'keshara2032@gmail.com',
      password:'heahah',
      name:'keshara'
    }
   chai
    .request(app)
    .post('/api/auth/register')
    .send(body)
    .end((err, res) => {
     res.should.have.status(409)
     res.body.should.be.a('object')
     res.body.should.have.property('message')
     res.body.message.should.eql('Email already taken')
     done()
    })
  }).timeout(25000)


  it('it should return user exists with existing email', done => {
    let body = {
      email:'keshara2032@gmail.com',
      password:'heahah',
      name:'keshara'
    }
   chai
    .request(app)
    .post('/api/auth/register')
    .send(body)
    .end((err, res) => {
     res.should.have.status(409)
     res.body.should.be.a('object')
     res.body.should.have.property('message')
     res.body.message.should.eql('Email already taken')
     done()
    })
  }).timeout(25000)

})

/* Authentication Test*/
describe('Authentication Test for API"s', () => {

  it('it should return unauthorized for illegal access to a restricted api only for admins', done => {

   chai
    .request(app)
    .get('/api/auth/findall')
    .end((err, res) => {
     res.should.have.status(401)
     res.body.should.be.a('object')
     res.body.should.have.property('message')
     res.body.message.should.eql('No auth token')
     done()
    })
  }).timeout(25000)

  it('it should return authorized for admins with valid token', done => {
      let token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1ZTVmYmFiOTRmOTAyNDAwMDQ3NWY1Y2MiLCJpYXQiOjE1OTc4MTY5MDV9.kjC6qPRueC5_WIhudj5a9D3bXkBfcCIG2JR1u9lt5nM"
      let baseurl ="peraride-api.herokuapp.com"
    chai
     .request(baseurl)
     .get('/api/auth/findall')
     .set('Accept', 'application/json')
     .set({'Authorization':`Bearer ${token}`})
     .end((err, res) => {
      res.should.have.status(200)
      res.body.should.be.a('object')
      res.body.should.have.property('users')
      res.body.users.should.be.a('array')
      done()
     })
   }).timeout(25000)


   it('it should return un-authorized for users accessing restricted API"s', done => {
    let token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1ZTVmYmFkMDRmOTAyNDAwMDQ3NWY1Y2QiLCJpYXQiOjE1OTc4NDIzMjJ9.ZM0-dyi-IpzUUORtrWIq2o8-bPObZfnA19X9je4juHo"
    let baseurl ="peraride-api.herokuapp.com"
  chai
   .request(baseurl)
   .get('/api/auth/findall')
   .set('Accept', 'application/json')
   .set({'Authorization':`Bearer ${token}`})
   .end((err, res) => {
    res.should.have.status(403)
    res.body.should.be.a('object')
    done()
   })
 }).timeout(25000)



 it('it should return authorized for users accessing with valid token', done => {
  let token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1ZTVmYmFiOTRmOTAyNDAwMDQ3NWY1Y2MiLCJpYXQiOjE1OTc4MTY5MDV9.kjC6qPRueC5_WIhudj5a9D3bXkBfcCIG2JR1u9lt5nM"
  let baseurl ="peraride-api.herokuapp.com"
chai
 .request(baseurl)
 .get('/api/auth/dock/locate')
 .set('Accept', 'application/json')
 .set({'Authorization':`Bearer ${token}`})
 .query({station_id: 1111}) // /station id 1111
 .end((err, res) => {
  res.should.have.status(200)
  res.body.should.be.a('object')
  res.body.should.have.property('docks')
  res.body.docks.should.be.a('array')
  done()
 })
}).timeout(25000)


})


