require('./pgsql')()
require('./ostatni')()

module.exports = function() {
    this.pokusnaVec='VL VSE MODUL'
    
    console.log('aaa')
    
    this.create_tmp_zak = async function create_tmp_zak(cTable='tmp',idefix_zak=0) {
        cRet=''
        cQ=''
        ceho='zak'
        return new Promise((resolve)=>{
            ifx_aktivni = idefix_zak
            cQ=''
            cQ =`drop sequence if exists ${cTable}_seq cascade;`
            cQ +=`drop table if exists ${cTable} ;`
            cQ+= `create table  ${cTable} without oids as select * from ${ceho}_t_items where idefix_zak=${ifx_aktivni};`
            cQ+=`create sequence ${cTable}_seq;`
            cQ+=`alter table  ${cTable}  alter column id set default nextval('${cTable}_seq'::regclass ); `
            cQ+=`alter table  ${cTable}  alter column idefix set default  nextval('list2_seq'::regclass); `
            row=query(`${cQ}`)
            console.log(cQ)
            resolve(cRet)
        }
        )    
    }

    this.create_tmp_nab = async function create_tmp_nab(cTable='tmp',idefix_nab=0) {
        cRet=''
        cQ=''
        ceho='nab'
        return new Promise((resolve)=>{
            ifx_aktivni = idefix_nab
            cQ =`drop table if exists ${cTable} ;`
            cQ =`drop sequence if exists ${cTable} ;`
            cQ+= `create table  ${cTable} without oids as select * from ${ceho}_t_items where idefix_zak=${ifx_aktivni};`
            cQ+=`create sequence ${cTable}_seq;`
            cQ+=`alter table  ${cTable}  alter column id set default nextval('${cTable}_seq'::regclass ); `
            cQ+=`alter table  ${cTable}  alter column idefix set default  nextval('list2_seq'::regclass); `
            row=query(`${cQ}`)
            console.log(cQ)
            resolve(cRet)
        }
        )    
    }

       
       
       

    this.get_zak_last = async function get_zak_last(idefix_user) {
        cRet=''
        
        return new Promise((resolve)=>{
            row=query(`select idefix_zak,idefix_item,obrazovka from zak_log_open where idefix_user=${idefix_user} order by  cas desc limit 1;`)
            if (row.length>0){
                cRet =  row[0]
                //row[0].a.replace(/\{|\}/g,'')   
            }
            console.log(cRet)

            resolve(cRet)
        }
        )    
    }
    this.vl_list = async function vl_list(idefix_zak=0) {
        cRet=''
        return new Promise((resolve)=>{
            row=query(`select array(select idefix from (select idefix,datumodeslani,vl_znacka from zak_t_vl_v where idefix_zak = ${idefix_zak} and status = 1 order by datumodeslani ) a )::text a `)
            if (row.length>0){
                cRet =  row[0].a.replace(/\{|\}/g,'')   
            }
            //console.log(cRet)

            resolve(cRet)
        }
        )    
    }

    this.vl_set = async function(idefix_zak=0,idefix_item=0,table='',user=0,res) {
        return new Promise((resolve)=>{
            var ifx =    idefix_item
            if (idefix_zak>0 ) {
                console.log('huhu')
            } else {
                idefix_zak = idefixZak(ifx)
            }
            query(`select vl_set(${idefix_zak}, ${ifx})`)
            query(`select vl_set(${idefix_zak}, -1)`)
            // Zavolat vzdy s -1 pakjste - aby seaktualizovala ciselna rada
            console.log('VL SET VSE MODU L',idefix_zak,idefix_item,table,user )
            resolve(1)

        })
    }

    this.vl_unset = async function(idefix_zak=0,idefix_item=0,table='',user=0,res) {
        return new Promise((resolve)=>{

            var ifx =    idefix_item
            if (idefix_zak>0 ) {
                console.log('huhu')
            } else {
                idefix_zak = idefixZak(ifx)
            }
            q2=`update ${table} set status = 2 where idefix=${ifx} `
            query(q2)                
            q2=`    update zak_t_items set status = 2 where idefix=${ifx} `
            query(q2)                
            q2=`    update zak_t_vl_v set datumvraceni=now(),idefix_vratil=${user},poradi2=0,status=2 where  idefix_item=${ifx} `
            query(q2)                
            query(`select vl_set(${idefix_zak},-1)`)
            //presun do mezi pameti
            console.log('VL UNSET //presun do mezi pameti ',idefix_zak,idefix_item,table,user )
            resolve(1)

        })
    }
    this.vl_copy  = async function(user,table,idefix_item,q) {
        console.log("VL-COPY : " , user,table ,idefix_item,q)
        query(q.q1)
        console.log(1)
        query(q.q2)
        console.log(2)
        if (isZak(table)){
            console.log(3)
            vl_sync(table)
        }
        console.log(4)
        query(q.q3)
        console.log("LAST ", idefixLast(table))
        this.vl_droppriloha(table,idefixLast(table))
        console.log("Priloha del ", idefixLast(table))

        
    }
   
    this.vl_sync = async function(table,res) {
        console.log(query('select 1'))
        query('select 1')
        return new Promise((resolve)=>{
            rew=query(`select vl_sync('${table}');`)
            console.log('VL SyNC ',table , rew )
            resolve(table)

        })
    }
    this.vl_droppriloha = async function(table,idefix=0,nPriloha=1,res) {
        return new Promise((resolve)=>{
            isZmena=false
            //row=query(`select obsah from calc_my_9_zak959878983 where idefix>=14078833`)
            row=query(`select idefix,obsah,obsah::text>'' as isobsah from ${table} where idefix=${idefix} `)
            if (row.length>0) {
                row.forEach((el,idx)=>{
                    if (el.isobsah==true){
                        el.obsah.forEach((elO,idxO)=>{
                            if (nPriloha==1){
                                console.log('el O:',elO.data.Priloha1Idefix)  
                                if (elO.data.Priloha1Idefix>0){
                                    elO.data.Priloha1Idefix=0
                                    elO.data.Priloha1Txt=''
                                    isZmena=true
                                }
                                console.log('el O:',elO.data.Priloha1Idefix)
                            }
                            
                        })
                        query(`update ${table} set obsah='${JSON.stringify(el.obsah)}' where idefix=${el.idefix}`)
                        
                    }

                    
                })
                
                

            }


            console.log('VL DROPPRILOHA ',table , row.length )
            resolve(table)

        })
        //select obsah from calc_my_9_zak959878983 where idefix=14078833
    }


}
//14078833
//calc_my_9_zak959878983