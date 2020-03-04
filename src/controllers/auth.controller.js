'use strict'

const User = require('../models/user.model')
const Bike = require('../models/bike.model')
const jwt = require('jsonwebtoken')
const config = require('../config')
const httpStatus = require('http-status')
const uuidv1 = require('uuid/v1')

exports.register = async (req, res, next) => {
  try {
    const activationKey = uuidv1()
    const body = req.body
    body.activationKey = activationKey
    const user = new User(body)
    const savedUser = await user.save()
    res.status(httpStatus.CREATED)
    res.send(savedUser.transform())
  } catch (error) {
    return next(User.checkDuplicateEmailError(error))
  }
}


exports.user = async (req, res, next) => {
  try {

    console.log(req.user)

    res.status(httpStatus.CREATED)
    res.json({user: {
      name: req.user.name,
      email: req.user.email,
      role: req.user.role
    }})
  } catch (error) {
    return next()
  }
}


exports.logout = async (req, res, next) => {
  try {
    // await User.findOneAndUpdate(
    //   { 'email': req.user.email },
    //   { 'active': true }
    // )
    return res.json({ message: 'OK' })
  } catch (error) {
    next(error)
  }
}


exports.login = async (req, res, next) => {
  try {

    console.log(req.body);
    const user = await User.findAndGenerateToken(req.body)
    const payload = {sub: user.id}
    const token = jwt.sign(payload, config.secret)
    return res.json({ message: 'OK', token: token, name: user.name, role: user.role })
  } catch (error) {
    next(error)
  }
}

exports.confirm = async (req, res, next) => {
  try {
    await User.findOneAndUpdate(
      { 'activationKey': req.query.key },
      { 'active': true }
    )
    res.writeHead(301,{Location: config.frontend});
    res.end();
  } catch (error) {
    next(error)
  }
}


exports.findAll = async (req, res, next) => {
  try {

    
    User.find({}).populate({
      path: 'bike'
    }).exec((err,users) =>{

      console.log(users)

    res.json({users: users})


    })


  } catch (error) {
    return next()
  }
}



// Find the bike and delete
exports.delete = async (req, res, next) => {
  try {

    if(Object.keys(req.query).length === 0) throw new APIError(`User ID Field can not be empty`, httpStatus.NOT_FOUND)

     await User.findOneAndDelete({email: req.query.email});
      
      res.json({message: 'Okay'})
          

  } catch (error) {
    return next()
  }
}


// Find the user and update
exports.update = async (req, res, next) => {
  try {

    if(Object.keys(req.query).length === 0) throw new APIError(`User ID Field can not be empty`, httpStatus.NOT_FOUND)

    console.log(req.body)
    await User.findOneAndUpdate(
      { 'email': req.query.email },

      { 'email': req.body.email,
        'name': req.body.name.first,
        'active': req.body.isActive,
        'mobile': req.body.mobile,
        'age': req.body.age,
        'role': req.body.role
     }
    )

    res.json({message: 'Updated Successfully'})

  } catch (error) {
    return next()
  }
}