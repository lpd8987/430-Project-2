// CODE REUSED FROM PREVIOUS HW ASSIGNMENT (WITH NEW COMMENTS)//
// Mark a page as requiring successful login to access
const requiresLogin = (req, res, next) => {
  if (!req.session.account) {
    return res.redirect('/');
  }
  return next();
};

// Mark a page as requiring successful logout to access
const requiresLogout = (req, res, next) => {
  if (req.session.account) {
    return res.redirect('/maker');
  }
  return next();
};

// Mark a page as requiring authentication to access
const requiresSecure = (req, res, next) => {
  if (req.headers['x-forwarded-proto'] !== 'https') {
    return res.redirect(`https://${req.hostname}${req.url}`);
  }
  return next();
};

// Mark a page as not needing authentication to access
const bypassSecure = (req, res, next) => {
  next();
};

// Export functions depending on the NODE_ENV
module.exports.requiresLogin = requiresLogin;
module.exports.requiresLogout = requiresLogout;

if (process.env.NODE_ENV === 'production') {
  module.exports.requiresSecure = requiresSecure;
} else {
  module.exports.requiresSecure = bypassSecure;
}
