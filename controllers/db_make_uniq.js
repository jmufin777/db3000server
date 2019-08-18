//const {User} = require('../models')
const config = require('../config/config')
const {pool, client } = require('../db')
const _ = require('lodash')
var lErr= false


async function init(){
    console.log(1)
    await sleep(10000)
    console.log(2)
 }
 function sleep(ms){
     return new Promise(resolve=>{
         setTimeout(resolve,ms)
     })
 }

 
const aUniqIndexes = [
              `select fce_list_mat_clean('')`
             ,`create unique index list_mat_vlastnosti_mat_vlastnost on list_mat_vlastnosti  (idefix_mat,idefix_vlastnost)`
             ,`create unique index list_mat_barva_mat_barva on list_mat_barva  (idefix_mat,idefix_barva)`
             ,`create unique index list_mat_strojskup_mat_strojskup on list_mat_strojskup  (idefix_mat,idefix_strojskup)`
             ,`create unique index list_mat_barva_mat_barva on list_mat_barva  (idefix_mat,idefix_barva)`
             ,`create unique index list_mat_barva_mat_potisknutelnost on list_mat_potisknutelnost  (idefix_mat,idefix_potisknutelnost)`
             ,`create unique index list_mat_stroj_mat_stroj on list_mat_stroj  (idefix_mat,idefix_stroj)`
             ,`create unique index list_mat_rozmer_mat_sir_vyska on list_mat_rozmer(idefix_mat,sirka_mm,vyska_mm)`
             ,`create index list_strojmod_fce_strojmod_idefix  on list_strojmod (fce_strojmod(idefix) ) `
            ,`create unique index zak_t_list_cislozakazky on zak_t_list (cislozakazky) `
            ,`create unique index nab_t_list_cislonabidky on nab_t_list (cislonabidky) `

            
                         

    ]


idx()


async function idx(){
    const client = await pool.connect()
    await aUniqIndexes.forEach((el00 , ix) =>{
        client.query(`${el00}`,(err00  ,res00)=>{
         
         console.log(el00,"ix", ix, err00 )

        })    
    })
       
       
        await client.release()
        console.log("Zaindexovano")     
       
       
       return
    
    
        await console.log('hovnosu')


    

}
    return;

//})()

//waitTill = new Date(new Date().getTime() + 1 * 1000)        
//while(waitTill > new Date()){}

