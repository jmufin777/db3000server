require('./pgsql')()
module.exports = function() {
    this.pokusnaVec='VL VSE MODUL'
   

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
   
    this.vl_sync = async function(table,res) {
        console.log(query('select 1'))
        query('select 1')
        return new Promise((resolve)=>{
            rew=query(`select vl_sync('${table}');`)
            console.log('VL SyNC ',table , rew )
            resolve(table)

        })
    }
}