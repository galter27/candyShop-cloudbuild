const loginService = require('../services/loginService'); // Ensure the path is correct
const customerService = require('../services/customerService');


// Function to handle user login via Email and Password
async function loginUser(req, res) {
  const { email, password } = req.body;
  try{
    const connect = await loginService.loginAttempt(email, password);
    const customer = await customerService.getCustomerByEmail(email)
    if (connect){
      req.session.user = customer;
      return res.redirect('/products');
    }
    else{
      // If failed to connect - stay in login page (There is print to user from ejs)  
      return res.render('login', { error: 'Email / Password is incorrect' }); // Re-render login page with error
    }
  }
  catch (err){
    console.error('Login attempt failed', err)

  }
}

async function logout(req, res) {
  // Clear the 'session' cookie
  res.clearCookie('connect.sid');  // Use the cookie name here
  
  // Optionally destroy the session as well
  req.session.destroy((err) => {
    if (err) {
      console.log("Error destroying session:", err);
      res.render('403');

    }
    res.redirect('/'); // Redirect to login page after logging out

  });
}


// Middleware Functions
function isAuthenticated(req, res, next) {
  console.log("Checking authentication for:", req.session.user);
  if (req.session.user) { // Check if the session contains user data
      return next();
  }
  res.render('401'); // Redirect to unauthorized page if not authenticated
}

function isAdmin(req, res, next) {
  if (req.session.user && req.session.user.role === 'admin') {
      return next(); // User is admin, proceed to the route
  }
  res.render('403');
}

module.exports = {
  loginUser,
  logout,
  isAuthenticated,
  isAdmin
};