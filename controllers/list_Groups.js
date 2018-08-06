//const {User} = require('../models')
const config = require('../config/config')
const {pool, client } = require('../db')
const tabname = 'list_groups'

module.exports = {
    async all (req, res, next) {
      //var typ   = req.query.typ
      var typ = req.query.typ

      var dotaz = `select * from ${tabname}  order  by id`
      if (typ.match(/[0-9]/i)){
        console.log('Cisla')
        dotaz = `select * from ${tabname}  where id = '${typ}' order by  id limit 1`

      } 
      
    try {
          
        const client = await pool.connect()

         await client.query(`${dotaz}`  ,(err, response) => {

           if (response.rowCount == 0)   {
              // res.send({info: 0})
              res.json({info: 0, data: '433' }); 
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
  async update (req, res , next ){
    const user = req.body.user
    
    const id = req.body.form.Id
    const idefix = req.body.form.IdeFix
    const nazev  = req.body.form.Nazev.toString().replace(/'/g,'xxxxx')
    const popis  = req.body.form.Popis.toString().replace(/'/g,'xxxxx')

    const dotaz = `update list_groups set popis = '${popis}', nazev='${nazev}', user_update='${user}',idefix=${idefix},time_update= now() where id = ${id} `
    console.log(dotaz)
    //res.status(506).send(`Neuspesna zmena id ${id} ${nazev}`)
    
        
    const client = await pool.connect()
    try {
     await  client.query(dotaz,[],(err, response ) => {
      if (err) {
        // res.json({info: 'error', data: '433' }); 
        res.status(506).send(`Neuspesna zmena id ${id} ${nazev}`)
      }

    })

    await client.query('select * from list_groups order by id',(err,response) =>{
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
    const dotaz = `delete from list_groups where id = ${id}`
    
    const client = await pool.connect()
    try {
    
    await client.query(dotaz , (err, response) =>   {
      if (err) {
        // res.json({info: 'error', data: '433' }); 
        res.status(505).send('Neuspesne smazani')
      }

    })
    await client.query('select * from list_groups order by id',(err,response) =>{
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
    let user
    let nazev
    let popis
    let idefix
    let dotaz 

    console.log('Im hyr', req.body.form)
    
    

    

    
    const client = await pool.connect()
    if (req.body.typ == 'all'){
      
        
    
        
      
      await req.body.form.forEach(element => {
          dotaz = `
          with t as (
            delete from list_groups where id= ${element.id} returning nazev,popis,idefix,time_insert,time_update,user_insert,user_update 
            ) 
            insert into list_groups (nazev,popis,idefix,time_insert,time_update,user_insert,user_update)
            select * from t
          `
         client.query(`${dotaz}`,[],(err, response) =>{
           if (err) {
             console.log('Err: ', err)
             return next(err)
           }

         }) 
        
      })
      await client.release() 
      res.json({info:'OK'})
      
      
      return
    }  

    user   = req.body.user
    nazev  = req.body.form.Nazev
    popis  = req.body.form.Popis.toString().replace(/'/g,'xxxxx')
    dotaz = `insert into  ${tabname} (nazev,popis, user_insert ) values ( '${nazev}','${popis}', '${user}'  ) ` 



    try {
    //  const {login, password} = req.body
        //console.log('\n req:', req.body.user )
        //console.log('\n --------------\n')
        
        
    
        client.query(` begin work`  ,[],(err, response ) => { })
         
         await client.query(` ${dotaz}`  ,[],(err, response ) => {
           if (err) {
             console.log(err, 'aaaa')
           }
         })
         await client.query(`update ${tabname} set idefix = id where idefix is null or idefix = 0 `  ,[],(err, response ) => {
          if (err) {
            console.log(err, 'aaaa')
          }
        })
        client.query(` commit `  ,[],(err, response ) => { })         
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

