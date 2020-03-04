'use strict'
const mongoose = require('mongoose')
const bcrypt = require('bcrypt-nodejs')
const httpStatus = require('http-status')
const APIError = require('../utils/APIError')
const transporter = require('../services/transporter')
const config = require('../config')
const Schema = mongoose.Schema
var path = require('path');

const Station = require('../models/station.model')

var updateStation = false

const states = [
    'LOCKED', 'AWAIT_RELEASE', 'FREE','UNAVAILABLE'
  ]

const dockSchema = new Schema({
  dock_id: {
    type: Number,
    required: true,
    unique: true,
  },
  dock_state: {
    type: String,
    required: true,
    enum: states,
    default: 'FREE'
  },
  button_id: {
    type: Number,
    required: true
  },
  station_id_num:{
      type: Number,
      required: true
  },
  bike:  [{ 
    type: Schema.Types.ObjectId, 
    ref: 'Bike',
    max:1 
 }]
}, {
  timestamps: true
})



dockSchema.pre('save', async function save (next) {
    try {

        // Checks before saving
        if (this.isNew) {

          console.log('Dock is Brand New should push to station')
          updateStation = true
          return next()
    
        }

        updateStation = false
        console.log('Dock Exists should not push to station')

      return next()
  
    } catch (error) {
      return next(error)
    }
  })

 
dockSchema.post('save', async function saved (doc, next) {
    try {
        
    //   Station.findById({station_id: req.body.station_id})

    if(updateStation)  {
      await Station.findOne({station_id:this.station_id_num}, function(err,station){
    
        console.log('Dock was pushed to the station ');
          
        station.docks.push(doc)
        station.save();

      })
     }

     console.log('Dock was Not pushed to the station ');

  
      return next()
    } catch (error) {
      return next(error)
    }
  }) 


  
dockSchema.method({
    transform () {
      const transformed = {}
      const fields = ['dock_id', 'dock_state','button_id']
  
      fields.forEach((field) => {
        transformed[field] = this[field]
      })
  
      return transformed
    }
  
 
  })


  
dockSchema.statics = {
    states,
  
    checkDuplicateIDError (err) {
      if (err.code === 11000) {
        var error = new Error('ID already taken')
        error.errors = [{
          field: 'dock_id',
          location: 'body',
          messages: ['Dock ID already taken']
        }]
        error.status = httpStatus.CONFLICT
        return error
      }
  
      return err
    },
  

  }
  
  module.exports = mongoose.model('Dock', dockSchema)
  