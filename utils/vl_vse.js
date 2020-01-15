require('./pgsql')()
require('./ostatni')()
module.exports = function() {
    this.pokusnaVec='VL VSE MODUL'
    console.log('aaa')

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