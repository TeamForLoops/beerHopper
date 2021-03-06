const router = require('express').Router()
module.exports = router

router.use('/users', require('./users'))
router.use('/beer', require('./beer'))
router.use('/cart', require('./cart'))
router.use('/categories', require('./categories'))
router.use('/orders', require('./orders'))
router.use('/reviews', require('./reviews'))
router.use('/checkout', require('./checkout'))

router.use((req, res, next) => {
  const error = new Error('Not Found')
  error.status = 404
  next(error)
})
