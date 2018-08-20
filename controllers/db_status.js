const config = require('../config/config')
const {pool, client } = require('../db/index')
const tabname = 'list_users'
const resObj = {}
var lErr= false
// const {login, password} = req.body
module.exports = {
 async all (req, res, next) {
    const {idefix} = req.body
     dotaz = `select max_conn,pouzito,res_for_super,max_conn-pouzito-res_for_super res_for_normal
     from
       (select count(*) -1  as pouzito  from pg_stat_activity) t1,
       (select setting::int res_for_super from pg_settings where name=$$superuser_reserved_connections$$) t2,
       (select setting::int max_conn from pg_settings where name=$$max_connections$$) t3`
       
        
       // console.log('Db-Status XXX---- \n\n', idefix ," EOF")
       try {
        const client =  await pool.connect()
        await client.query(`update  list_users_sessions set t_last = now() where ${idefix} > 0 and idefix= ${idefix} and id in 
        (select id from list_users_sessions where idefix = ${idefix} order by  id desc limit 1)`)
        await client.query(dotaz,(err,result) => {
            if (err) {
                return next(err)
            }
            
            if (result.rowCount>0){
                res.json({info:'1', data: result.rows[0]})
            } else {
                res.json({info:'0 ', data: []})
            }
            
        })
        //await client.query(`insert into list_users_sessions (idefix) values (${idefix})`
        

        await client.release()

       } catch (e){
           res.status(555).send({error: 'Chyba pro zjisteni statistik pg'});
       }

       
 },
 async who(req, res, next) {
     const dotaz = `select 
     distinct on (idefix)
     fce_user_fullname(idefix) as kdo,t_login::timestamp(0)::text as start,(now() - t_login)::interval(0)::text as delka, (t_last::time(0))::text as naposled from list_users_sessions 
     where t_logout is null and t_last > now() + '- 60sec'::interval 
     and idefix > 0

     order by idefix, id desc
     `
     const client = await pool.connect()
     try {

        
     await client.query(dotaz, (err, response) => {
         if (err) {
             lErr = true
             return next(err)
              
         }
         res.json({info: response.rowCount, data: response.rows})
    
     })
     await client.release()
    } catch(err) {
        response.status(556).send({error: 'Nelze zjistit prihlasene lidi'})
    }
 }

 }      

