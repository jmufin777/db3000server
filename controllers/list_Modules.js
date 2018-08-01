//const {User} = require('../models')
const config = require('../config/config')
const {pool, client } = require('../db')
const tabname = 'list_modules'

module.exports = {
    async all (req, res, next) {
    try {
    //  const {login, password} = req.body
    console.log('\n --------------\n')
        console.log('\n req:', req)
        console.log('\n --------------\n')
        const client = await pool.connect()
         await client.query(`select * from ${tabname} where 1=$1 order by category`  ,[1 ],(err, response) => {
          //console.log(response)
           if (response.rowCount == 0)   {
              res.send({info: 0})
              //res.json({info: 'error', data: '433' }); 
           } else {
              res.json({info: 1, data: response.rows}); 
           }
             if (err) return next(err);
         })
         await client.release() 
    } catch (err) {
        console.log(err)
        res.status(400).send({
          error: 'Chyba 002 pri pozadavku na databazi : ${tabname}'
        })
    }
  },
  async init (req, res, next) {
    let neco = ''
    const user = req.body.user
    try {
    //  const {login, password} = req.body
        console.log('\n req:', req.body.user )
        console.log('\n --------------\n')
        const client = await pool.connect()
        client.query(`begin work  `  ,[],(err, response ) => {
        })
        client.query(`delete from   ${tabname}  `  ,[],(err, response ) => {
        })

        await req.body.data.forEach(element => {
          neco = JSON.stringify(element)
          client.query(`insert into  ${tabname} (nazev,items,user_insert ) values ( $1 , $2 ,$3 )  `  ,[element[0], neco, user ],(err, response ) => {
            if (err) {
              return next(err)
            } 
          })
        });
        client.query(`commit  `  ,[],(err, response ) => {
        })
        await client.release() 
        res.json({info:'OK'})
    } catch (err) {
        console.log(err)
        res.status(400).send({
          error: 'Chyba 002 pri pozadavku na databazi : ${tabname}'
        })
    }
  }
}
