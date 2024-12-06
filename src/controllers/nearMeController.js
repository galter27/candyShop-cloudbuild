const nearMeService = require('../services/nearMeService');

async function showNearestStore(req, res) {
  const user = req.session.user;
  const currency = req.session.currency;
  const { lat, lon } = req.query;
  try {
    const nearestStore = await nearMeService.findNearestStore(lat, lon);
    if (nearestStore) {
      res.render('nearMe', { store: nearestStore, user, currency});
    } else {
      res.render('nearMe', { error: 'No stores found nearby' , user, currency});
    }
  } catch (err) {
    console.error('Error finding nearest store:', err);
    res.render('nearMe', { error: 'Failed to retrieve nearest store' });
  }
}

async function getStores(req, res) {
  try {
    const stores = await nearMeService.getAllStores();
    res.json(stores);
  } catch (error) {
    console.error('Error retrieving stores:', error);
    res.status(500).send('Server error');
  }
}

module.exports = {
  getStores,
  showNearestStore,
};