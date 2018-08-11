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
        res.status(466).send({
          error: 'Chyba 002 pri pozadavku na databazi : ${tabname}'
         })
    }
  },
  async usedInMenu (req, res, next) {
    const id = req.query.idMenu
    const dotaz =`select modul,nazev from (
      select distinct unnest(string_to_array(regexp_replace(items::text,'[\[\]"]','','g'),',')) as all,id,nazev from list_menu 
      ) a join 
      (
      select (string_to_array(regexp_replace(items::text,'[\[\]"]','','g'),','))[4] as modul from list_modules 
      ) b on a.all = b.modul where  b.modul > ' ' and id=${id} `

      const client = await pool.connect()
      var tmp = ''
      try {
      await client.query( dotaz  ,(err, response) => {
        
        response.rows.forEach((el,i) => {
          tmp = el.modul.replace(/"/g,'').replace(/ /g,'')
          response.rows[i].modul = tmp
          
          // console.log(el.modul.replace(/"/g,'').replace(/ /g,''))
        })

        // console.log("RES  ",response.rows)
        if (err) return next(err)
        
          
        
        res.json({info: 1, data: response.rows}); 
      })
      await client.release()
    } catch ( err ) {
      res.status(467).send({
        error: 'Chyba 403 pri pozadavku na vazby Menu, Moduly'
      })
    }

      
    console.log('aaaa',dotaz, req.query)  
    return 
  },
  async update (req, res , next ){
    const isdel  = req.body.del
    const client = await pool.connect()
    const items = JSON.stringify(req.body.data)

    const dotaz = `update ${tabname} set   
    nazev = '${req.body.data[0]}'
    ,modul='${req.body.data[3]}'
    ,items='${items}'
    ,idefix='${req.body.data[7]}'
    ,time_update =now()
    ,user_update =  '${req.body.user}'
    where idefix = '${req.body.data[7]}'
    ` 
//    console.log(req)
       console.log(dotaz)
//    res.json({info:1})
    try {
     await client.query(`begin work  `  ,[],(err, response ) => {
      })
     await client.query( dotaz ,[],(err, response ) => {
       console.log(response)
      })
     await client.query(`commit  `  ,[],(err, response ) => {
       res.json({info: 1 })
      })
     await client.release()

    }  catch(err) {
        res.status(468).send({
        error: `Chyba 402 pri pozadavku na zmenu modulu : ${tabname}`
      })
    }
    

  },
  async delete (req, res , next ){
    const user = req.body.user
    const isdel  = req.body.del
  },
  async init (req, res, next) {
    let neco = ''
    let dotaz
    const user = req.body.user
    const isdel  = req.body.del

    
    try {
    //  const {login, password} = req.body
        console.log('\n req:', req.body.user )
        console.log('\n --------------\n')
        const client = await pool.connect()

        client.query(`begin work  `  ,[],(err, response ) => {
        })
        dotaz = `
                insert into list_modules_fix (nazev,category,popis,modul,items,idefix,time_insert,time_update,user_insert,user_update )
            select nazev,category,popis,modul,items,idefix,time_insert,time_update,user_insert,user_update
             from list_modules t where not exists( select * from list_modules_fix b where t.idefix = b.idefix )
          `
          client.query(`${dotaz}`,[] , (err,response ) =>{
          })

        client.query(`delete from   ${tabname}  where $1 `  ,[ isdel ],(err, response ) => {
        })

        await req.body.data.forEach((element,i) => {
          neco = JSON.stringify(element)
         
          console.log(element, neco)

           client.query(`insert into  ${tabname} (nazev,modul,items,user_insert, idefix ) values ( $1 ,$2, $3 ,$4, $5 )  `  ,[element[0],element[3], neco, user,element[7]  ],(err, response ) => {
             if (err) {
               return next(err)
             } 
           })
        });
        
        client.query(`select fce_modules_sync()l  `  ,[],(err, response ) => {
        })
        client.query(`commit  `  ,[],(err, response ) => {
        })
        await client.release() 
        res.json({info:'OK'})
    } catch (err) {
        console.log(err)
          res.status(469).send({
          error: 'Chyba 469 pri pozadavku na databazi : ${tabname}'
          
        })
    }
  }
}
