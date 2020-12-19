'use strict';

const User = require('../models/user.model');
const Bike = require('../models/bike.model');
const Dock = require('../models/dock.model');
const Station = require('../models/station.model');

const config = require('../config');
const httpStatus = require('http-status');
const uuidv1 = require('uuid/v1');
const APIError = require('../utils/APIError');
const mongoose = require('mongoose');
var cron = require('../cron_job/cronjob');

exports.locate = async (req, res, next) => {
    try {
        console.log('Here inside locate');
        if (Object.keys(req.query).length === 0)
        throw new APIError(`Station ID Field can not be empty`, httpStatus.NOT_FOUND);

        Station.findOne({ station_id: req.query.station_id })
        .populate({
            path: 'docks',
            // Get Bikes of Docks - populate the 'bike' array for dock
            populate: { path: 'bike', options: { limit: 1 } }
        })
        .exec((err, station) => {
            try {
                if (!station)
                throw new APIError(
                    `No station associated with id ${req.query.station_id}`,
                    httpStatus.NOT_FOUND
                );
                res.json({ docks: station.docks });
            } catch (error) {
                next(error);
            }
        });
    } catch (error) {
        return next(error);
    }
};

//Dock Registering
exports.register = async (req, res, next) => {
    try {
        const body = req.body;

        const dock = new Dock(body);
        const savedDock = await dock.save();

        // console.log(savedDock)

        res.status(httpStatus.CREATED);
        res.send(savedDock.transform());
    } catch (error) {
        return next(Dock.checkDuplicateIDError(error));
    }
};

exports.unlock = async (req, res, next) => {
    try {
        if (Object.keys(req.query).length === 0)
        throw new APIError(`Dock ID Field can not be empty`, httpStatus.NOT_FOUND);

        const station_id = req.user;
        const dock_id = req.query.dock_id;

        const dock = await Dock.findOne({ dock_id: dock_id });

        if (dock) {
            if (dock.dock_state === 'FREE')
            throw new APIError(`Dock is Empty !`, httpStatus.NOT_FOUND);

            const bike = await Bike.findById(dock.bike);
            if (!bike)
            throw new APIError(
                `No Bike associated with ${bikeID}`,
                httpStatus.NOT_FOUND
            );

            console.log(bike);

            if (bike.resourceLock) {
                // Updating Bikes properties
                bike.state = 'LENDED';
                bike.dock_id = '';
                await bike.save();
                console.log('Bike has been updated');

                // Updating Docks properties
                dock.bike = null;
                dock.dock_state = 'FREE';
                await dock.save();

                res.status(httpStatus.ACCEPTED);
                res.json({
                    message: 'Access Granted'
                });
            } else {
                res.status(httpStatus.NOT_ACCEPTABLE);
                res.json({
                    message: 'Access Denied'
                });
            }
        } else {
            res.status(httpStatus.NOT_ACCEPTABLE);
            throw new APIError('Invalid Dock ID', httpStatus.NOT_FOUND);
        }
    } catch (error) {
        // console.log(error)

        return next(error);
    }
};

//Lock a bike
exports.lock = async (req, res, next) => {
    try {
        const dock_id = req.body.dock_id;
        const rfid_code = req.body.rfid_code;

        if (!dock_id || !rfid_code)
        throw new APIError(
            `dock_id and rfid_code must be provided`,
            httpStatus.NOT_FOUND
        );

        await Dock.findOne({ dock_id: dock_id }, async function (err, dock) {
            try {
                if (!dock)
                throw new APIError(
                    `No Dock associated with dock_id ID ${dock_id}`,
                    httpStatus.NOT_FOUND
                );

                // If Dock is Free only this will execute
                if (dock.dock_state == 'FREE') {
                    await Bike.findOne(
                        { rfid_code: rfid_code },
                        async function (err, bike) {
                            try {
                                console.log('Dock eka hari, bike ekath dan hari');

                                if (err)
                                throw new APIError(
                                    `No Bike associated with the given RFID_CODE ${rfid_code}`,
                                    httpStatus.NOT_FOUND
                                );

                                const user = await User.findById(bike.current_user);

                                if (user){
                                    //Updating User
                                    user.currentBike = null;
                                    user.save();
                                }

                                /*
                                if (!user)
                                throw new APIError(
                                `No User associated with user_id ${bike.current_user}`,
                                httpStatus.NOT_FOUND);
                                */

                                //Updating Bike
                                bike.dock_id = dock_id;
                                bike.current_user = '';
                                bike.resourceLock = false;
                                bike.state = 'CHARGING';
                                await bike.save();

                                cron.log(bike);
                                cron.task.start();

                                //Updating Dock
                                dock.dock_state = 'LOCKED';
                                dock.bike = bike;
                                await dock.save();

                                res.status(httpStatus.OK);
                                res.json({
                                    message: 'Bike Locked Successfully'
                                });
                            } catch (error) {
                                next(error);
                            }
                        }
                    );
                } else {
                    throw new APIError(
                        `Dock Must be free in order to dock a bike`,
                        httpStatus.NOT_FOUND
                    );
                }
            } catch (error) {
                next(error);
            }
        });
    } catch (error) {
        return next(error);
    }
};
