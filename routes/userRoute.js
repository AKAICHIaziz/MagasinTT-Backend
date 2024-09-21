const express = require('express')
const router = express.Router()

const { getUsers, getUser, getTempUsers, getTempUser, approveTempUser, addUser, deleteUser, patchUser, getUsernameAndJob, deleteTempUser } = require('../controllers/userController')

router.get('/getUsernameAndJob', getUsernameAndJob)

router.get('/all', getUsers)
router.get('/all/:id', getUser)

router.get('/signup-requests', getTempUsers)
router.get('/signup-requests/:id', getTempUser)
router.post('/signup-requests/:id', approveTempUser)
router.delete('/signup-requests/:id', deleteTempUser)

router.post('/add', addUser)
router.delete('/delete/:id', deleteUser)
router.patch('/update/:id', patchUser)

module.exports = router