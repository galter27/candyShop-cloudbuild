require('dotenv').config()
const Customer = require('../models/customer');
const crypto = require("crypto-js");

const SECRET_KEY = process.env.SECRET_KEY; 

function encrypt(password){
  return crypto.AES.encrypt(password, SECRET_KEY).toString();
}

async function registerUser(userData) {
  try {
    const { name, email, customerId, password, birthdate, address, role, phone} = userData;

    // Encrypt the password
    const encryptedPassword = encrypt(password);

    const newCustomer = new Customer({
      name,
      email,
      customerId,
      password: encryptedPassword, 
      birthdate,
      address,
      phone,
      role
    });

    // Save the customer to the database
    const savedCustomer = await newCustomer.save();
    return savedCustomer;
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
}

module.exports = {
  registerUser
};