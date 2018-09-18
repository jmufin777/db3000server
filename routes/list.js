const { Router } = require('express');
//const pool = require('../db');
const router = Router();

const AuthenticationController = require('../controllers/AuthController')
//Pomocne seznamy
const list2Barevnost = require('../controllers/list2_barevnost')
const list2Potisknutelnost = require('../controllers/list2_Potisknutelnost')
const list2StrojSkup = require('../controllers/list2_StrojSkup')
const list2MatSkup = require('../controllers/list2_matskup')
const list2MatSubSkup = require('../controllers/list2_matsubskup')
const list2MatDostupnost = require('../controllers/list2_MatDostupnost')
const list2MatDodavatel = require('../controllers/list2_MatDodavatel')
const list2MatVyrobce = require('../controllers/list2_MatVyrobce')
const list2MatSirka = require('../controllers/list2_matsirka')


//System 
const DBsystem =    require('../controllers/DBsystem')

//Administrace
const listUsers =   require('../controllers/list_Users')
const listModules = require('../controllers/list_Modules')
const listMenu   =  require('../controllers/list_Menu')
const listGroups =  require('../controllers/list_Groups')
const listUsers1 =  require('../controllers/list_Users1')

const dbStatus =    require('../controllers/db_status')



router.post('/login', 
    AuthenticationController.login)
router.post('/list_users-logout', 
    AuthenticationController.logout)    
router.post('/login-update', 
    AuthenticationController.loginUpdate)    
router.post('/login-menu-update', 
    AuthenticationController.userMenu)        

router.get('/list2_barevnost',
    list2Barevnost.all)
router.post('/list2_barevnost',
    list2Barevnost.insert) 
router.put('/list2_barevnost',
    list2Barevnost.update)     
router.delete('/list2_barevnost',
    list2Barevnost.delete)     


router.get('/list2-potisknutelnost',
    list2Potisknutelnost.all)
router.post('/list2-potisknutelnost',
    list2Potisknutelnost.insert) 
router.put('/list2-potisknutelnost',
    list2Potisknutelnost.update)     
router.delete('/list2-potisknutelnost',
    list2Potisknutelnost.delete)     


router.get('/list2-strojskup',
    list2StrojSkup.all)
router.post('/list2-strojskup',
    list2StrojSkup.insert) 
router.put('/list2_barevnost',
    list2StrojSkup.update)     
router.delete('/list2-strojskup',
    list2StrojSkup.delete)    

router.get('/list2-matskup',
    list2MatSkup.all)
router.post('/list2-matskup',
    list2MatSkup.insert) 
router.put('/list2-matskup',
    list2MatSkup.update)     
router.delete('/list2-matskup',
    list2MatSkup.delete)        

router.get('/list2-matsubskup',
    list2MatSubSkup.all)
router.post('/list2-matsubskup',
    list2MatSubSkup.insert) 
router.put('/list2-matsubskup',
    list2MatSubSkup.update)     
router.delete('/list2-matsubskup',
    list2MatSubSkup.delete)        

router.get('/list2-matdostupnost',
    list2MatDostupnost.all)
router.post('/list2-matdostupnost',
    list2MatDostupnost.insert) 
router.put('/list2-matdostupnost',
    list2MatDostupnost.update)     
router.delete('/list2-matdostupnost',
    list2MatDostupnost.delete)        

router.get('/list2-matdodavatel',
    list2MatDodavatel.all)
router.post('/list2-matdodavatel',
    list2MatDodavatel.insert) 
router.put('/list2-matdodavatel',
    list2MatDodavatel.update)     
router.delete('/list2-matdodavatel',
    list2MatDodavatel.delete)        

router.get('/list2-matvyrobce',
    list2MatVyrobce.all)
router.post('/list2-matvyrobce',
    list2MatVyrobce.insert) 
router.put('/list2-matvyrobce',
    list2MatVyrobce.update)     
router.delete('/list2-matvyrobce',
    list2MatVyrobce.delete)        

router.get('/list2-matsirka',
    list2MatSirka.all)
router.post('/list2-matsirka',
    list2MatSirka.insert) 
router.put('/list2-matsirka',
    list2MatSirka.update)     
router.delete('/list2-matsirka',
    list2MatSirka.delete)        

router.get('/db-system',
    DBsystem.all)
router.post('/db-system',
    DBsystem.insert) 
router.put('/db-system',
    DBsystem.update)     
router.delete('/db-system',
    DBsystem.delete)        

router.get('/list_modules',
    listModules.all)
router.post('/list_modules',
    listModules.init)       
router.put('/list_modules/',
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

router.post('/list_groups',
    listGroups.init)       
router.put('/list_groups/',
    listGroups.update)           
router.put('/list_groups-menus/',
   listGroups.updateMenus)           
router.put('/list_groups-modules/',
   listGroups.updateModules)              
router.delete('/list_groups',
    listGroups.delete)    
router.get('/list_groups',
    listGroups.all)        

router.post('/list_users',
    listUsers.init)        
router.get('/list_users',
    listUsers.all)    
router.put('/list_users/',
    listUsers.update)           
router.put('/list_users-menus/',
   listUsers.updateMenus)           
router.put('/list_users-groups/',
   listUsers.updateGroups)              
router.delete('/list_users',
    listUsers.delete)    
router.get('/list_users-login-exists',
    listUsers.loginExists)    
        
router.post('/db-status',
    dbStatus.all)    
router.post('/db-status-who',
    dbStatus.who)        
    






router.get('/list_users1',
    listUsers1.all)

/*
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
*/

/*
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
*/

module.exports = router ;