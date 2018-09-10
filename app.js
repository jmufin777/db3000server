//const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
//const { sequelize } = require('./models');
const config = require('./config/config')
const _ = require('lodash')


const routes = require('./routes/list')
console.log('1')
const app=express();
// #app.use(morgan('combined'));
app.use(cors());


app.use(bodyParser.json());
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
//     })

app.listen(config.port )
console.log(`I'm listening on port ${config.port}`)

module.exports = app;