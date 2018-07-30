//const {User} = require('../models')
const config = require('../config/config')
const {pool, client } = require('../db')


const tabname = 'list_modules'
module.exports = {
    async all (req, res) {
    try {
    //  const {login, password} = req.body
    console.log('\n --------------\n')
        console.log('\n req:', req)
        console.log('\n --------------\n')
        console.log('list_modules all ',`select * from ${tabname}`)
        const client = await pool.connect()
         await client.query(`select * from ${tabname} where 1=$1`  ,[1 ],(err, response) => {
          //console.log(response)
           if (response.rowCount == 0)   {
              res.status(433).send({error: 'Moduly neobsahuji zaznamy '})
             //res.json({info: 'ok', data: 'sracka'}); 
           } else {
              res.json({info: 'ok', data: response.rows}); 
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


  async init (req, res) {
    let neco = ''
    const user = req.body.user
    try {
    //  const {login, password} = req.body
        console.log('\n --------------\n')
        console.log('\n req:', req.body.user )


        console.log('\n --------------\n')
        console.log('list_modules init ',`select * from ${tabname}`)
        const client = await pool.connect()
        await req.body.data.forEach(element => {
            
          console.log(JSON.stringify(element))
          neco = JSON.stringify(element)
          //neco = JSON.parse(neco)
          console.log(neco)
                               
          client.query(`insert into  ${tabname} (nazev,items,user_insert ) values ($1 , $2 ,$3 ) `  ,[element[0], neco, user ],(err, response, next ) => {
           
            if (err) return next(err);
           
           console.log(response, err)
          //     res.json({info: 'ok'}); 
              // if (err) return next(err);
          })
          

        });
        await client.release() 




    } catch (err) {
        console.log(err)
        res.status(400).send({
          error: 'Chyba 002 pri pozadavku na databazi : ${tabname}'
        })
    }
  }
}
