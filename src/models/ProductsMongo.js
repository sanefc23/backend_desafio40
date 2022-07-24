const mongoose = require("mongoose");
const logger = require('../services/logger');
const MongoDBClient = require('../services/dbMongo');
const Schema = mongoose.Schema;
const productsCollection = 'productos';
const productsSchema = new Schema({
    title: {
        type: String,
        required: true,
        max: [125, "Max length is 125 characters"]
    },
    price: {
        type: Number,
        required: true
    },
    thumbnail: {
        type: String,
        required: true,
        max: [400, "Max length is 400 characters"]
    },
});

class Products {
    prods
    constructor() {
        MongoDBClient.getConnection();
        this.prods = mongoose.model(productsCollection, productsSchema);
    }
    async getProducts() {
        try {
            const response = await this.prods.find().sort({
                '_id': 1
            }).lean()
            return response;
        } catch (e) {
            logger.error(e.message)
            throw new Error(e.message)
        }
    }
    async getProductById(id) {
        try {
            const response = await this.prods.findById(id).lean();
            return response
        } catch (e) {
            logger.error(e.message)
            throw new Error(`Error getting products: ${e.message}`)
        }
    }
    async addProduct(newProduct) {
        try {
            const response = await this.prods.create(newProduct)
            logger.info(`Producto insertado: ${newProduct}`);
            return response;
        } catch (e) {}
        loggerErr.error('Error creating product: ', e);
        throw new Error(`Error creating product: ${e.message}`)
    }
    async updateProduct(id, prod) {
        try {
            const response = await this.prods.findByIdAndUpdate(id, prod);
            logger.info('producto actualizado: ', prod);
            return response;
        } catch (e) {
            logger.error('Error en Update producto: ', e);
        }
    }
    async deleteProduct(id) {
        try {
            const response = await this.prods.findByIdAndDelete(id);
            logger.warn('producto eliminado: ', prod);
            return response;
        } catch (e) {
            logger.error('Error en Delete producto: ', e);
        }
    }
}

module.exports = new Products()