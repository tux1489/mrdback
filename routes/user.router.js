const express = require('express');
const authCtrl = require('../controllers/auth.controller');
const carCtrl = require('../controllers/car.controller');
const generalCtrl = require('../controllers/general.controller');
const authMiddleware = require('../middlewares/auth.middleware')

module.exports = (app) => {
   let apiRoutes = express.Router();

   apiRoutes.get('/', function (req, res) {
      res.json({
         message: 'Welcome to our api'
      });
   });

   /* AUTH */
   apiRoutes.post('/signup', authCtrl.signup);
   apiRoutes.post('/signin', authCtrl.signin);
   apiRoutes.post('/oauth/facebook', authCtrl.accountsFacebook);
   apiRoutes.post('/oauth/google', authCtrl.accountsGoogle);

   /* CARS */
   apiRoutes.post('/cars', authMiddleware.authenticate, carCtrl.add);
   apiRoutes.delete('/cars', authMiddleware.authenticate, carCtrl.remove);
   apiRoutes.get('/cars', authMiddleware.authenticate, carCtrl.list);

   /* SETTINGS */
   apiRoutes.patch('/cars/favorite', authMiddleware.authenticate, carCtrl.setFavorite);


   /* CONSTANTS */
   apiRoutes.get('/constants', generalCtrl.constants);

   app.use('', apiRoutes);
}

