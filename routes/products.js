const express = require('express');
const router = express.Router();

const { productValidator } = require('../middleware/validator-middleware');
const { fetchAllProducts, saveProducts } = require('../controller/products');

router.post('/saveAll', productValidator, saveProducts);
router.get('/', fetchAllProducts);

module.exports = router;
