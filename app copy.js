//const http = require('http');
const express = require('express');
// const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
//const { sequelize } = require('./models');
const config = require('./config/config')
const _ = require('lodash')


const routes = require('./routes/list')
const request = require('request')
const fs = require('fs')

//import * as FormData from 'form-data';
/*
const formData = require("express-form-data");
const os = require("os");
const options = {
    uploadDir: os.tmpdir(),
    autoClean: false   //Zmenit na true !!!! az to pujde
  };
*/
  const multer  = require('multer')

  const upload = multer({ dest: 'uploads/' })  
  var type = upload.single('recfile');




//console.log('1')
const app=express();
/*
app.use(formData.parse(options));
// delete from the request all empty files (size == 0)
app.use(formData.format());
// change the file objects to fs.ReadStream 
app.use(formData.stream());
// union the body and the files
app.use(formData.union());
**/
app.use(express.json({limit: '1500mb'}));
app.use(express.urlencoded({limit: '1500mb'}));

// #app.use(morgan('combined'));
app.use(cors());


// app.use(bodyParser.json());
app.use('/',routes);
/*
app.use((err, req, res, next) =>{
    res.json(err);
});
*/
//const app = require('../app');

//http.createServer(req,)

//require('./routes/routes2')(app)
console.log('Staruju')

/*
app.post('/login', (req, res)=>{
   console.log('Jsi login') 
   res.send({
       message: `Jsi ${req.body.login} a ${req.body.password}  happy and registered `
   });
})
*/
// sequelize.sync()
//     .then(() => {
//         app.listen(config.port )
//         //=> console.log(`Port ${port}`));
//         console.log(`server started on ${config.port}`)
//})

//server.js
 
 
// SET STORAGE
/*
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now())
    }
  })
  */ 
  //var upload = multer({ storage: storage })
  /*
  app.post('/uploadmultiplex', upload.single('myFiles', 12), (req, res, next) => {

    const files = req.body.file
    console.log('nazdra bazar', req.body.file)

    //return
    if (!files) {
      const error = new Error('Please choose files')
      error.httpStatusCode = 400

      return next(error)
    } else {
      console.log(files)
    }
   
      res.send(files)
    
  }),
  */

 app.post('/upload', type, function (req,res) {

  /** When using the "single"
      data come in "req.file" regardless of the attribute "name". **/
  var tmp_path = req.file.path;

  /** The original name of the uploaded file
      stored in the variable "originalname". **/
  var target_path = 'uploads/' + req.file.originalname;

  /** A better way to copy the uploaded file. **/
  var src = fs.createReadStream(tmp_path);
  var dest = fs.createWriteStream(target_path);
  src.pipe(dest);
  src.on('end', function() { res.render('complete'); });
  src.on('error', function(err) { res.render('error'); });

});

app.listen(config.port )
console.log(`Nasloucham na portu ${config.port}`)

module.exports = app;