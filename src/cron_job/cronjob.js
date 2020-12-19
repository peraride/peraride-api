var cron = require('node-cron');
const User = require('../models/user.model');
const Bike = require('../models/bike.model');
const Dock = require('../models/dock.model');
const Station = require('../models/station.model');

const config = require('../config');
const httpStatus = require('http-status');
const uuidv1 = require('uuid/v1');
const APIError = require('../utils/APIError');
const mongoose = require('mongoose');

var cron_bike = '';

module.exports.log = function (bike) {
    cron_bike = bike;
};

module.exports.task = cron.schedule(
    '* * * * *',
    () => {
        console.log('CRON Job Called');

        if (cron_bike.state == 'CHARGING') {
            // console.log(bike)

            cron_bike.state = 'AVAILABLE';
            cron_bike.save();
            this.task.stop();
        }

        console.log(cron_bike);
    },
    {
        scheduled: false
    }
);
