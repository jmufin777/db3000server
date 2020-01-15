const { exec } = require('child_process');
const moment = require('moment');

module.exports = function() {

    this.k3=function(){
        console.log('k1',slozky_thumbs)
        slozky_thumbs='z k2 zase'

      }

      this.sleep=function sleep(ms){
        return new Promise(resolve=>{
            setTimeout(resolve,ms)
        })

      
      }
//Cas
      this.datum5 = function datum5(value) {
        var neco = ''
        try {
          neco= moment(String(value)).format('YYMMDDhhmm') //hhmm
        } catch (e) {
          console.log("Chybka xxxx" , e)
        }
        return neco
      }  

      this.isZak= function (cstring='') {
        lRet=false
        if (cstring.match(/calc_my_.*zak/)) {
            lRet=true
        }
        return lRet
    }
    this.isNab= function (cstring='') {
        lRet=false
        if (cstring.match(/calc_my_.*nab/)) {
            lRet=true
        }
        return lRet
    }

    this.getIdefix= function(cstring='') {
      ar=cstring.split('_')
      nRet = -1
      if (ar.length>3) {
          if (ar[2].match(/[0-9]{1,20}/))
          nRet=ar[2]*1
     }
      return nRet
  }

      //
      
}