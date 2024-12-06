const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const productsController = require('../controllers/productsController.js');
const orderController = require('../controllers/orderController.js');
const storesController = require('../controllers/storesController.js');
const { isAuthenticated } = require('../controllers/loginController.js');
const { isAdmin } = require('../controllers/loginController.js');

// get
router.get('/myAccount',isAuthenticated, adminController.renderAccountPage);
router.get('/myAccount/details',isAuthenticated, adminController.renderAccountPage);
router.get('/admin',isAuthenticated, isAdmin, adminController.getAllCustomers);
router.get('/admin/customers',isAuthenticated, isAdmin, adminController.getAllCustomers);
router.get('/admin/products',isAuthenticated, isAdmin, adminController.getAllProducts);
router.get('/admin/addProducts',isAuthenticated, isAdmin, adminController.addProductsPage);
router.get('/myAccount/favorite',isAuthenticated, adminController.getFavoriteProducts,);
router.get('/myAccount/orders/:orderId',isAuthenticated, orderController.getCustomerOrderDetailsById);
router.get('/admin/orders/:orderId',isAuthenticated,isAdmin, orderController.getOrderDetailsById);
router.get('/admin/orders',isAuthenticated,isAdmin, orderController.getAllOrders);
router.get('/myAccount/orders',isAuthenticated, orderController.getCustomerOrders);
router.get('/admin/facebookInfo',isAuthenticated, isAdmin, adminController.getFacebookPageInfo);
router.get('/admin/stores', isAuthenticated,isAdmin,storesController.getStores);
router.get('/admin/addStores',isAuthenticated,isAdmin, adminController.addStoresPage);

// put
router.put('/admin/customers/update/:customerId', adminController.adminUpdateCustomerDetails);
router.put('/admin/orders/status/:orderId', orderController.updateOrderStatus);
router.put('/admin/stores/update/:storeId', storesController.updateStoreDetails)

// post
router.post('/myAccount/update', adminController.updateCustomerDetails);
router.post('/myAccount/updatePass', adminController.updateUserPass);
router.post('/myAccount/favorite/remove', productsController.removeFavoriteProduct);
router.post('/admin/orders/:orderId/remove', orderController.deleteOrder);
router.post('/admin/products/:productId/edit', productsController.editProducts);
router.post('/admin/products/:productId/delete', productsController.deleteProduct);
router.post('/admin/addProducts', productsController.addProduct);
router.post('/admin/addStores', storesController.addStore);
router.post('/admin/stores/:storeId/delete', storesController.deleteStore);

module.exports = router;