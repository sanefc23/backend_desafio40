const Products = require('../models/ProductsMongo');

const ProductsAPI = {
  getProducts: async () => await Products.getProducts(),
  getProductById: async (id) => await Products.getProductById(id),
  addProduct: async (prod) => await Products.addProduct(prod),
  updateProduct: async (id, prod) => await Products.updateProduct(id, prod),
  deleteProduct: async (id) => await Products.deleteProduct(id)
}

module.exports = ProductsAPI