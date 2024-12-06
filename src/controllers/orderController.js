const productService = require('../services/productsService');
const orderService = require('../services/ordersService');
const customerService = require('../services/customerService');

async function getAllOrders(req, res) {
    try {
        const user = req.session.user;  
        const orders = await orderService.getAllOrders();
        const currency = req.session.currency || 'ILS';
        const rates = req.session.rates || {};
        orders.forEach(order => {
            if (order.createdAt) {
                const date = new Date(order.createdAt);
                const day = String(date.getDate()).padStart(2, '0');
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const year = date.getFullYear();
                order.createdAtFormatted = `${day}/${month}/${year}`;
            } else {
                order.createdAtFormatted = 'N/A';
            }
        });
        res.render('allOrders', { orders, user, currency, rates}); // Render the view and pass customers
    } catch (err) {
        console.error('Error fetching customers:', err);
        res.status(500).send('Server Error (adminController - getAllOrders)');
    }
}

async function getCustomerOrders (req, res) {
    try {
        const user = req.session.user;
        const orders = await orderService.getCustomerOrders(user.customerId);
        const currency = req.session.currency || 'ILS';
        const rates = req.session.rates || {};
        orders.forEach(order => {
            if (order.createdAt) {
                const date = new Date(order.createdAt);
                const day = String(date.getDate()).padStart(2, '0');
                const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
                const year = date.getFullYear();
                order.createdAtFormatted = `${day}/${month}/${year}`;
            } else {
                order.createdAtFormatted = 'N/A';
            }
        });
        res.render('customerOrders', {orders, user, currency, rates});
    } catch (err) {
        res.status(500).send('Error fetching orders');
    }
}

async function getCustomerOrderDetailsById (req, res) {
  try {
        const user = req.session.user;
        const orderId = req.params.orderId; // Get orderId from the request
        const currency = req.session.currency || 'ILS';
        const rates = req.session.rates || {};

        // Fetch the order from the service
        const order = await orderService.getOrderById(orderId);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        const customer = await customerService.getCustomerById(user.customerId);
        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }   
        // Prepare an array to hold products with full details
        const fullProductDetails = await Promise.all(order.products.map(async (product) => {
        const productDetails = await productService.getProductById(product.productId);
            
        if (!productDetails) {
            console.warn(`Product with ID ${product.productId} not found`);
            return {
                name: 'We dont have this product right now', 
                price: 0, 
                quantity: product.quantity, 
                image: '/public/images/logo.svg', 
            };
        }
            
        return {
            name: productDetails.name, 
            price: productDetails.price, 
            quantity: product.quantity, 
            image: productDetails.imageUrl, 
        };
    }));

    res.render('customerOrderDetails', {
        orderDetails: {
            orderId: order.orderId,
            customerId: order.customerId,
            orderDate: order.orderDate,
            totalPrice: order.totalPrice,
            status: order.status,
            address: order.address,
            products: fullProductDetails,
        },
        user: user, 
        currency: currency,
        rates: rates,
    }); } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}

async function getOrderDetailsById (req, res) {
    try {
        const user = req.session.user;
        const orderId = req.params.orderId; // Get orderId from the request
        const currency = req.session.currency || 'ILS';
        const rates = req.session.rates || {};

        // Fetch the order from the service
        const order = await orderService.getOrderById(orderId);
        if (!order) {
          return res.status(404).json({ message: 'Order not found' });
        }
        const customer = await customerService.getCustomerById(user.customerId);
        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }  
        // Prepare an array to hold products with full details
        const fullProductDetails = await Promise.all(order.products.map(async (product) => {
          const productDetails = await productService.getProductById(product.productId);
          if (!productDetails) {
            console.warn(`Product with ID ${product.productId} not found`);
            return {
                name: 'We dont have this product right now', 
                price: 0, 
                quantity: product.quantity, 
                image: '/public/images/logo.svg', 
            };
        }
        
        return {
            name: productDetails.name, 
            price: productDetails.price, 
            quantity: product.quantity, 
            image: productDetails.imageUrl,
        };
        }));
        // Retrieve user from the session
        
        // Pass the data to the view
        res.render('orderDetails', {
          orderDetails: {
            orderId: order.orderId,
            customerId: order.customerId,
            orderDate: order.orderDate,
            totalPrice: order.totalPrice,
            status: order.status,
            address: order.address,
            products: fullProductDetails,
          },
          user: user,
          currency: currency,
          rates: rates, // Pass the user from the session
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
      }
}

async function updateOrderStatus(req,res) {
    try {
        const orderId = req.params.orderId;
        const { newStatus } = req.body;
        const validStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
        if (!validStatuses.includes(newStatus)) {
            return res.status(400).json({ success: false, message: 'Invalid status' });
        }

        const updatedOrder = await orderService.updateOrderStatus(orderId, newStatus);
        if (updatedOrder) {
            return res.status(200).json({ success: true, order: updatedOrder });
        } else {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

async function deleteOrder (req, res) {
    try {
        const orderId = req.params.orderId;
        const wasRemoved = await orderService.deleteOrder(orderId);
		if (wasRemoved) {
			res.status(200).json({ message: 'order removed' }); 
		} else {
			res.status(404).json({ error: 'order not found' }); 
		}
	} catch (err) {
		console.error('Error removing order:', err);
		res.status(500).json({ error: 'Failed to remove order' });
	}
}

module.exports = {
    getAllOrders,
    getCustomerOrders,
    getCustomerOrderDetailsById,
    getOrderDetailsById,
    updateOrderStatus,
    deleteOrder
}