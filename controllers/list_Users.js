const config = require('../config/config')
const {pool, client } = require('../db/index')
const tabname = 'list_users'
const resObj = {}
var lErr= false
// const {login, password} = req.body
module.exports = {
 async all (req, res, next) {
      var typ = req.query.typ
      var dotaz = `select jmeno||' '|| prijmeni as fullname, * from ${tabname}   where plati >0 order  by id limit 500`
       console.log(req.query)
      // return
      if (typ ) {
      if (typ.match(/[0-9]/i)){
        dotaz = `select * from ${tabname}  where idefix = '${typ}' order by  id limit 1`
      } else if (typ.match(/last/i)){
        var dotaz = `select jmeno||' '|| prijmeni as fullname, * from list_users  where plati >0  order  by maxx(time_insert,time_update) desc limit 500`
      }   else if (typ.match(/neplati/i)){
      var dotaz = `select jmeno||' '|| prijmeni as fullname, * from list_users  where plati =0  order  by maxx(time_insert,time_update) desc limit 500`
    }
    }
      var dotaz_groups = 'select idefix_group, idefix_user from list_groups_users order by idefix_user,idefix_group, id'
      var dotaz_menu = 'select idefix_menu, idefix_user  from list_menu_users order by idefix_user,idefix_menu, id'
      console.log(dotaz)
      const client = await pool.connect()
          
  try {
        console.log('Users all')
 
        await client.query(`${dotaz}`  ,(err, response) => {
          if (err) {
            lErr=true
            console.log(err)
            //  res.status(599).send({
            //    error: 'chyba users'
            //  })

            return next(err)
          }
         if (response.rowCount == 0)   {
           res.json({info: 0, data: '433' }); 
           lErr = true
           console.log('\n\nTady ?? \n\n')
        } else {
           resObj.info = 1
           neco =response.rows  
           resObj.data= response.rows 
        }
    
       })


       if (lErr) return
       
       await client.query(`${dotaz_menu}`  ,(err, response) => {
        if (lErr) return
        if (err) {
          lErr = true
          console.log(err)
           return next(err)
         } 
        resObj.info = 2
        neco =response.rows  
        resObj.dataMenu= response.rows 
        console.log('Menu :3 : ',response.rowCount)
        console.log('\n\nTady 3 ?? \n\n')
       
      })
      if (lErr) return
       await client.query(`${dotaz_groups}`  ,(err, response) => {
        if (lErr) return
        if (err) {
          lErr=true
           console.log(err)
            return next(err)
          } 
        resObj.info = 3
        neco =response.rows  
        resObj.dataGroups= response.rows 
        
        res.json({info:1, data: resObj.data , dataGroups: resObj.dataGroups, dataMenu: resObj.dataMenu  })
        
        console.log('Menu :3 : Users komplet ',response.rowCount)
      })
       await client.release() 
   } catch (err) {
       console.log(err)
       res.status(400).send({
         error: 'Chyba 002 pri pozadavku na databazi : ${tabname}'
       })
   }
  },
  async updateMenus(req, res ,next) {
    console.log('jsem tu 1', req.body.form.items)
   
    console.log(Math.round(Math.random()*10000000000))
    const tmpTable = 'tmp_u_' +Math.round(Math.random()*10000000000)
    console.log(tmpTable)
    
    const qdel = `delete from list_menu_users where idefix_user = ${req.body.form.idefix} `
    
    const qtest = `select '${req.body.user}' as user_insert,${req.body.form.idefix} as idefix_user,unnest(array[${req.body.form.items}])  as idefix_menu`
    const q1 = `create table ${tmpTable} without oids as ${qtest}`
    const qinsert= `insert into list_menu_users (user_insert,idefix_user,idefix_menu) select * from ${tmpTable}`
    

    const client = await pool.connect()
    console.log (qtest)
    await client.query(qdel, [], (err, result)=> {
      if (err) {
        console.log(err)
        return next.err
      }
    })
    if ( !req.body.form.items >  0 ) {
        res.json({info: -1})
        await client.release()
        return
    }
    await client.query(q1, [], (err, result)=> {
      if (err) {
        console.log(err)
        return next.err
      }
    })

    await client.query(qinsert, [], (err, result)=> {
      if (err) {
        console.log(err)
        return next.err
      }
    })
    await client.query(`drop table ${tmpTable}`, [], (err, result)=> {
      if (err) {
        console.log(err)
        return next.err
      }
    })

    
    await client.release()
    res.json({info: -1})
 //   select * from list_menu_groups;
 // id | idefix_menu | idefix_group | menu_name | group_name | time_insert | time_update | user_insert | user_update 

  },
  async updateGroups(req, res ,next) {
    console.log('jsem tu 1', req.body.form.items)
    

    
    console.log(Math.round(Math.random()*10000000000))
    const tmpTable = 'tmp_gu_' +Math.round(Math.random()*10000000000)
    console.log(tmpTable)

    
    
    const qdel = `delete from list_groups_users where idefix_user = ${req.body.form.idefix} `
    
    const qtest = `select '${req.body.user}' as user_insert,${req.body.form.idefix} as idefix_user,unnest(array[${req.body.form.items}])  as idefix_group`
    const q1 = `create table ${tmpTable} without oids as ${qtest}`
    const qinsert= `insert into list_groups_users (user_insert,idefix_user,idefix_group) select * from ${tmpTable}`
    const qstart='begin work'
    const qend='commit'
    

    const client = await pool.connect()

    console.log (qtest)
    await client.query(qstart)
    await client.query(q1, [], (err, result)=> {
      if (err) {
        console.log(err)
        return next.err
      }
    })
    
    try {
    
    console.log(qdel)
    await client.query(qdel,  (err, result)=> {
      if (err) {
        console.log(err)
        return next.err
      }
    })
    
    if ( !req.body.form.items >  0 ) {
        res.json({info: -1})
        await client.release()
        return
    }
    

    await client.query(qinsert, [], (err, result)=> {
      if (err) {
        console.log(err)
        return next.err
      }
    })
    await client.query(`drop table ${tmpTable}`, [], (err, result)=> {
      if (err) {
        console.log(err)
        return next.err
      }
    })
    await client.query(qend)
   
    await client.release()
    res.json({info: 1})
  } catch(e) {
    res.status(460).send({
      error: 'Transakce pri ukladani poradi zhavarovala'
    })
  }
 //   select * from list_menu_groups;
 // id | idefix_menu | idefix_group | menu_name | group_name | time_insert | time_update | user_insert | user_update 

  },
  async update (req, res , next ){
    const user = req.body.user
    const id = req.body.form.Id
    const idefix = req.body.form.IdeFix
  },
  async delete (req, res , next ) {
    const id = req.query.id
    // const dotaz = `delete from list_users where idefix = ${id}`
    // const client = await pool.connect()
  },
  async loginExists (req, res, next ) {
    const user = req.body.user
    var typ = req.query.typ
    const dotaz = `select jmeno||' '|| prijmeni as fullname,* from list_users where login = '${typ}'`
    try {
    const client = await pool.connect()
    await client.query(dotaz,(err, result) => {
      res.json({info: result.rowCount, data: result.rows})
      console.log('res',result.rowCount)

    })
     await client.release() 
   } catch(e){
     res.status(491).send({
       error: 'Nelze zjistit dostupnost loginu'
     })
   }

  },

  async init (req, res, next) {
    const user = req.body.user
    var x
    var  dotaz =''
    var keys = ''
    var values =''
    var lZmena = false
    console.log('tag', 'jsme tuuuu ', req.body)
    //Oprava dat
    for( x in req.body.form) {
      if (x == 'level' ){
        req.body.form[x] = (req.body.form[x] == true ) ?3 :1
      }
      if (x == 'zobraz' || x== 'plati' ){
        req.body.form[x] = (req.body.form[x] == true ) ?1 :0
      }
      if (x == 'heslo' && req.body.form[x] <' ')  {
        continue
      }

    }
    if (req.body.typ == -1) {
      for( x in req.body.form) {

        if (x == 'heslo' && req.body.form[x] <' ')  {
          continue
        }
        if (x == 'heslo2') {
          continue
        }
        

        if (keys>'') keys+=', '
        if (values>'') values +=', '
        

         keys += x
         if (x == 'heslo') {
          values +=`md5('${req.body.form[x]}')`  
        } else {
         values +=`'${req.body.form[x]}'` 
        }
      }
      if (keys > '') { 
        lZmena = true
        keys+=',user_insert'
        values+=`,'${user}'`
      }
      dotaz = `insert into list_users ( ${keys}) values ( ${values});
        update list_users set idefix = id+10000 where idefix = -1;
        update list_users set jmeno = login, prijmeni='' where coalesce(coalesce(jmeno,prijmeni),'') <' '
      `
    }   
      if (req.body.typ > 0) {
        
        for ( x in req.body.form ){

          if (x == 'heslo' && req.body.form[x] <' ')  {
            continue
          }
          if (x == 'heslo2') {
            continue
          }

          if (keys>'') keys+=', '
          if (x == 'heslo') {
            keys += x +' = ' + `md5('${req.body.form[x]}')`  
          } else {
           keys += x +' = ' + `'${req.body.form[x]}'`  
          }
        }
        if (keys > '') { 
          lZmena = true
          keys += ',user_update' +' = ' + `'${user}'`  
          keys += ',time_update = now()'  
        }  
         dotaz = `update list_users set ${keys}  where idefix = ${req.body.typ} ; update list_users set idefix = id where idefix = -1;
          update list_users set jmeno = login, prijmeni='' where coalesce(coalesce(jmeno,prijmeni),'') <' '`
    }


    console.log(dotaz)
    //res.status(500).send({'info':'Potize'})
    // return
    if (lZmena == false) {
       res.end() 
       return

    }

      dotaz=dotaz.replace(/'null'/g,"''")
      // dotaz.replace('null','')

    try {
    const client = await pool.connect()
    await client.query(dotaz, (err, response) =>{
        if (err) {
          console.log('errr', err)
          return next(err)
        }
        
        res.json({info:1})
    })
    

    await client.release()
    } catch (e) {

    }



    /*
    this.form.idefix = dlgPar.form.idefix
    this.form.jmeno = dlgPar.form.jmeno
    this.form.prijmeni = dlgPar.form.prijmeni
    this.form.plati_od = dlgPar.form.plati_od
    this.form.plati_do = dlgPar.form.plati_do
    this.form.zobraz = (dlgPar.form.zobraz > 0)
    this.form.plati = (dlgPar.form.plati > 0)
    this.form.level = (dlgPar.form.level == 3 )
    this.form.telefon = dlgPar.form.telefon
    this.form.telefon2 = dlgPar.form.telefon2
    this.form.email = dlgPar.form.email
    this.form.ulice = dlgPar.form.ulice
    this.form.obec = dlgPar.form.obec
    this.form.psc = dlgPar.form.psc
    */

  }    


}
