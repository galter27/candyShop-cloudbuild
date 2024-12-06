const customerService = require('../services/customerService');
const productService = require('../services/productsService');
const favoriteService = require('../services/favoriteService');
const facebookInfoService = require('../services/facebookInfoService');
const facebookPostService = require('../services/facebookPostService');



// Helper function to convert address object to a string
function formatAddress(address) {
    if (!address || typeof address !== 'object') return '';
    return `${address.street} ${address.number}, ${address.city}`;
}

// Render personal area - myAccount / admin
async function renderAdminPage(req, res) {
    try {
        const currency = req.session.currency;
        const rates = req.session.rates;
        const customerId = req.session.user.customerId;  // Assume customerId is available in the session
        const user = await customerService.getCustomerById(customerId);  // Search by customerId
        const customers = await customerService.getAllCustomers();  // Search by customerId
        const role = req.session.user.role;
        if (!user) {
            return res.status(404).send('Customer not found');
        }
        user.formattedAddress = formatAddress(user.address);
        res.render('allCustomers', {customers, user, currency, rates});
    } catch (err) {
        console.error('Error rendering admin page:', err);
    }
}

async function getFacebookPageInfo(req, res) {
    try {
        const currency = req.session.currency;
        const rates = req.session.rates;
        const user = req.session.user;  // Get the user from the session
        const facebookData = await facebookInfoService.getFacebookPageInfo(); // Fetch Facebook stats
        const role = user.role;
        res.render('facebookInfo', { facebookData, user , currency, rates});
    } catch (err) {
        console.error('Error fetching Facebook page info:', err);
        res.status(500).send('Server Error - fetching Facebook page info');
    }
}

async function renderAccountPage(req, res) {
    try {
        const user = req.session.user;
        const currency = req.session.currency;
        const rates = req.session.rates;
        res.render('customerDetails', {user, currency,rates});
    } catch (err) {
        console.error('Error rendering admin page:', err);
        res.status(500).send('Server Error');
    }
}

// Manage customers / orders / product
async function updateCustomerDetails(req, res) {
    try {
        const customerId = req.session.user.customerId;
        const password = await customerService.getCustomerPassword(customerId);
        console.log(password);
        const currency = req.session.currency;
        const { 
            name, 
            email, 
            birth_day, birth_month, birth_year, 
            phone, 
            street, number, city,
        } = req.body;
        const birthdate = new Date(`${birth_year}-${birth_month}-${birth_day}`);    
        const updateUser = {
            customerId, 
            name, 
            email, 
            birthdate, 
            phone, 
            address: {
                street, number, city
            },
            password: password
        };
        console.log(updateUser);
        const updateCustomer = await customerService.updateCustomerDetails(customerId, updateUser);
        if (updateCustomer) {
            req.session.user = {...req.session.user, ...updateUser};
            res.redirect('/personal/myAccount');
        }
    } catch (err) {
        res.status(500).send("Failed to update customer", err);
    }
}

// Update customer Password
async function updateUserPass(req, res){
    const {currentPass, newPass} = req.body;
    const customerId = req.session.user.customerId;

    try {
        const isPasswordCorrect = await customerService.verifyPassword(customerId, currentPass);
        console.log(isPasswordCorrect);
        if (!isPasswordCorrect) {
            return res.status(400).json({ success: false, message: 'Current password is incorrect.' });
        }

        await customerService.updatePassword(customerId, newPass);
        res.json({ success: true, message: 'Password changed successfully.' });
    } catch(err) {
        console.error(err);
    }
}

// Get all about - orders / favorite / customers / products
async function getAllCustomers(req, res) {
    try {
        const user = req.session.user;
        const currency = req.session.currency;
        const rates = req.session.rates;
        const customers = await customerService.getAllCustomers(); // Fetch all customers from service
        const customer = await customerService.getCustomerById(user.customerId);  // Search by customerId
        res.render('allCustomers', { customers, customer, user, currency, rates});  
    } catch (err) {
        console.error('Error fetching customers:', err);
        res.status(500).send('Server Error (adminController - getAllCustomers)');
    }
}

// For specific customer - orders / details / favorit

async function getAllProducts(req, res) {
    try {
        const user = req.session.user;
        const customers = await customerService.getAllCustomers();
        const products = await productService.getAllProducts();
        const currency = req.session.currency;
        const rates = req.session.rates;
        res.render('allProducts', {customers, products, user, currency, rates});
    } catch (err) {
        console.error('Error fetching products: ', err);
        res.status(500).send('Server Error (adminController - getAllProducts');
    }
}

// For specific customer - orders / details / favorite
async function getFavoriteProducts (req, res) {
    const user = req.session.user;
    const currency = req.session.currency;
    const rates = req.session.rates;
    try {
        const favoriteProducts = await favoriteService.getFavoriteProductsByCustomerId(user.customerId);
        res.render('favoriteProducts', {favoriteProducts, user, currency, rates});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Controller to render the add product part
async function addProductsPage(req, res) {
    try {
        const user = req.session.user;
        const currency = req.session.currency;
        const rates = req.session.rates;
        res.render('addProducts', {user, currency,rates});
    } catch (err) {
        console.error('Error fetching customers:', err);
        res.status(500).send('Server Error (adminController - addProducts)');
    }
}

async function postToFacebook(name, price) {
    const message = `Wow! Check out our new product: ${name}, only for ${price}!`;
    const url = `http://localhost:3000/products/${name.replace(/\s+/g, '').toLowerCase()}`; // Create URL based on the product name

    try {
        await facebookPostService.postMessageToFacebook(message, url);
    } catch (error) {
        console.error('Error posting to Facebook:', error);
        throw error; 
    }
}

// Manage customers / orders / product
async function adminUpdateCustomerDetails(req, res) {
    try {
        const customerId = req.params.customerId;
        const { name, email, birth_day, birth_month, birth_year, phone, street, number, city, role } = req.body;

        // Create a birthdate object from the day, month, and year
        const birthdate = new Date(`${birth_year}-${birth_month}-${birth_day}`);

        const updatedCustomerData = {
            name,
            email,
            birthdate,
            phone,
            address: {
                city,
                street,
                number: Number(number)
            },
            role
        };
        // Call the service to update the customer in the database
        const updatedCustomer = await customerService.updateCustomerDetails(customerId, updatedCustomerData);

        if (updatedCustomer) {
            res.json({ success: true, message: 'Customer updated successfully' });
        } else {
            res.status(400).json({ success: false, message: 'Failed to update customer' });
        }
    } catch (err) {
        console.error('Error updating customer:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
}
async function addStoresPage(req, res) {
    try {
        const user = req.session.user;
        const currency = req.session.currency;
        const rates = req.session.currency;
        res.render('addStores', {user, currency, rates});
    } catch (err) {
        console.error('Error fetching customers:', err);
        res.status(500).send('Server Error (adminController - addStores)');
    }
}

module.exports = {
    renderAccountPage,
    updateCustomerDetails,
    getAllCustomers,
    renderAdminPage,
    getFacebookPageInfo,
    getFavoriteProducts,
    getAllProducts,
    addProductsPage,
    postToFacebook,
    adminUpdateCustomerDetails,
    addStoresPage,
    updateUserPass,
    //getAdminData
};