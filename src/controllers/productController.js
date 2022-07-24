const ProductsAPI = require('../APIs/productsAPI');
const logger = require('../services/logger')

const productController = {
    listProducts: (req, res) => {
        const id = req.params.id;
        if (!id) {
            ProductsAPI.getProducts()
                .then(products => {
                    res.render('index', {
                        productos: products
                    })
                })
                .catch(e => {
                    logger.error('Error getting products: ', e);
                })
        } else {
            ProductsAPI.getProductById(id).
            then(product => {
                    res.render('index', {
                        productos: [product]
                    })
                })
                .catch(e => {
                    logger.error('Error getting products: ', e);
                })
        }
    },
    addProduct: (req, res) => {
        ProductsAPI.addProduct(req.body)
            .then(prod => {
                res.redirect('/productos')
            })
            .catch(e => {
                logger.error('Error en Insert producto: ', e);
            });
    },
    showEditProduct: (req, res) => {
        const currentID = req.params.id;
        ProductsAPI.getProducts(currentID)
            .then(prod => {
                console.log(prod);
                res.render('index', {
                    id: prod._id,
                    title: prod.title,
                    thumbnail: prod.thumbnail,
                    price: prod.price,
                    updateForm: true,
                    viewTitle: "Editar producto",
                    errorMessage: "No hay productos."
                })
            })
            .catch(e => {
                logger.error('Error getting product: ', e);
            });
    },
    editProduct: (req, res) => {
        const id = req.params._id;
        ProductsAPI.updateProduct(id, req.body)
            .then(prod => {
                logger.warn('producto actualizado: ', prod);
                res.redirect('/productos');
            })
            .catch(e => {
                logger.error('Error en Update producto: ', e);
            });
    },
    deleteProduct: (req, res) => {
        const id = req.params.idprod;
        ProductsAPI.deleteProduct(id)
            .then(prod => {
                logger.warn('producto eliminado: ', prod);
                res.redirect('/productos');
            })
            .catch(e => {
                logger.error('Error en Delete producto: ', e);
            });
    }
}

module.exports = productController;