const express = require('express')
const router = express.Router()

const { sendMessage, getMessages } = require('../controllers/messageConroller')

router.post('/send', sendMessage)
router.get('/:sender/:receiver', getMessages)

module.exports = router