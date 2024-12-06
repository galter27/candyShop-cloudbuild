const registerService = require('../services/registerService');

function getRegisterPage(req, res) {
  res.render('register', { error: null });
}

function postRegister(req, res) {
  const { name, email, customerId, password, birthdate, address, role, phone } = req.body;

  registerService.registerUser({
    name: name,
    email: email,
    phone: phone,
    customerId: customerId,
    password: password,
    birthdate: birthdate,
    address: address,
    role: role
  })
  .then(function(savedUser) {
    // Redirect to login or send success response
    res.redirect('/');
  })
  .catch(function(error) {
    console.error('Registration error:', error);
    res.render('register', { error: 'Registration failed. Please try again.' });
  });
}

module.exports = {
  getRegisterPage,
  postRegister
};
