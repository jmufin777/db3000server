//const {User} = require('../models')
const config = require('../config/config')
const {pool, client } = require('../db')
const _ = require('lodash')
var lErr= false
var  b1 = false;


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

 


 const atables = [





    {   name: 'calc_templates'    //Docasne pridelim mat =  1 pro material, v bodoucnu dodelam vazby na dalsi typy ( doprava, interni, ostatni .... )
            //Sehnat zpusob z ARES
        ,struct:  `
         kod int,
         nazev text,  --text na fakture
         obsah jsonb,
         kcks numeric(15,2) default 0,
         ks int default 0,
         naklad numeric(15,2) default 0,
         marze numeric(15,2) default 0,
         prodej numeric(15,2) default 0,
         marze_pomer numeric(15,2) default 0,
         expedice_datum date,
         expedice_cas time,
         datum TIMESTAMP
         `,
         index_name: [ 
            `idefix  ~~~ (idefix)`,
            `nazev ~~~ (nazev)`
          ],

        reindex: 1,
         initq: [
            `select 1 ;`
        ]
    },

    {   name: 'zak_t_list'    //Docasne pridelim mat =  1 pro material, v bodoucnu dodelam vazby na dalsi typy ( doprava, interni, ostatni .... )
            //Sehnat zpusob z ARES
        ,struct:  `
        cislozakazky             bigint     not null default 0 
        ,vl_rozsah               text             
        ,idefix_firma            bigint     not null 
        ,idefix_firmaosoba       bigint     not null default 0 
        ,nazev                   character varying(255)      
        ,cisloobjednavky         character varying(255)      
        ,datumzadani             timestamp without time zone  
        ,datumexpedice           timestamp without time zone  not null  default d_exp(10)
        ,datumsplatnosti         timestamp without time zone  not null default d_exp(24)
        ,vyrobapopis             text                        
        ,naklad                  integer                     
        ,poznamky                text                        
        ,zamknuto                timestamp                   
        ,idefix_user_lock        bigint                      
        ,odemknuto               date                        
        ,idefix_user_unlock      bigint                      
        ,zamek                   boolean                     
        ,uct_rok                 integer                     
        ,login                   character varying(50)       
        ,vyrobapopis_print       text                        
        ,cislofaktury            character varying(50)       
        ,idefix_obchodnik        bigint      default 0   
        ,idefix_produkce         bigint      default 0   
        ,idefix_last             bigint      default 0   
        ,idefix_nabidka          bigint      default 0   
        ,dodak0                  text        default ''::text 
        ,objednavka0             text        default ''::text 
        ,pdf0                    text        default ''::text 
        ,informace               text      
         `,
         index_name: [ 
            `idefix  ~~~ (idefix)`,
            `cislozakazky  ~~~ (cislozakazky)` ,
            `nazev ~~~ (nazev)`
          ],
         reindex: 1,
         initq: [
            `select 1 ;`
        ]
    },
    {   name: 'nab_t_list'    //Docasne pridelim mat =  1 pro material, v bodoucnu dodelam vazby na dalsi typy ( doprava, interni, ostatni .... )
            //Sehnat zpusob z ARES
        ,struct:  `
         cislonabidky             bigint                  not null default 0 
        ,vl_rozsah               text                           
        ,idefix_firma            bigint                      not null 
        ,idefix_firmaosoba       bigint                      not null default 0 
        ,nazev                   character varying(255)      
        ,cisloobjednavky         character varying(255)      
        ,datumzadani             timestamp without time zone  
        ,datumexpedice           timestamp without time zone   null 
        ,datumsplatnosti         timestamp without time zone   null 
        ,vyrobapopis             text                        
        ,naklad                  integer                     
        ,poznamky                text                        
        ,zamknuto                timestamp                   
        ,idefix_user_lock        bigint                      
        ,odemknuto               date                        
        ,idefix_user_unlock      bigint                      
        ,zamek                   boolean                     
        ,uct_rok                 integer                     
        ,login                   character varying(50)       
        ,vyrobapopis_print       text                        
        ,cislofaktury            character varying(50)       
        ,idefix_obchodnik        bigint      default 0   
        ,idefix_produkce         bigint      default 0   
        ,idefix_last             bigint      default 0   
        ,idefix_nabidka          bigint      default 0   
        ,dodak0                  text        default ''::text 
        ,objednavka0             text        default ''::text 
        ,pdf0                    text        default ''::text 
        ,informace               text      
         `,
         index_name: [ 
            `idefix  ~~~ (idefix)`,
            `cislonabidky  ~~~ (cislonabidky)` ,
            `nazev ~~~ (nazev)`
          ],
         reindex: 1,
         initq: [
            `select 1 ;`
        ]
    },
    {   name: 'zak_t_items'    //Docasne pridelim mat =  1 pro material, v bodoucnu dodelam vazby na dalsi typy ( doprava, interni, ostatni .... )
    //Sehnat zpusob z ARES
        ,struct:  `
        kod int,
        nazev text,  
        obsah jsonb,
        kcks numeric(15,2) default 0,
        ks int default 0,
        naklad numeric(15,2) default 0,
        marze numeric(15,2) default 0,
        prodej numeric(15,2) default 0,
        marze_pomer numeric(15,2) default 0,
        expedice_datum date,
        expedice_cas time,
        datum TIMESTAMP,
        poradi serial,
        idefix_tmp bigint default 0,
        idefix_zak bigint not null,
        idefix_src bigint not null,
        id_src int default 0 ,
        active bool default false,
        idefix_dod bigint default 0,
        idefix_prace bigint default 0,
        faktura text ,
        d_fak timestamp 

        `,
        index_name: [ 
            `idefix  ~~~ (idefix)`,
            `nazev ~~~ (nazev)`
        ],
        reindex: 1,
        initq: [
            `select 1 ;`
        ]
},
{   name: 'nab_t_items'    //Docasne pridelim mat =  1 pro material, v bodoucnu dodelam vazby na dalsi typy ( doprava, interni, ostatni .... )
    //Sehnat zpusob z ARES
        ,struct:  `
        kod int,
        nazev text,  
        obsah jsonb,
        kcks numeric(15,2) default 0,
        ks int default 0,
        naklad numeric(15,2) default 0,
        marze numeric(15,2) default 0,
        prodej numeric(15,2) default 0,
        marze_pomer numeric(15,2) default 0,
        expedice_datum date,
        expedice_cas time,
        datum TIMESTAMP,
        poradi serial,
        idefix_tmp bigint default 0,
        idefix_nab bigint not null,
        idefix_src bigint not null,
        id_src int default 0 ,
        active bool default false,
        idefix_dod bigint default 0,
        idefix_prace bigint default 0,
        faktura text ,
        d_fak timestamp 
        `,
        index_name: [ 
            `idefix  ~~~ (idefix)`,
            `nazev ~~~ (nazev)`
        ],
        reindex: 1,
        initq: [
            `select 1 ;`
        ]
},



]



