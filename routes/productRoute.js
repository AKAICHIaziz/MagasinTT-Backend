const express = require('express')
const router = express.Router()

const { getProducts, getProduct, addProduct, deleteProduct, patchProduct, ajouterBon, getProductsByBon } = require('../controllers/productController')



router.get('/all', getProducts)
router.get('/get-by-bon/:numBon', getProductsByBon)

router.get('/all/:id', getProduct)
router.post('/add', addProduct)

router.post('/ajouterBon', ajouterBon)

router.delete('/all/:id', deleteProduct)
router.patch('/all/:id', patchProduct)

module.exports = router