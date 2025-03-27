const express = require('express')
const router = express.Router()
const controllers = require('./controllers')
const httpStatusCode = require('./httpStatusCode')

router.get('/', (req, res) => { // default answer to root
  res.status(httpStatusCode.HTTP_OK).json({ message: 'Connection OK' })
})

// user routes get all users, queries, create, update, delete
router.get('/v1/user', controllers.getAllUsers)
router.get('/v1/user/query', controllers.getUserByQuery)
router.post('/v1/user', controllers.createUser)
router.put('/v1/user/:id', controllers.updateUser)
router.delete('/v1/user/:id', controllers.deleteUser)

module.exports = router
