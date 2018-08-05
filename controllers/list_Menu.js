//const {User} = require('../models')
const config = require('../config/config')
const {pool, client } = require('../db')
const tabname = 'list_menu'

module.exports = {
    async all (req, res, next) {
      //var typ   = req.query.typ
      var typ = req.query.typ
      var dotaz ='';
      var cols = '*'
      
      if (typ.match(/[a-z]/i)){
        console.log('pismana')
        if (typ == 'All'){
            cols = '*'
        } else {
            cols = 'id,nazev,popis'
        }
         
        dotaz = `select ${cols} from ${tabname}   order by  id `
      } else {
        dotaz = `select * from ${tabname}  where id = '${typ}' order by  id limit 1`
      }
       console.log(dotaz , "ID ", req.query )
       // return 
    try {
        const client = await pool.connect()
         await client.query( dotaz  ,(err, response) => {
           if (response.rowCount == 0)   {
              res.send({info: 0})
           } else {
              res.json({info: response.rowCount , data: response.rows}); 
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
  async update (req, res , next ){
    const user = req.body.user
    const data = JSON.stringify(req.body.data)
    const id = req.body.form.id
    const nazev  = req.body.form.Nazev.toString().replace(/'/g,'xxxxx')
    const popis  = req.body.form.Popis.toString().replace(/'/g,'xxxxx')

    const dotaz = `update list_menu set popis = '${popis}', nazev='${nazev}', items='${data}', user_update='${user}',time_update= now() where id = ${id} `
        
    const client = await pool.connect()
    try {
     await  client.query(dotaz,[],(err, response ) => {
      if (err) {
        // res.json({info: 'error', data: '433' }); 
        res.status(506).send(`Neuspesna zmena id ${id} ${nazev}`)
      }

    })

    await client.query('select id,nazev,popis from list_menu order by id',(err,response) =>{
      if (response.rowCount == 0)   {
        res.send({info: 0})
     } else {
        res.json({info: response.rowCount , data: response.rows}); 
     }
     if (err) {
       res.status(505).send('Neuspesny dotaz na ulozena menu')
       console.log('Nejde nasypat zpatky vubec zadny radky')
     }
    })
    await client.release()
    

    
   } catch(err) {
      res.status(400).send({
        error: 'Chyba 402 pri pozadavku na zmenu modulu : ${tabname}'
      })
    }
  },
  async delete (req, res , next ) {
    const id = req.query.id
    const dotaz = `delete from list_menu where id = ${id}`
    
    const client = await pool.connect()
    try {
    
    await client.query(dotaz , (err, response) =>   {
      if (err) {
        // res.json({info: 'error', data: '433' }); 
        res.status(505).send('Neuspesne smazani')
      }

    })
    await client.query('select id,nazev,popis from list_menu order by id',(err,response) =>{
      if (response.rowCount == 0)   {
        res.send({info: 0})
     } else {
        res.json({info: response.rowCount , data: response.rows}); 
     }
     if (err) {
       res.status(505).send('Neuspesny dotaz na ulozena menu')
       console.log('Nejde nasypat zpatky vubec zadny radky')
     }
    })
    await client.release()
   } catch (err) {
      res.status(505).send('Neuspesne smazani')
   }
    


  },
  async init (req, res, next) {
    let neco = ''
    const user   = req.body.user
    const nazev  = req.body.nazev
    const popis  = req.body.popis.toString().replace(/'/g,'xxxxx')
    const typ  = req.body.typ
    const data   = JSON.stringify(req.body.data)
    const dotaz = `begin work; insert into  ${tabname} (nazev,popis,items, user_insert ) values ( '${nazev}','${popis}','${data}', '${user}'  )  ; commit` 
    // console.log(dotaz)

    try {
    //  const {login, password} = req.body
        //console.log('\n req:', req.body.user )
        //console.log('\n --------------\n')
        const client = await pool.connect()
        
    
        //client.query(` insert into  list_menu (nazev,popis ) values ( 'bbb','posiln'  ) `  ,[],(err, response ) => { })
        // await client.query( `begin work; insert into  ${tabname} (nazev,popis,items, user_insert ) values ( $1, $2,$3,$4 )`  ,[nazev,popis,data,user] ,(err, response ) => {
         await client.query(` ${dotaz}`  ,[],(err, response ) => {
           if (err) {
             console.log(err, 'aaaa')
           }
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
