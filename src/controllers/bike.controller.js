'use strict'

const User = require('../models/user.model')
const Bike = require('../models/bike.model')
const config = require('../config')
const httpStatus = require('http-status')
const uuidv1 = require('uuid/v1')
const APIError = require('../utils/APIError')
var Bull = require('bull');

// Find the bike and update
exports.update = async (req, res, next) => {
  try {

    if(Object.keys(req.query).length === 0) throw new APIError(`Bike ID Field can not be empty`, httpStatus.NOT_FOUND)

    await Bike.findOneAndUpdate(
      { 'bike_id': req.query.bike_id },
      { 'bike_id': req.body.bike_id,
        'rfid_code': req.body.rfid_code,
        'state': req.body.state,
        'bike_secret': req.body.bike_secret,
     }
    )

    res.json({message: 'Updated Successfully'})

  } catch (error) {
    return next()
  }
}


// Find the bike and delete
exports.delete = async (req, res, next) => {
  try {

    if(Object.keys(req.query).length === 0) throw new APIError(`Bike ID Field can not be empty`, httpStatus.NOT_FOUND)

     await Bike.findOneAndDelete({bike_id: req.query.bike_id});
      
      res.json({message: 'Okay'})
          

  } catch (error) {
    return next()
  }
}



exports.unlock = async (req, res, next) => {
  try {


    if(Object.keys(req.query).length === 0) throw new APIError(`Bike ID Field can not be empty`, httpStatus.NOT_FOUND)
    
    
    const userID = req.user

    const bikeID = req.query.bike_id
    console.log( 'Requesting for a bike by User: ', userID._id)

      
    await Bike.findOne({bike_id: bikeID}, async function(err,bike){
      
      try {
        
      if (!bike) throw new APIError(`No bike associated with Bike ID ${bikeID}`, httpStatus.NOT_FOUND)


        // If bike is Available for lending only this will execute
      if(!bike.resourceLock){

      bike.resourceLock = true;
      bike.current_user = userID._id;

      bike.save();
      

      userID.currentBike = bike
      userID.save()


      res.status(httpStatus.OK)
      res.send(bike.transform())



      // Handling timeout for user to press the button on the dock
      await setTimeout( async function(bike_ID,userID){

        const bike = await Bike.findOne({bike_id: bike_ID})


        if(bike.state !== "LENDED"){

          console.log('Inside timer function')
          

          bike.resourceLock = false;
          bike.current_user = null;
          bike.save();
          
          

          userID.currentBike = bike;
          userID.save()




        }
  
 
     },30000,bikeID,userID)
 

     }else{

      throw new APIError(`Resource Locked ${bikeID}`, httpStatus.UNAUTHORIZED)
     }




      } catch (error) {
        next(error)
      } });





  } catch (error) {
    // console.log(error)
    return next(error)
  }
}

//Bike Registering
exports.register = async (req, res, next) => {
  try {
    const body = req.body
    const bike = new Bike(body)
    const savedBike = await bike.save()
    console.log(savedBike)

    res.status(httpStatus.CREATED)
    res.send(savedBike.transform())
  } catch (error) {
    // console.log(error)
    return next(Bike.checkDuplicateIDError(error))
  }
}




//Bike Registering
exports.identify = async (req, res, next) => {
  try {

    
  

    const bike_id = req.query.bike_id
    if (!bike_id) throw new APIError(`Bike ID can't be empty`, httpStatus.NOT_FOUND)


    await Bike.findOne({bike_id: bike_id},function(err,bike){
      
      try {
      if (!bike) throw new APIError(`No bike associated with Bike ID ${bike_id}`, httpStatus.NOT_FOUND)
      res.status(httpStatus.OK)
      res.send(bike.transform())


      } catch (error) {
        next(error)
      }
       
    
    

       })
   


    // res.status(httpStatus.CREATED)
    // res.send(savedBike.transform())
  } catch (error) {
    next(error)
  }
}


