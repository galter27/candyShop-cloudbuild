const Customer = require('../models/customer');
const Orders = require('../models/orders');

async function getCustomerOrders(customerId) {
    try {
        const orders = await Orders.find({customerId: customerId});
        return orders;
    } catch (err) {
        console.error('Error fetching favorites', err);
    }
}

async function getAllOrders () {
    try {
        const orders = await Orders.find({});
        return orders;
    } catch (err) {
        console.error('Error fetching all orders ', err);
    }
}

async function getOrderDetailsById (orderId) {
    try {
      // Fetch the order by ID and populate the products
      const order = await Orders.findOne({orderId: orderId}).populate('products.productId');
  
      if (!order) {
        return null; // Return null if the order is not found
      }
  
      // Fetch details of each product
      const productsDetails = await Promise.all(order.products.map(async (product) => {
        const productDetails = await Product.findById(product.productId);
        return {
          name: productDetails.name,
          price: productDetails.price,
          quantity: product.quantity
        };
      }));
  
      // Add the products details to the order object
      order.productsDetails = productsDetails;
  
      return order;
    } catch (error) {
      console.error('Error fetching order details:', error);
      throw error; 
    }
  };

async function getOrderById(orderId) {
  try {
    const order = await Orders.findOne({orderId : orderId});
    return order;
  } catch(err) {
    console.error('error', err);
  }
}

async function updateOrderStatus (orderId, newStatus) {
  try {
    // Find the order by ID and update the status
    const updatedOrder = await Orders.findOneAndUpdate(
        {orderId :orderId}, 
        { status: newStatus }, 
        { new: true } // Returns the updated order
    );
    return updatedOrder;
} catch (error) {
    console.error(error);
    throw new Error('Error updating order status');
}
}

async function deleteOrder(orderId) {
  try {
    const result = await Orders.deleteOne({ 
      orderId: orderId  ,
    }); 
    return result.deletedCount > 0;
  } catch (err) {
    console.error('Error removing order:', err);
    throw err; 
  }
}

async function createOrder(orderDetails) {
  // Debugging: Check if products are correctly passed
  const order = new Orders(orderDetails);
  return await order.save();
}

module.exports = {
    getCustomerOrders,
    updateOrderStatus,
    getAllOrders,
    getOrderDetailsById,
    getOrderById,
    deleteOrder,
    createOrder
  };