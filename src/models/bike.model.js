const mongoose = require('mongoose');
const httpStatus = require('http-status')
const Schema = mongoose.Schema
const APIError = require('../utils/APIError')

const Dock = require('../models/dock.model')


const state = [
  'AVAILABLE', 'CHARGING', 'UNAVAILABLE','LENDED'
]

var dockUpdateFlag = false;

const bikeSchema = new mongoose.Schema({
    bike_id: {
        type: Number,
        required: true,
        unique: true,
        min: 10000,
        max: 99999
    },
    rfid_code: {
        type: String,
        required: true,
        unique: true,
        max:255,
        min: 6
    },
    state: {
        type: String,
        required: true,
        enum: state,
        default: 'AVAILABLE'
    }, 
    battery_level: {
       type: Number, 
       min: 0,
       max: 100,
       required: false
       
    },   
    running_time:{
      type: Number,
      min:0
    },
    registered_by: {
      type: String,
      required: false,
      min:6,
      max:255
    },
    pvt_note: {
      type: String,
      required: false
    },
    public_note: {
      type: String,
      required: false
    },
    bike_secret: {
      type: Number,
      min:9999,
      max:99999,
      unique: true,
      required: true
    },
    dock_id:{
      type: Number,
      unique: true,
      required: false
    },
    current_user: {
      type: String,
      min: 6,
      max: 255
    },
    latitude: {
      type: Number,
      required: false
    },
    longitude: {
      type: Number,
      required: false
    },
    resourceLock: Boolean

}, {
  timestamps: true
});


bikeSchema.pre('save', async function save (next) {
  try {
    if (!this.isModified('resourceLock')) {
      dockUpdateFlag = true;
      return next()

    }
    dockUpdateFlag = false;
    console.log('resource lock was  modified')

    return next()

  } catch (error) {
    return next(error)
  }
})


 
bikeSchema.post('save', async function saved (doc, next) {
  try {
      
  //   Station.findById({station_id: req.body.station_id})
  console.log('Dock ID for the dock: ',this.dock_id);

  if(dockUpdateFlag && this.dock_id){

    await Dock.findOne({dock_id:this.dock_id}, function(err,dock){


      try {

      if(dock){

        // console.log(dock)

        try {
              dock.dock_state ='LOCKED'
              dock.bike.push(doc)
              dock.save();
        
        } catch (error) {

          next(error)
        }
      }else{
        throw new APIError('Dock is not available!', httpStatus.NOT_ACCEPTABLE)
      }

    } catch (error) {
        return next(error)
    }

    })

    }

  } catch (error) {
    return next(error)
  }
}) 




bikeSchema.method({
    transform () {
      const transformed = {}
      const fields = ['bike_id', 'rfid_code', 'state', 'battery_level', 'public_note','bike_secret','dock_id','current_user','resourceLock']
  
      fields.forEach((field) => {
        transformed[field] = this[field]
      })
  
      return transformed
    }
  
  })


  bikeSchema.statics = {
  
    checkDuplicateIDError (err) {
      if (err.code === 11000) {
        if(err.keyValue.dock_id){
          var error = new Error('Dock is already occupied')
          error.errors = [{
          field: 'dock_id',
          location: 'body',
          messages: ['Dock is already occupied']
        }]
        error.status = httpStatus.CONFLICT
        return error
        }
        if(err.keyValue.bike_id){
        var error = new Error('Bike ID already taken')
        error.errors = [{
          field: 'bike_id',
          location: 'body',
          messages: ['Bike ID already taken']
        }]
        error.status = httpStatus.CONFLICT
        return error
        }

        if(err.keyValue.rfid_code){
          var error = new Error('RFID is not unique')
          error.errors = [{
            field: 'rfid_code',
            location: 'body',
            messages: ['RFID Signature is not unique']
          }]
          error.status = httpStatus.CONFLICT
          return error
          }
      }
  
      return err
    }

  }

module.exports = mongoose.model('Bike', bikeSchema);

