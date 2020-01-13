const { exec } = require('child_process');

module.exports = function() {
    this.slozky_zakazky= '/home/db3000/db/zakazky/'
    this.slozky_thumbs=`/home/db3000/db/thumbs`
    this.slozky_vyroba=`/home/db3000/db/vyroba/`
    this.slozky_mezipamet=`/home/db3000/db/vyroba/mezipamet`
    this.slozky_stroje=`/home/db3000/db/vyroba/stroje`
    this.slozky_zakazky_pdf=`/home/db3000/db/slozky_zakazky_pdf`
    this.slozky_osobni=`/home/db3000/slozky/`
    this.vl_setvzor = function(_item) {
        console.log('VL_SET')
        return 'VLSET'+_item
    }

    this.slozky = async function slozky(){
        //exec('mkdir /home/db3000/slozky -p', (error1, stdout1, stderr1) => {
        //}
        //)  
        exec(`mkdir ${slozky_thumbs} -p`, (error1, stdout1, stderr1) => {
        }
        )  
        exec(`mkdir ${slozky_zakazky} -p`, (error1, stdout1, stderr1) => {
        }
        )  
        exec(`mkdir ${slozky_vyroba} -p`, (error1, stdout1, stderr1) => {
        }
        )  
        exec(`mkdir ${slozky_mezipamet} -p`, (error1, stdout1, stderr1) => {
        }
        )  
        exec(`mkdir ${slozky_stroje} -p`, (error1, stdout1, stderr1) => {
        }
        )  
        exec(`mkdir ${slozky_zakazky_pdf} -p`, (error1, stdout1, stderr1) => {
        }
        )  
      }
      this.k1=function(){
        console.log('k1',slozky_thumbs)
      }

}