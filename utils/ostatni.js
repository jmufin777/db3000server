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

      //
      
}