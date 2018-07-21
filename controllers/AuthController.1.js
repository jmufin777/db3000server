//const {User} = require('../models')
const jwt = require('jsonwebtoken')
const config = require('../config/config')
const {pool, client } = require('../db')

function jwtSignUser (user) {
  const ONE_WEEK = 60 * 60 * 24 * 7*52
  return jwt.sign(user, config.authentication.jwtSecret, {
    expiresIn: ONE_WEEK
  })
}

module.exports = {
  async register (req, res) {
    try {
      const user = await User.create(req.body)
      const userJson = user.toJSON()
      res.send({
        user: userJson,
        token: jwtSignUser(userJson)
      })
    } catch (err) {
      res.status(400).send({
        error: 'Twnto login je jiz pouzity.'
      })
    }
  },
   login (req, res) {
    console.log('aaaaa')  
    try {
      console.log('aaaaa')  
      const {login, password} = req.body

    //    client.query('select * from list_users where login=$1  ',[login],(err, res) => {
    //     if (err) return next(err);
    //     response.json(res.rows);
    //     console.log(JSON.stringify(res.rows));
    //     });  
       //client.release() 
      

    //   if (!user) {
    //     return res.status(403).send({
    //       error: 'The login information was incorrect'
    //     })
    //   }

    //   const isPasswordValid = await user.comparePassword(password)
    //   if (!isPasswordValid) {
    //     return res.status(403).send({
    //       error: 'The login information was incorrect'
    //     })
    //   }

    //   const userJson = user.toJSON()
    //   res.send({
    //     user: userJson,
    //     token: jwtSignUser(userJson)
    //   })
    } catch (err) {
      res.status(500).send({
        error: 'An error has occured trying to log in'
      })
    }
  }
}
