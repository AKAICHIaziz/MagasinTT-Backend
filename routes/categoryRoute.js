const express = require('express')
const router = express.Router()

const { getCategories, getCategory, addCategory, deleteCategory, patchCategory } = require('../controllers/categoryController')

router.get('/', getCategories)
router.get('/:id', getCategory)
router.post('/add', addCategory)
router.delete('/:id', deleteCategory)
router.patch('/:id', patchCategory)

module.exports = router