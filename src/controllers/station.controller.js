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

// Find the station and respond
exports.update = async (req, res, next) => {
    try {
        if (Object.keys(req.query).length === 0)
            throw new APIError(`Station ID Field can not be empty`, httpStatus.NOT_FOUND);

        await Station.findOneAndUpdate(
            { station_id: req.query.station_id },
            {
                station_name: req.body.station_name,
                latitude: req.body.latitude,
                longitude: req.body.longitude
            }
        );

        res.json({ message: 'Updated Successfully' });
    } catch (error) {
        return next();
    }
};

// Find the station and respond
exports.delete = async (req, res, next) => {
    try {
        if (Object.keys(req.query).length === 0)
            throw new APIError(`Station ID Field can not be empty`, httpStatus.NOT_FOUND);

        await Station.findOneAndDelete({ station_id: req.query.station_id });

        res.json({ message: 'Okay' });
    } catch (error) {
        return next();
    }
};

// Find the station and respond
exports.find = async (req, res, next) => {
    try {
        if (Object.keys(req.query).length === 0)
            throw new APIError(`Station ID Field can not be empty`, httpStatus.NOT_FOUND);

        Station.findOne({ station_id: req.query.station_id }).exec((err, station) => {
            try {
                if (!station)
                    throw new APIError(
                        `No station associated with id ${req.query.station_id}`,
                        httpStatus.NOT_FOUND
                    );
                res.json({ station: station });
            } catch (error) {
                return next();
            }
        });
    } catch (error) {
        return next();
    }
};

exports.locate = async (req, res, next) => {
    try {
        Station.find({}).exec((err, stations) => {
            console.log(stations);
            res.json({ stations: stations });
        });
    } catch (error) {
        return next();
    }
};

exports.locateAll = async (req, res, next) => {
    try {
        Station.find({})
            .populate({
                path: 'docks',
                // Get Bikes of Docks - populate the 'bike' array for dock
                populate: { path: 'bike', options: { limit: 1 } }
            })
            .exec((err, stations) => {
                console.log(stations);

                res.json({ stations: stations });
            });
    } catch (error) {
        return next();
    }
};

//Station Registering
exports.register = async (req, res, next) => {
    try {
        const body = req.body;

        const station = new Station(body);
        const savedStation = await station.save();

        res.status(httpStatus.CREATED);
        res.send(savedStation.transform());
    } catch (error) {
        return next(Station.checkDuplicateIDError(error));
    }
};
