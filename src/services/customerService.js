const Customer = require('../models/customer');
const crypto = require("crypto-js");
require('dotenv').config()

const SECRET_KEY = process.env.SECRET_KEY; 

async function getAllCustomers() {
    try {
        const customers = await Customer.find({});
        return customers;
    } catch (err) {
        console.error('Error fetching customers', err);
    }
}

async function getUserRoleByCustomerId (customerId) {
    try {
        const customer = await Customer.find({customerId:customerId});
        const role = customer.role;
        return role;
    } catch (err) {
        console.error('Error customer role not found', err);
    }
}

async function getCustomerByEmail(email) {
    try {
        const customer = await Customer.findOne({email:email});
        return customer;
    } catch (err) {
        console.error('Error find customer ', err);
    }
}

async function getCustomerById(customerId) {
    try {
        const customer = await Customer.find({customerId});
        return customer;
    } catch (err) {
        console.error('Error find customer ', err);
    }
}

async function updateCustomerDetails(customerId, updateUser) {
    try {
        const updateCustomer = await Customer.findOneAndUpdate(
            {customerId : customerId},
                updateUser,
            { new: true, runValidators: true }
        );
        if (!updateCustomer) {
            throw new Error('customer not found');
        }
        return updateCustomer;
    } catch(err) {
        console.error('Error while update user ', err);
    }
}

async function getCustomerCart(customerId) {
    try {
        const customer = await Customer.findOne({ customerId: customerId }).select('cart');
        return customer ? customer.cart : [];
    } catch(err) {
        console.error(err);
        return [];
    }
}

async function updateCustomerCart(customerId, updateCart) {
    try {
        const updatedCustomer = await Customer.findOneAndUpdate(
            { customerId: customerId },
            { $set: { cart: updateCart } },
            { new: true }
        ).select('cart'); // מחזיר רק את שדה 'cart'
        
        return updatedCustomer;
    } catch(err) {
        console.error(err);
    }
}

async function getCustomerPassword(customerId) {
    try {
        const customer = await Customer.findOne({ customerId: customerId }).select('password');
        return customer ? customer.password : null;
    } catch (err) {
        console.error('Error fetching customer password:', err);
        throw err;
    }
}

function decrypt(ciphertext) {
    const bytes  = crypto.AES.decrypt(ciphertext, SECRET_KEY);
    return bytes.toString(crypto.enc.Utf8);
}

async function verifyPassword (customerId, currentPassword) {
    const customer = await Customer.findOne({ customerId: customerId }).select('password');
    const dbPass = customer ? customer.password : null;
    const dbPassDec  = decrypt(dbPass);
    console.log('customer service ' + dbPassDec);
    if (!dbPass) {
        // Handle the case where the customer is not found or the password is not retrieved
        throw new Error('Customer not found or password not retrieved');
    }
    return (currentPassword === dbPassDec);
}
async function updatePassword(customerId, newPassword) {
    try {
        console.log(newPassword);
        const newPasswordHash = crypto.AES.encrypt(newPassword, SECRET_KEY).toString();
        console.log(newPasswordHash);
        return await Customer.findOneAndUpdate({ customerId: customerId }, { $set: { password: newPasswordHash }}, {new: true}).exec();

      } catch(err) {
        console.error(err);
    }
}

async function countDocuments(query) {
    return await Customer.countDocuments(query); 
}
    
module.exports = {
    getAllCustomers,
    getUserRoleByCustomerId,
    getCustomerByEmail,
    getCustomerById,
    updateCustomerDetails,
    getCustomerCart,
    updateCustomerCart,
    getCustomerPassword,
    verifyPassword,
    updatePassword,
    countDocuments
  };
  
