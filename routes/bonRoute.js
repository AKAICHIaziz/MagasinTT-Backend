const express = require('express')
const router = express.Router()

const { getBon, getBons } = require('../controllers/bonController')

router.get('/all', getBons)
router.get('/all/:NumBon', getBon)

module.exports = router