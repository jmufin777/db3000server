const path = require('path')
module.exports = {
    port: 3003
    ,authentication: {
        jwtSecret: process.env.JWT_SECRET || 'secret'
      }
}