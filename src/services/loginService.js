require('dotenv').config()
const crypto = require("crypto-js");
const User = require('../models/customer'); 

const SECRET_KEY = process.env.SECRET_KEY; 

function decrypt(ciphertext) {
  const bytes  = crypto.AES.decrypt(ciphertext, SECRET_KEY);
  return bytes.toString(crypto.enc.Utf8);
}

async function loginAttempt(email, password) {
  try {
    const user = await User.findOne({ email : email });
    if (user) {
        // Decrypt stored password and compare
        const decryptedPassword = decrypt(user.password);
        console.log('login service ' +decryptedPassword);
        if(decryptedPassword === password) {
            // Password matches, return user data
            return user;
        } 
        else {
            // Password does not match, return false
            return false;
        }
    } else {
        // User does not exist, return false
        return false;
    }
  } catch (error) {
    console.error('Error fetching user by email:', error);
    throw error;
  }
}

module.exports = {
  loginAttempt
};