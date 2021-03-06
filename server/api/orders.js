const router = require('express').Router()
const {Order, Beer, User, BeerOrder} = require('../db/models')
const {isUser, isAdmin, isMeOrAdmin} = require('../checks')
module.exports = router

// 8080/api/orders/
router.get('/', isAdmin, async (req, res, next) => {
  try {
    const orders = await Order.findAll({
      include: [{model: Beer}, {model: User}]
    })
    res.json(orders)
  } catch (err) {
    next(err)
  }
})

//Need to change the route
// router.get('/:userId', isAdmin, async (req, res, next) => {
//   try {
//     const orders = await Order.findAll({
//       where: {
//         id: req.params.userId
//       }
//     })
//     res.json(orders)
//   } catch (error) {
//     next(error)
//   }
// })

router.get('/my/allOrders', isUser, async (req, res, next) => {
  try {
    const orders = await Order.findAll({
      where: {
        userId: req.user.dataValues.id
      },
      include: {
        model: Beer
      }
    })
    const myOrders = orders.filter(order => {
      return order.status !== 'open'
    })
    res.json(myOrders)
  } catch (error) {
    next(error)
  }
})

// 8080/api/orders/:orderId

router.get('/:orderId', isAdmin, async (req, res, next) => {
  let orderId = req.params.orderId
  try {
    const order = await Order.findByPk(orderId, {
      include: [{model: Beer}, {model: User}]
    })
    res.send(order)
  } catch (err) {
    next(err)
  }
})

// 8080/api/orders/:orderId

router.put('/:orderId', isAdmin, async (req, res, next) => {
  let orderId = req.params.orderId

  try {
    const order = await Order.findByPk(orderId)
    order.update(req.body)
    res.send(order)
  } catch (err) {
    next(err)
  }
})

router.post('/cancel/:orderId', async (req, res, next) => {
  let orderId = req.params.orderId
  try {
    let order = await Order.findOne({
      where: {
        id: orderId
      },
      include: {
        model: Beer
      }
    })
    await order.update({status: 'cancelled'})
    res.send(order)
  } catch (err) {
    next(err)
  }
})
