const express = require('express');
const router = express.Router();

router.use('/auth', require('./auth'));
router.use('/orders', require('./orders'));
router.use('/productCategories', require('./productCategories'));
router.use('/products', require('./products'));
router.use('/stripe', require('./stripe'));
router.use('/customers', require('./customers'));
router.use('/staff', require('./staff'));

router.all('*', (_, res) => {
    res.status(404).json({ error: 'Not a valid API address' });
});

module.exports = router;
