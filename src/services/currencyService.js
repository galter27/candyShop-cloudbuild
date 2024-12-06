require('dotenv').config();
const axios = require('axios');

async function getConversionRates() {
    const apiKey = process.env.CURRENCY_KEY;
    const url = `https://api.exchangeratesapi.io/v1/latest?access_key=${apiKey}&base=EUR&symbols=ILS,USD,EUR`;

    try {
        const response = await axios.get(url);
        return response.data.rates;
    } catch (error) {
        console.error('Error fetching conversion rates:', error);
        throw new Error('Could not fetch conversion rates');
    }
}

module.exports = { getConversionRates };