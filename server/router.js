// CODE REUSED FROM PREVIOUS HW ASSIGNMENT (WITH NEW COMMENTS)//
const controllers = require('./controllers');
const mid = require('./middleware');

// route the user to various pages depending on the URL
const router = (app) => {
  // GENERATE CSRF TOKEN
  app.get('/getToken', mid.requiresSecure, controllers.Account.getToken);

  // LOGIN
  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);

  // APP
  app.get('/app', mid.requiresSecure, mid.requiresLogin, controllers.App.appPage);
  app.post('/saveScore', mid.requiresSecure, mid.requiresLogin, controllers.App.saveScore);
  app.get('/getCurrentPlayerData', mid.requiresSecure, mid.requiresLogin, controllers.App.getCurrentPlayerData);
  app.get('/getLeaderboardData', mid.requiresSecure, mid.requiresLogin, controllers.App.getLeaderboardData);

  // SIGNUP
  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);

  // SETTINGS
  app.get('/settings', mid.requiresSecure, mid.requiresLogin, controllers.Account.settingsPage);
  app.post('/changeUser', mid.requiresSecure, mid.requiresLogin, controllers.Account.changeUser);
  app.post('/changePass', mid.requiresSecure, mid.requiresLogin, controllers.Account.changePass);
  app.post('/deleteAccount', mid.requiresSecure, mid.requiresLogin, controllers.Account.deleteAccount);
  app.post('/resetHighScore', mid.requiresSecure, mid.requiresLogin, controllers.Account.resetHighScore);

  // LOGOUT
  app.get('/logout', mid.requiresLogin, controllers.Account.logout);

  // DEFAULT
  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);

  // 404 RESULT NOT FOUND
  app.get('*', mid.requiresSecure, controllers.App.notFoundPage);
};

module.exports = router;
