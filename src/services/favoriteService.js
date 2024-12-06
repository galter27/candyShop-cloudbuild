const Favorite = require('../models/favorite');
const productsService = require('../services/productsService');
const Product = require('../models/products');

const getFavoriteProductsByCustomerId = async (customerId) => {
    try {
        const favorites = await Favorite.find({ customerId });
        const productDetails = await Promise.all(
            favorites.map(async (favorite) => {
                const product = await Product.findOne({productId: favorite.productId});
                return product;
            })
        );
        return productDetails;
    } catch (error) {
        throw new Error('Error fetching favorite products: ' + error.message);
    }
};

async function addNewFavorite(customerId, productId) {
    try {
        // Check if the product is already in the favorites list
        const favoriteExists = await Favorite.findOne({ customerId: customerId, productId: productId });
        
        if (!favoriteExists) {
            const favorite = new Favorite({ customerId: customerId, productId: productId });
            await favorite.save();
    
            return favorite;        }       
    } catch (error) {
        console.error('Error in adding favorite product:', error);
        throw new Error('Failed to add product to favorites');
    }
}

async function removeFavoriteProduct(customerId, productId) {
    try {
        // Remove the favorite entry
        const result = await Favorite.deleteOne({ 
            customerId: customerId,
            productId: productId 
        });
        // Check if a favorite was removed
        return result.deletedCount > 0; // Return true if a product was removed
    } catch (err) {
        console.error('Error removing favorite product:', err);
        throw err; 
    }
}

module.exports = {
    getFavoriteProductsByCustomerId,
    addNewFavorite,
    removeFavoriteProduct
  };