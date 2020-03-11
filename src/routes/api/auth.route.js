'use strict'

const express = require('express')
const router = express.Router()
const authController = require('../../controllers/auth.controller')
const bikeController = require('../../controllers/bike.controller')
const dockController = require('../../controllers/dock.controller')
const stationController = require('../../controllers/station.controller')
const validator = require('express-validation')
const { create } = require('../../validations/user.validation')
const auth = require('../../middlewares/authorization')



// Authentication example
router.get('/secret1',  (req, res) => {
  // example route for auth
  // res.json({ message: 'Anyone can access(only authorized)' })
  setTimeout(function(){
    res.json({message: 'Your request timed out'})
  },5000);


})
router.get('/secret2', auth(['admin']), (req, res) => {
  // example route for auth
  res.json({ message: 'Only admin can access' })
})
router.get('/secret3', (req, res) => {
  // example route for auth
  res.json({ message: 'Only user can access' })
})


//API v1.0

// User level

router.post('/register', validator(create), authController.register) // validate and register
router.post('/login', authController.login) // login
router.get('/confirm', authController.confirm)
router.get('/user', auth(['user','admin']), authController.user)
router.delete('/logout', auth(['user','admin']), authController.logout)
router.get('/findall', auth(['admin']), authController.findAll)
router.delete('/delete', auth(['admin']), authController.delete)
router.post('/update', auth(['admin']), authController.update)





// Dock Level
router.get('/dock/locate',auth(['user','admin']),dockController.locate);
router.post('/dock/register',auth(['user','admin']),dockController.register);

// Station Level
router.post('/station/register',auth(['admin']),stationController.register);
router.get('/station/locate',auth(['user','admin']),stationController.locate);
router.get('/station/locateAll',auth(['user','admin']),stationController.locateAll);
router.get('/station/find',auth(['admin']),stationController.find);
router.delete('/station/delete',auth(['admin']),stationController.delete);
router.post('/station/update',auth(['admin']),stationController.update);




// Bike Level

//Register Bike (only admin)
router.post('/bike/register',  auth(),  bikeController.register) // validate and register
// Request to Unlock for a bike by user
router.get('/bike/unlock',  auth(['user','station']),bikeController.unlock)
// Request to Identify a bike by user
router.get('/bike/identify',  auth(['admin','station']),bikeController.identify)
// Request to Delete a bike by admin
router.delete('/bike/delete',auth(['admin']),bikeController.delete);
// Request to update a bike by admin
router.post('/bike/update',auth(['admin']),bikeController.update);


// REMINDER: Removed auth middleware for these two api's for POC Demo

// Request to Unlock for a bike by Station dock
// router.get('/dock/unlock', auth(['user']),dockController.unlock)
router.get('/dock/unlock',dockController.unlock)

// Request to Lock a bike on a dock By Station
router.put('/dock/lock',dockController.lock)






module.exports = router
