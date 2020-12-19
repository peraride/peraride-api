'use strict';
const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const httpStatus = require('http-status');
const APIError = require('../utils/APIError');
const transporter = require('../services/transporter');
const config = require('../config');
const Schema = mongoose.Schema;
var path = require('path');

const stationSchema = new Schema(
    {
        station_id: {
            type: Number,
            required: true,
            unique: true
        },
        station_name: {
            type: String,
            maxlength: 50
        },
        latitude: {
            type: Number,
            required: true
        },
        longitude: {
            type: Number,
            required: true
        },
        docks: [{ type: Schema.Types.ObjectId, ref: 'Dock', default: '' }]
    },
    {
        timestamps: true
    }
);

stationSchema.pre('save', async function save(next) {
    try {
        // Checks before saving

        return next();
    } catch (error) {
        return next(error);
    }
});

stationSchema.post('save', async function saved(doc, next) {
    try {
        return next();
    } catch (error) {
        return next(error);
    }
});

stationSchema.method({
    transform() {
        const transformed = {};
        const fields = ['station_id', 'station_name', 'latitude', 'longitude'];

        fields.forEach((field) => {
            transformed[field] = this[field];
        });

        return transformed;
    }
});

stationSchema.statics = {
    checkDuplicateIDError(err) {
        console.log(err);
        if (err.code === 11000) {
            var error = new Error('ID already taken');
            error.errors = [
                {
                    field: 'station_id',
                    location: 'body',
                    messages: ['Station ID already taken']
                }
            ];
            error.status = httpStatus.CONFLICT;
            return error;
        }

        return err;
    }
};

module.exports = mongoose.model('Station', stationSchema);