if (false) {
atables.forEach(e0 => {
    var idx = JSON.stringify(e0.index_name)
    var inittxt = JSON.stringify(e0.initq)
    idx = idx.replace(/"/g,"'")
    //inittxt = inittxt.replace(/'/g,"\\'")
    inittxt = inittxt.replace(/"/g,"$$$")
    console.log(idx)
    //return
    
    
    var cq = 'insert into db_system (name, struct, index_name,initq, reindex) values '
    var cq2=` 
    ('${e0.name}','${e0.struct}'
    ,array${idx}
    ,array${inittxt}
    ,${e0.reindex}
    
     ) `
     cq2=cq2.replace(/array\[\]/g,'null')
     

    var q_all = `${cq} ${cq2}`
    console.log('\n\n',q_all,'\n\n')
    //q_all= 'update db_system set kod = id '
    //return
    pool.query(q_all,(err,res) => {
        if (err){
            console.log('err', q_all)
        }
    })
    console.log('\n\n',q_all,'\n\n')
    //console.log('A:',`'{${e0.index_name}}'`,'\n B: ',cq2)

}
    
);
return
}



var tabname=''
// const client = await pool.connect()
var dotazS0 = `create table ~~~ (id bigserial, idefix bigint default nextval('list2_seq'),
            ~S~S~   ,
            time_insert TIMESTAMP default now(),
            time_update TIMESTAMP default now(),  
            user_insert_idefix int,
            user_update_idefix int
)
`

var dotaz0=`CREATE or replace  RULE log_~~~ AS ON UPDATE TO ~~~
     where row(NEW.*) <> row(OLD.*)
        DO 
        INSERT INTO log_central 
        (idefix, 
        idefix_user,
        db_user,
        tabulka ,
        txt,
        typ,
        cas
        )
        VALUES (
                                    OLD.idefix,
                                    NEW.user_update_idefix,
                                    current_user,
                                    '~~~',
                                    row(OLD.*),
                                    'U',
                                    current_timestamp
                                )`


var dotazD=`CREATE or replace  RULE logdel_~~~ AS ON DELETE TO ~~~
     
        DO 
        INSERT INTO log_central 
        (idefix, 
        idefix_user,
        db_user,
        tabulka ,
        txt,
        typ,
        cas
        )
        VALUES (
                                    OLD.idefix,
                                    OLD.user_update_idefix,
                                    current_user,
                                    '~~~',
                                    row(OLD.*),
                                    'D',
                                    current_timestamp
         )`



//console.log(dotazD)                                
// dotaz0 = dotazD
//return;

//var dotaz=0                         
var dotazS=''

var status=0

//waitTill = new Date(new Date().getTime() + 1 * 1000)        
//while(waitTill > new Date()){}
/*
var neco = ''

//;(async function() {
    var addStruct=[]
    //var changeStruct=[]
    atables.forEach((el, idx) =>{
        addStruct=[]
        changeStruct=[]
        el.struct.split(',').forEach(el21=>{
            while (el21.match(/  /)) {
                el21 = el21.replace(/  /g,' ')

            }
            if (el21.match(/[a-z]/)){
                 el21= el21.replace(/\n/,' ')   
                addStruct.push([`alter table ${el.name} add ${el21}`])
                
            }


            
        })
        addStruct.forEach(el22 => {
            console.log(el22,"\n")
            pool.query(`${el22}`,(err  ,res)=>{
                if (err) {
                    console.log('Vynechavam ', el22)
                } else {
                    console.log('Vkladam  ', el22)
                }
            })
        })
        console.log(addStruct)      


    })
    //console.log(atables[0].struct)
    return
    */

   
   // return
   
    pool.query('select * from db_system',(err,res) => {
//        console.log(res.rows)
        console.log(atables)

   //res.rows.forEach((el, idx) =>{
    
   atables.forEach((el, idx) =>{
        for (let x in el){
            if (x == 'struct'){
                Struktura(el)
                while (!b1) ;
                b1 = false
                StrukturaChange(el)
                while (!b1) ;
                console.log(x)
                b1 = false
            }
            if (x == 'index_name'){
                Indexes(el)
                while (!b1) ;
                b1 = false
                console.log(x)
            }
            if (x == 'initq'){
                RulesD(el)
                while (!b1) ;
                b1 = false
                Rules(el)
                while (!b1) ;
                b1 = false
                console.log(x)
            }
            

        }
    }   )
    console.log('end')
})



    return;

//})()

//waitTill = new Date(new Date().getTime() + 1 * 1000)        
//while(waitTill > new Date()){}

function StrukturaChange(el) {
     var addStruct=[]
    //var changeStruct=[]
    
        addStruct=[]
     //   changeStruct=[]
     el.struct.split('\n').forEach(el21=>{

     //   el.struct.split(',').forEach(el21=>{
            while (el21.match(/  /)) {
                el21 = el21.replace(/  /g,' ')

            }
            if (el21.match(/[a-z]/)){
                 el21= el21.replace(/\n/,' ').replace(/,$/," ")   
                addStruct.push([`alter table ${el.name} add ${el21}`])
                
            }


            
        })
        addStruct.forEach(el22 => {
            console.log(el22,"\n")
            pool.query(`${el22}`,(err  ,res)=>{
                if (err) {
                    console.log('Vynechavam ', el22)
                } else {
                    console.log('Vkladam  ', el22)
                }
            })
        })
        console.log(addStruct)      
        b1 = true
    

}
 function Indexes(el) {
        var cq=''
        var index_name=''

    if (el.reindex == 1)   {
        try {
        pool.query(`select * from pg_indexes where schemaname='public' and tablename ilike '${el.name}'`, (err, res ) =>{
            if (err) {
                console.log('Chyba zjisteni indexu pro ', el.name )
            } else {
                if (res.rowCount > 0){
                    res.rows.forEach(idb=>{
                        try{
                       console.log("--------------\n",idb,"\n\n",
                       `drop index ${idb.schemaname}.${idb.indexname}`,
                       "\n--------------\n",

                       ) 
                       
                        pool.query(`drop index ${idb.schemaname}.${idb.indexname}`, (err,res) =>{
                            if (err){
                                console.log('Selhalo smazani ', `drop index ${idb.schemaname}.${idb.indexname}`)
                            } else {
                                console.log('OK  smazani ', `drop index ${idb.chemaname}.${idb.indexname}`)
                            }
                        })
                    } catch(e) {
                        console.log('pad 22')
                    }
                    })
                

                } else {
                    console.log('Indexy nejsou vytvoreny pro ', el.name )
                }
            }
        })
    } catch(e) {
        console.log('Pad 33')
    }
        
    }

    setTimeout(function(){

    // console.log(el.index_name)
    // return
    console.log(el.index_name,' /n',Array.isArray(el.index_name))
    if (!Array.isArray(el.index_name)){
        return
    }
        
    el.index_name.forEach(index_expr =>{
        
/*
        if (index_expr[1]==1){
           cq=`create unique index  ${el.name}_${index_expr[0]}` 
        } else {
            cq=`create index  ${el.name}_${index_expr[0]}` 
        }
*/
  
             cq=`create index  ${el.name}_${index_expr}` 
  
          cq = cq.replace(/~~~/g,` on ${el.name} `)

        try{
        pool.query(cq,(err,res)=>{
            if (err){
                console.log('ERROR !!! \n Index ',cq, 'jiz je nastaven',err.name, err.routine, res)
            }
        })
    } catch(e) {
        console.log('pad 44')
    }
        //console.log('Indexes: ',cq,  index_expr[0])  
    })
},500)    
b1 = true
}

async function OK(){
    console.log('OK EOF')
}
 
async function Drop(el, idx) {
    var lRet = 'NIC'
    pool.query(`select '${el.name}'`, (err, res) =>{
        if (err){
            lRet = 'X- NELZE'
            return lRet
            console.log('X- nezle smazat', el.name, idx)    
        } else {
            lRet = 'X- Smazano '
            return lRet
            console.log('smazano', el.name, idx)
        }
    })
  
}

async function Struktura(el) {
    console.log('Strukura' , el.name)
    var lRet= -1

    try {
    status= 0
    tabname = el.name    
    
    dotazS = dotazS0.replace(/~S~S~/g,el.struct)  //Vytvoreni struktury
    dotazS = dotazS.replace(/~~~/g,el.name)

    console.log(dotazS)
    


            pool.query(`${dotazS} `, (err, res )=> {
                if (err) {
                    console.log(err)
                    // return
                    
                    pool.query(`select * from ${el.name} limit 1`, (err2, res2)=>{
                        if (err2) {
                            console.log('ERR: ',`select * from ${el.name} limit 1` )
                            return 
                        }   
                        //
                       if (res2.rowCount > 0) {
                            console.log('netreba Init pro', el.name, res2.rowCount)
                        } 
                            else {
                                console.log('Je treba Init Pro', el.name)
                                InitQ(el.initq)
                            }
                    })
                    
                    lRet  = false 
                } else {
                    console.log('Je Treba Init',el.name, el.init)    
                    if (Array.isArray(el.initq)){
                        InitQ(el.initq)    
                    }
                    
                }
                //console.log(el.name, dotazS,idx)
            })
    } catch(e) {
        console.log('Err')
    }
    
    
        //console.log('Nastavuji 11')
        b1 = true;    
        


}

async function InitQ(aQ) {
    console.log('InitQ', aQ)
    if (!Array.isArray(aQ)){
        return
    }
    //return
    var qI1=''
    aQ.forEach(qI => {
        qI1 = qI.trim().replace(/\\n/g,'').trim()
        qI1 = qI1.trim().replace(/\\r/g,'').trim()
   //     console.log("Trim:", qI.trim().replace(/\\n/g,'XXXX'))

        
        pool.query(qI1,(err,res)=>{
            if (err){
                console.log('ERR ',qI1)

            } else {
                console.log(res)
            }
        })
     //   console.log(qI)
    })
}


async function Rules(el) {
    console.log('Rules')
    try{
    status= 0
    tabname = el.name    
    dotaz = dotaz0.replace(/~~~/g,el.name)   //Nastaveni rule
            pool.query(` ${dotaz} `, (err, res )=> {
                if (err) {
                    console.log('selhani Rule', el.name)
                    console.log(dotaz)
                } else {
                    console.log(' Rule Ok pro',el.name)    
                }
                //console.log(el.name, dotazS,idx)
            })
    } catch(e) {
        console.log('Err')
    }
    b1 = true
}

async function RulesD(el) {
    console.log('Rules D')
    try{
    status= 0
    tabname = el.name    
    dotaz = dotazD.replace(/~~~/g,el.name)   //Nastaveni rule
    
            pool.query(` ${dotaz} `, (err, res )=> {
                if (err) {
                    console.log('selhani Rule', el.name)
                    console.log(dotaz)
                } else {
                    console.log(' Rule Ok pro',el.name)    
                }
                //console.log(el.name, dotazS,idx)
            })
    } catch(e) {
        console.log('Err')
    }
    b1 = true

}



