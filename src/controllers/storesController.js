const storesService = require('../services/storesService');

async function getStores(req, res) {
    try {
        const user = req.session.user;
        const stores = await storesService.getAllStores();
        const currency = req.session.currency;
        const rates = req.session.rates;
        res.render('allStores', { stores: stores , user, rates, currency});
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
}

async function updateStoreDetails(req, res) {
    try {
        const storeId = req.params.storeId; 
        const storeData = req.body;

        const updatedStore = await storesService.updateStoreDetails(storeId, storeData);

        if (updatedStore) {
            res.json({ success: true, message: 'Store updated successfully' });
        } else {
            res.json({ success: false, message: 'Failed to update store' });
        }
    } catch (err) {
        res.status(500).json({ success: false, message: "Failed to update store", error: err.message });
    }
}

async function addStore (req, res) {
    const storeData = req.body;

    storesService.createStore(storeData)
        .then(store => res.status(200).json({ message: 'Store successfully added', data: store }))
        .catch(err => res.status(500).send({ error: 'Something went wrong' }));
}

async function deleteStore (req, res) {
    const storeId = req.params.storeId;
    console.log(storeId);
  
    storesService.deleteStoreById(storeId)
      .then(() => {
        res.json({ success: true });
      })
      .catch(err => {
        res.status(500).json({ error: err.message });
      });
  }
  
module.exports = {
    getStores,
    updateStoreDetails,
    addStore,
    deleteStore
};
