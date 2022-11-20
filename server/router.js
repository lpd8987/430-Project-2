// CODE REUSED FROM PREVIOUS HW ASSIGNMENT (WITH NEW COMMENTS)//
const controllers = require('./controllers');
const mid = require('./middleware');

// route the user to various pages depending on the URL
const router = (app) => {
  //GENERATE CSRF TOKEN
  app.get('/getToken', mid.requiresSecure, controllers.Account.getToken);

  //LOGIN
  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);

  //APP
  app.get('/app', mid.requiresSecure, mid.requiresLogin, controllers.App.appPage);

  //SIGNUP
  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);

  //SETTINGS
  app.get('/settings', mid.requiresSecure, mid.requiresLogin, controllers.Account.settingsPage);
  app.post('/changePass', mid.requiresSecure, mid.requiresLogin, controllers.Account.changePass);

  //LOGOUT
  app.get('/logout', mid.requiresLogin, controllers.Account.logout);

  //DEFAULT
  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
};

module.exports = router;
