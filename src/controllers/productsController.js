const productsService = require("../services/productsService.js");
const customerService = require("../services/customerService.js");
const favoriteService = require('../services/favoriteService');
const Products = require("../models/products.js");
const facebookPostService = require('../services/facebookPostService.js');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

async function getAllProducts (req, res) {
	const user = req.session.user;
	if (!user){
		return res.redirect('/');
	}
	try {
		const email = user.email;
        const currency = req.session.currency || 'ILS';
        const rates = req.session.rates || {};
		const products = await productsService.getAllProducts();
		res.render('productsList', { products,user,currency,rates}); 
	} catch (err) {
		console.error('Error getting products:', err);
		res.status(500).send('Server Error (productsController - getAllProducts)');
	}
};


async function addProduct(req, res) {
    const productId = new Date().getTime().toString();

    try {
        const storage = multer.diskStorage({
            destination: function (req, file, cb) {
                cb(null, path.join(__dirname, '../public/images/product-images'));
            },
            filename: function (req, file, cb) {
                const fileName = `product_${productId}.svg`;
                cb(null, fileName);
            }
        });

        const upload = multer({ storage: storage }).single('image');
        upload(req, res, async function (err) {
            if (err) {
                console.error('Error uploading image:', err);
                return res.status(500).json({ success: false, message: 'Error uploading image' });
            }

            const { name, price, inventory, description, category, postToFacebook, sweetType, kosher} = req.body;
            const flavorsData = req.body.flavors || '[]';
            let flavors = [];

            const allergansData = req.body.allergans || '[]';
            let allergans = [];

            // Flavores
            try {
                flavors = JSON.parse(flavorsData);
            } catch (error) {
                console.error('Failed to parse flavors:', error);
                return res.status(400).json({ error: 'Invalid flavors data' });
            }

            // Allergans
            try {
                allergans = JSON.parse(allergansData);
            } catch (error) {
                console.error('Failed to parse allergans:', error);
                return res.status(400).json({ error: 'Invalid allergans data' });
            }

            const imageUrl = `/public/images/product-images/product_${productId}.svg`;

            const productData = {
                productId:productId,
                name,
                price,
                inventory,
                description,
                flavors,
                allergans,
                sweetType,
                kosher,
                imageUrl
            };

            // PostToFacebook
            if (postToFacebook === 'on') {
                const productUrl = `localhost:3000/products/${productId}`;
                try {
                    await facebookPostService.postMessageToFacebook(`Wow! New Product! ✨ \n\n` + 
                    `🍭 ${name.toUpperCase()} 🍭\n` +
                    `💸 Only ${price}\n\n` +
                    `🔥Copy the link below to get yours!\n\n`+
                    `${productUrl}`);
                } catch (error) {
                    console.error('Error posting to Facebook:', error);
                }
            }
            // Pass the data to the service to insert into the database
            const newProduct = await productsService.createProduct(productData);
            return res.json({ success: true, product: newProduct });
        });
    } catch (error) {
        console.error('Error creating product:', error);
        return res.status(500).json({ success: false, message: 'Error creating product' });
    }
}

async function showDeleteProductForm (req, res) {
    res.render('deleteProduct', { error: null, productId: '' });
};

async function deleteProduct(req, res) {
    try {
        const { productId } = req.params;

        // Fetch the product details to get the image name/path
        const product = await productsService.getProductById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found.' });
        }

        // Construct the path to the product image
        const imagePath = path.join(__dirname, '../public/images/product-images', `product_${productId}.svg`);

        // Log the image path for debugging

        // Check if the image file exists
        if (fs.existsSync(imagePath)) {
            // Delete the product image
            fs.unlink(imagePath, (err) => {
                if (err) {
                    console.error('Error deleting product image:', err);
                } else {
                    console.log('Product image deleted successfully.');
                }
            });
        } else {
            console.warn('Product image not found at path:', imagePath);
        }

        // Delete the product from the database
        await productsService.deleteProduct(productId);

        res.status(200).json({ message: 'Product deleted successfully.' });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ message: 'Failed to delete product.', error: error.message });
    }
}

async function addNewFavorite(req, res) {
    try {
        const customerId = req.session.user.customerId; // Assuming customerId is stored in session
        const productId = req.body.productId; // Get the productId from the request body

        await favoriteService.addNewFavorite(customerId, productId);

        return res.status(200).json({ success: true });
    } catch (error) {
        console.error('Error adding product to favorites:', error);
        return res.status(500).json({ success: false, message: error.message });
    }
}

async function removeFavoriteProduct (req,res) {
	try {
		const customerId = req.session.user.customerId; // Get the customer's ID from the session
		const productId = req.body.productId; // Get product number from the request body

		const wasRemoved = await favoriteService.removeFavoriteProduct(customerId, productId);

		if (wasRemoved) {
			res.status(200).json({ message: 'Product removed from favorites' }); // Respond with success
		} else {
			res.status(404).json({ error: 'Product not found in favorites' }); // Handle case where product was not found
		}
	} catch (err) {
		console.error('Error removing favorite product:', err);
		res.status(500).json({ error: 'Failed to remove favorite product' }); // Handle other errors
	}
}

async function editProducts (req,res) {
	const { productId } = req.params; 
    const { name, price, description, inventory } = req.body; 

    try {		
        const updateData = { productId, name, price, description, inventory };
		const updatedProduct = await productsService.saveProduct(productId, updateData);
        
        return res.json({ success: true, product: updatedProduct });
    } catch (error) {
        console.error('Error updating product:', error);
        return res.json({ success: false, message: 'Error updating product' });
    }
}

async function getProductDetail (req, res) {
    try {
        const user = req.session.user;
        const currency = req.session.currency;
        const rates = req.session.rates || {};
        const product = await productsService.getProductById(req.params.productId);
        res.render('productDetail', { product: product, user:user, currency:currency, rates:rates});
    } catch (error) {
        console.log(error);
        res.redirect('/products');
    }
}

async function getKosherData(req, res) {
    try {
        const kosherCount = await Products.countDocuments({ kosher: "Yes" });
        const nonKosherCount = await Products.countDocuments({ kosher: "No" });

        res.status(200).json({
            kosher: kosherCount,
            nonKosher: nonKosherCount
        });
    } catch (error) {
        console.error("Error fetching kosher data:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

async function getAdminData(req, res) {
    try {
        const adminCount = await customerService.countDocuments({ role: "admin" });
        const nonAdminCount = await customerService.countDocuments({ role: "user" });
        // Return the counts as a JSON response
        res.status(200).json({
            Admin: adminCount,
            nonAdmin: nonAdminCount
        });
    } catch (error) {
        console.error("Error fetching Admin data:", error.message);
        res.status(500).json({ error: "Internal server error", details: error.message });
    }
}

module.exports = {
	getAllProducts,
	editProducts,
	showDeleteProductForm,
	deleteProduct,
	addNewFavorite,
	removeFavoriteProduct,
    getKosherData,
	addProduct,
    getProductDetail,
    getAdminData
};