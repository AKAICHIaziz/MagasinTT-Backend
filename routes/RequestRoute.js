const express = require('express')
const router = express.Router()

const { createRequest, getRequests, getSingleRequest, rejectRequest, approveRequest, getRequestCount } = require('../controllers/requestController')

router.post('/create-request', createRequest)
router.get('/all', getRequests)
router.get('/all/:userId', getRequestCount)
router.post('/all/:id', getSingleRequest)
router.post('/reject', rejectRequest)
router.post('/approve', approveRequest)

module.exports = router