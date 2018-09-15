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

 
const atables = [
    {
        name: 'db_system',
         struct: `
         kod int,
         name text,
         struct text,
         index_name text[],reindex int default 0, initq text
        `,
        index_name: [],
        reindex: 0,
        initq: []
    },
    {

        name: 'list2_barevnost'
        ,struct:  `
        kod int,
        nazev varchar(20)`,
        index_name: [ 
         [ 'kod  ~~~ (kod)','0'],
         [ 'idx  ~~~ (id)','1'],
         [ 'nazev ~~~ (nazev) ','0'] 
        ],
        reindex: 1,
        initq: [`
            insert into list2_barevnost (nazev ) VALUES ('4/0'),('4/4'),('4/1'),('1/0'),('1/1'),('4+W'),('4+W+4');`,
           `update list2_barevnost set kod = id`
        ]

    } ,
    {
        name: 'list2_potisknutelnost'
        ,struct:  `
         kod int,
         nazev varchar(20)`,
        index_name: [ ['kod ~~~ (kod)','0'],['nazev ~~~ (nazev desc) ','0'] ],
        reindex: 1,
         initq: [
            `insert into list2_potisknutelnost (nazev ) VALUES ('NE'),('1/1'),('1/0');`,
            `update list2_potisknutelnost set kod = id ;`
        ]
    }
]

/*

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
*/

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
var dotaz=0                         
var dotazS=''

var status=0
/*
;(async function jarda() {
    const  client = await pool.connect()
    try {
        pool.query(dotaz,(err , res ) => {
            if (err) {
                console.log(err)
                return 
            }

        })
    } catch (err)  {
        console.log('err 2',err )

    }
    client.release()
})()
*/


//waitTill = new Date(new Date().getTime() + 1 * 1000)        
//while(waitTill > new Date()){}
var neco = ''
//;(async function() {

    atables.forEach((el, idx) =>{
        for (let x in el){
            if (x == 'struct'){
                Struktura(el)
                console.log(x)
            }
            if (x == 'index_name'){
                Indexes(el)
                console.log(x)
            }
            

        }
    }   )
    console.log('end')
    return;

//})()

//waitTill = new Date(new Date().getTime() + 1 * 1000)        
//while(waitTill > new Date()){}
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

    
    el.index_name.forEach(index_expr =>{

        if (index_expr[1]==1){
           cq=`create unique index  ${el.name}_${index_expr[0]}` 
        } else {
            cq=`create index  ${el.name}_${index_expr[0]}` 
        }
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

    try{
    status= 0
    tabname = el.name    
    
    dotazS = dotazS0.replace(/~S~S~/g,el.struct)  //Vytvoreni struktury
    dotazS = dotazS.replace(/~~~/g,el.name)

            pool.query(`${dotazS} `, (err, res )=> {
                if (err) {
                    
                    pool.query(`select * from ${el.name} limit 1`, (err2, res2)=>{
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
                    InitQ(el.initq)
                }
                //console.log(el.name, dotazS,idx)
            })
    } catch(e) {
        console.log('Err')
    }

}

async function InitQ(aQ) {
    console.log('InitQ')
    aQ.forEach(qI => {
        pool.query(qI)
        console.log(qI)
    })
}


async function Rules(el) {
    console.log('Rules')
    try{
    status= 0
    tabname = el.name    
    dotaz = dotaz0.replace(/~~~/g,el.name)   //Nastaveni rule
    dotaz = dotaz0.replace(/~~~/g,el.name)   //Nastaveni rule
            pool.query(` ${dotaz} `, (err, res )=> {
                if (err) {
                    console.log('selhani Rule', el.name)
                } else {
                    console.log(' Rule Ok pro',el.name)    
                }
                //console.log(el.name, dotazS,idx)
            })
    } catch(e) {
        console.log('Err')
    }

}



