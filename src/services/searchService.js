const Product = require('../models/products.js'); 

async function searchProductsByName(query) {
    try {
        // Use regex for partial match (case insensitive)
        return await Product.find({ name: { $regex: query, $options: 'i' } });
    } catch (error) {
        console.error('Error details:', error); // Log the specific error to the console
        throw new Error('Error searching products by name');
    }
}

async function searchProductsBySweetType(sweetType) {
    return await Product.aggregate([
        { $match: { sweetType: sweetType } },
        { $group: { _id: "$sweetType", products: { $push: "$$ROOT" } } }
    ]);
}

async function searchFilter(query, filters) {
    try {
        let matchStage = {};

        if (typeof query === 'string' && query.trim() !== '') {
            matchStage.name = { $regex: query, $options: 'i' };
        }

        // Handle the flavors filter (array)
        if (filters.flavor && filters.flavor !== 'All') {
            matchStage.flavors = filters.flavor;         
        }

        // Handle the allergans filter (array)
        if (filters.allergans && filters.allergans !== 'All') {
            matchStage.allergans = filters.allergans;
        }

        // Handle the sweetType filter (string)
        if (filters.sweetType && filters.sweetType !== '') {
            matchStage.sweetType = filters.sweetType;
        }

        // Handle the kosher filter (string)
        if (filters.kosher && filters.kosher !== '') {
            matchStage.kosher = filters.kosher;
        }

        const pipeline = [
            { $match: matchStage },
            {
                $group: {
                    _id: {
                        flavor: "$flavors",
                        allergans: "$allergans",
                        sweetType: "$sweetType",
                        kosher: "$kosher"
                    },
                    products: { $push: "$$ROOT" },
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } }
        ];        

        const results = await Product.aggregate(pipeline).exec();
        return results;
    } catch (error) {
        console.error('Error details:', error);
        throw new Error('Error filtering products');
    }
}

module.exports = { 
    searchProductsByName,
    searchProductsBySweetType,
    searchFilter
};