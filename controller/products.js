const { Product } = require("../models/Products");
const { productValidator } =  require("../middleware/validator-middleware");

const fetchAllProducts = async (req, res, next) => {
  try {
    const products = await Product.getAllProducts();
    return res.status(200).json({
      message: 'Data returned successfully',
      result: products
    });
  } catch(err) {
    throw new Error(err.message);
  }
}


const saveProducts = async (req, res, next) => {
  try {
    const products = req.body;
    const resp = await Product.saveProductsBulk(products);
    return res.status(200).json({
      success: true,
      message: 'Data returned successfully',
      result: resp
    });
  } catch(err) {
    throw new Error(err.message);
  }
}


module.exports = { fetchAllProducts, saveProducts };
