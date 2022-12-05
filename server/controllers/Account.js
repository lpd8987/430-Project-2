// CODE REUSED FROM PREVIOUS HW ASSIGNMENT (WITH NEW COMMENTS + ORGANIZATION)//
const models = require('../models');

const { Account } = models;

// RENDER FUNCTIONS//
// renders the login page
const loginPage = (req, res) => {
  if (req.session.account) {
    console.log(req.session.account);
  }
  res.render('login', { csrfToken: req.csrfToken() });
};

// redirect the user to the login (home) page
const logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};

// render the settings page
const settingsPage = (req, res) => {
  res.render('settings', { csrfToken: req.csrfToken() });
};

// CONTROLLER FUNCTIONS//
// login the user by authenticating their credentials
const login = (req, res) => {
  const username = `${req.body.username}`;
  const pass = `${req.body.pass}`;

  if (!username || !pass) {
    return res.status(400).json({ error: 'All fields are required!' });
  }

  return Account.authenticate(username, pass, (err, account) => {
    if (err || !account) {
      return res.status(401).json({ error: 'Wrong username or password!' });
    }

    req.session.account = Account.toAPI(account);
    console.log(req.session.account);

    return res.json({ redirect: '/app' });
  });
};

// add a new user account to the database
const signup = async (req, res) => {
  const username = `${req.body.username}`;
  const pass = `${req.body.pass}`;
  const pass2 = `${req.body.pass2}`;

  if (!username || !pass || !pass2) {
    return res.status(400).json({ error: 'All fields are required!' });
  }

  if (pass !== pass2) {
    return res.status(400).json({ error: 'Passwords do not match!' });
  }

  try {
    const hash = await Account.generateHash(pass);
    const newAccount = new Account({ username, password: hash });
    await newAccount.save();
    req.session.account = Account.toAPI(newAccount);
    return res.json({ redirect: '/app' });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Username already in use.' });
    }
    return res.status(400).json({ error: 'An error occured.' });
  }
};

// Changes user's password
const changePass = async (req, res) => {
  // to change their password, the user must type their old password in
  // then then add/retype their new password
  const { username } = req.session.account;

  const oldPass = `${req.body.oldPassword}`;
  const newPass = `${req.body.newPassword}`;
  const newPass2 = `${req.body.newPassword2}`;

  // Make sure all params are filled out
  if (!oldPass || !newPass || !newPass2) {
    return res.status(400).json({ error: 'Missing required parameters!' });
  }

  // Assuming the user has made it this far, attempt to change the password
  try {
    // get a reference to the current account
    const userAccount = await Account.findOne({ username }).exec();

    // If userAccount is not found, throw an error
    /* Theoretically this should not be triggered if REDIS is working correctly */
    if (!userAccount) {
      throw new Error();
    }

    // set the new password to the new hash
    userAccount.password = await Account.generateHash(newPass);

    // update the entry in the database
    await userAccount.save();

    return res.status(201).json({ redirect: '/logout' });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: 'An error occured.' });
  }
};

// generates a new CSRF token on request
const getToken = (req, res) => res.json({ csrfToken: req.csrfToken() });

module.exports = {
  loginPage,
  login,
  logout,
  signup,
  settingsPage,
  changePass,
  getToken,
};
