const axios = require('axios');

async function setCurrency(req, res) 
{
  const { currency } = req.body;
  req.session.currency = currency;

  try {
    const ratesResponse = await axios.get('https://api.exchangerate-api.com/v4/latest/ILS');
    req.session.rates = ratesResponse.data.rates;
  } catch (error) {
    console.error('Error fetching currency rates', error);
  }

  res.sendStatus(200);
};

module.exports = {
  setCurrency
}