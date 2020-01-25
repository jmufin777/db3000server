const { exec } = require("child_process");
const moment = require("moment");

module.exports = function() {
  this.k3 = function() {
    console.log("k1", slozky_thumbs);
    slozky_thumbs = "z k2 zase";
  };

  this.sleep = function sleep(ms) {
    return new Promise(resolve => {
      setTimeout(resolve, ms);
    });
  };
  //Cas
  this.datum5 = function datum5(value) {
    var neco = "";
    try {
      neco = moment(String(value)).format("YYMMDDhhmm"); //hhmm
    } catch (e) {
      console.log("Chybka xxxx", e);
    }
    return neco;
  };

  this.datum = function  datum(value) {
    return moment(String(value)).format("MM/DD/YYYY");
  };
  this.datum2 = function  datum2(value) {
    return moment(String(value)).format("MM.DD.YY hh:mm");
  };
  this.datum20 = function  datum20(value) {
    return moment(String(value)).format("DD.MM.YYYY hh:mm:ss");
    //return moment(String(value)).format('MM.DD.YYYY')
  };
  this.datum200 = function  datum200(value) {
    return moment(String(value)).format("YYYYMMDD hh:mm:ss");
    //return moment(String(value)).format('MM.DD.YYYY')
  };
  this.datum201 = function  datum201(value) {
    return moment(String(value)).format("DD.MM.YYYY hh:mm:ss");
    //return moment(String(value)).format('MM.DD.YYYY')
  };
  this.datum3 = function  datum3(value) {
    return moment(String(value)).format("DD.MM.YYYY");
  };

  this.datum4 = function  datum4(value) {
    return moment(String(value)).format("YYYYMMDD");
  };
  this.datum5 = function  datum5(value) {
    return moment(String(value)).format("YYYYMMDDhhmm");
  };
  this.obdobi = function obdobi(value) {
    return moment(String(value)).format("YYYYMM");
  };
  this.cas3 = function cas3(value) {
    return value.substring(0, 5);
  };
  this.dnes= function dnes() {
    var xd = new Date();
    //var m =  ("0"+""+xd.getMonth()+"").slice(-2)
    //var d =  ("0"+""+xd.getDay()+"").slice(-2)
    var m = ("0" + "" + (xd.getMonth() * 1 + 1) + "").slice(-2);
    var d = ("0" + "" + xd.getDate() + "").slice(-2);
    //this.Alert2(xd.getFullYear()+"."+m +"."+ d, xd )

    return xd.getFullYear() + "." + m + "." + d;
    // return this.datum(xd)
  };

  this.isZak = function(cstring = "") {
    lRet = false;
    if (cstring.match(/calc_my_.*zak/)) {
      lRet = true;
    }
    return lRet;
  };
  this.isNab = function(cstring = "") {
    lRet = false;
    if (cstring.match(/calc_my_.*nab/)) {
      lRet = true;
    }
    return lRet;
  };

  this.getIdefix = function(cstring = "") {
    ar = cstring.split("_");
    nRet = -1;
    if (ar.length > 3) {
      if (ar[2].match(/[0-9]{1,20}/)) nRet = ar[2] * 1;
    }
    return nRet;
  };

  //
};
