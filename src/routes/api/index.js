'use strict';
const express = require('express');
const router = express.Router();
const authRouter = require('./auth.route');

router.get('/status', (req, res) => {
    console.log('Inside Status');
    res.send({ status: 'OK' });

    router.get('/bike', (req, res) => {
        console.log('Inside Bike');
        console.log('Requested Bike : ', req.query.id);
        res.send({ status: 'BIKE' });
    });

    // console.log('Got /bike')
}); // api status

router.use('/auth', authRouter); // mount auth paths

module.exports = router;
