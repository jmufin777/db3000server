module.exports = (app) => {
    //const Router = require('express-promise-router')
    const Router = require('express')

    const db = require('../db')
    
    // create a new express-promise-router
    // this has the same API as the normal express router except
    // it allows you to use async functions as route handlers
    const router = new Router()
    
    // export our router to be mounted by the parent application
    module.exports = router
    
    router.post('/login', async (req, res) => {
      console.log('cekam na', '00')
      const { id } = req.params
      console.log('cekam na', '11')
      const { rows } = await db.query('SELECT * FROM users WHERE id = $1', [id])
      res.send(rows[0])
    })

}
