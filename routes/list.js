const { Router } = require('express');
const pool = require('../db');
const router = Router();

const AuthenticationController = require('../controllers/AuthController')
const list2Barevnost = require('../controllers/list2_barevnost')
const listUsers = require('../controllers/list_Users')
const listModules = require('../controllers/list_Modules')
const listMenu = require('../controllers/list_Menu')
const listGroup = require('../controllers/list_Groups')
const listUsers1 = require('../controllers/list_Users1')


router.post('/login', 
    AuthenticationController.login)


router.get('/list2_barevnost',
    list2Barevnost.all)

router.get('/list_modules',
    listModules.all)

router.post('/list_modules',
    listModules.init)       
router.put('/list_modules/:id',
    listModules.update)           
router.delete('/list_modules/:id',
    listModules.delete)         
router.get('/list_modules',
    listModules.all)
router.get('/list_modules_used_in_menu',
    listModules.usedInMenu)    

router.post('/list_menu',
    listMenu.init)       
router.put('/list_menu/',
    listMenu.update)           
router.delete('/list_menu',
    listMenu.delete)    
router.get('/list_menu',
    listMenu.all)             


router.get('/list_users',
    listUsers.all)

router.get('/list_users1',
    listUsers1.all)

router.get('/:id', (request, response, next)=>{
    const { id } = request.params ;
    pool.query('Select * from monsters where id=$1',[id], (err, res) =>{
        if (err) return next(err);
        response.json(res.rows);
    });
});

router.post('/', (request, response, next)=>{
    const { name , personality } = request.body;
    pool.query(
         'insert into monsters (name, personality)     values   ($1,$2)  ',
         [name, personality ],
         (err, res) => {
             if (err) return next(err);

             response.redirect('/monsters');
         }
    );
});


router.put('/:id', (request, response, next)=>{
    const { id } = request.params ;
    const { name , personality} = request.body ;

    const keys = ['name' , 'personality'];

    const fields = [];

    keys.forEach(key => {
            if (request.body[key]) fields.push(key);

    });

    fields.forEach((field, index ) => {
        pool.query(
            `Update monsters set ${field} = $1  where id = ($2)  `
            ,[ request.body[field], id ],
            (err, res) =>{
                if (err) return next(err);
    
                if (index === fields.length -1 ) response.redirect('/monsters');
            }
        )
    });

    });

    router.delete("/:id", (request, response, next)=> {
        const { id }  = request.params ;
        pool.query('DELETE FROM monsters where id = ($1)', [id], (err,res) => {
            if (err) return next(err);
                response.redirect('/monsters');
        });
    });

module.exports = router ;