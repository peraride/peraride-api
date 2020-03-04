const nodemailer = require('nodemailer')
const config = require('../config')

const transporter = nodemailer.createTransport({
  host: config.transporter.host,
  port: config.transporter.port,
  auth: {
    user: config.transporter.username,
    pass: config.transporter.password
  }
})

module.exports = transporter
