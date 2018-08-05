//const {User} = require('../models')
const config = require('../config/config')
const {pool, client } = require('../db')
const tabname = 'list_modules'

module.exports = {
    async all (req, res, next) {
      //var typ   = req.query.typ
      var typ = req.query.typ
      console.log(`select * from ${tabname} where items::text ~ '${typ}' order by category,id`)
      const dotaz = `select * from ${tabname} where items::text ~ '${typ}' or '${typ}'='All' order by category, id`
      console.log(dotaz )
      // return 
    try {
    //  const {login, password} = req.body
       console.log('\n --------------\n')
        //console.log('\n req:', req)
       console.log('\n --------------\n')
      

        const client = await pool.connect()
         //await client.query(`select * from ${tabname} where items::text ~ '${typ}' order by category`  ,(err, response) => {
         await client.query( dotaz  ,(err, response) => {
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
  async usedInMenu (req, res, next) {
    const id = req.query.idMenu
    const dotaz =`select * from (
      select distinct unnest(string_to_array(regexp_replace(items::text,'[\[\]"]','','g'),',')) as all,id,nazev from list_menu 
      ) a join 
      (
      select (string_to_array(regexp_replace(items::text,'[\[\]"]','','g'),','))[4] as modul from list_modules 
      ) b on a.all = b.modul where  b.modul > ' ' and id=${id} `

      const client = await pool.connect()
      try {
      await client.query( dotaz  ,(err, response) => {
        console.log(response.rows)
        if (err) return next(err)
        res.json({info: 1, data: response.rows}); 
      })
      await client.release()
    } catch ( err ) {
      res.status(400).send({
        error: 'Chyba 403 pri pozadavku na vazby Menu, Moduly'
      })
    }

      
    console.log('aaaa',dotaz, req.query)  
    return 
  },
  async update (req, res , next ){
    const user = req.body.user
    const isdel  = req.body.del
    const client = await pool.connect()
    try {
     client.query(`begin work  `  ,[],(err, response ) => {
    })

    }  catch(err) {
      res.status(400).send({
        error: 'Chyba 402 pri pozadavku na zmenu modulu : ${tabname}'
      })
    }
    

  },
  async delete (req, res , next ){
    const user = req.body.user
    const isdel  = req.body.del
  },
  async init (req, res, next) {
    let neco = ''
    const user = req.body.user
    const isdel  = req.body.del
    try {
    //  const {login, password} = req.body
        console.log('\n req:', req.body.user )
        console.log('\n --------------\n')
        const client = await pool.connect()
        client.query(`begin work  `  ,[],(err, response ) => {
        })

        client.query(`delete from   ${tabname}  where $1 `  ,[ isdel ],(err, response ) => {
        })

        await req.body.data.forEach(element => {
          neco = JSON.stringify(element)
          client.query(`insert into  ${tabname} (nazev,modul,items,user_insert ) values ( $1 ,$2, $3 ,$4 )  `  ,[element[0],element[3], neco, user ],(err, response ) => {
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
        // console.log(err)
        res.status(400).send({
          error: 'Chyba 002 pri pozadavku na databazi : ${tabname}'
        })
    }
  }
}
