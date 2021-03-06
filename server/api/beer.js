const router = require('express').Router()
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const {Beer, Review, User, Category} = require('../db/models')
const {isUser, isAdmin, isMeOrAdmin} = require('../checks')
module.exports = router

// 8080/api/beer/
router.get('/', async (req, res, next) => {
  try {
    const beers = await Beer.findAll({
      where: {
        quantityInv: {
          [Op.not]: 0
        }
      },
      include: Category
    })
    res.json(beers)
  } catch (err) {
    next(err)
  }
})

// 8080/api/beer/filter/:types types = array joined with +
router.get('/filter/:types', async (req, res, next) => {
  try {
    const types = req.params.types.split('+')
    // all beer within given all categories
    const categories = await Category.findAll({
      where: {
        type: {
          [Op.or]: types
        }
      },
      include: {
        model: Beer,
        where: {
          quantityInv: {
            [Op.not]: 0
          }
        }
      },
      returning: true
    })
    let beerArray = []
    let beerIds = []
    if (categories.length) {
      for (let i = 0; i < types.length; i++) {
        let category = categories[i]
        if (category) {
          let beers = category.beers
          beers.forEach(beer => {
            if (!beerIds.includes(beer.id)) {
              beerIds.push(beer.id)
              beerArray.push(beer)
            }
          })
        }
      }
    }

    res.json(beerArray)
  } catch (err) {
    next(err)
  }
})

router.get('/search', async (req, res, next) => {
  try {
    const beerArray = await Beer.findAll({
      where: {
        name: {
          [Op.iLike]: '%' + req.query.name + '%'
        },
        quantityInv: {
          [Op.not]: 0
        }
      }
    })
    res.json(beerArray)
  } catch (err) {
    next(err)
  }
})

// 8080/api/beer/:id
router.get('/:beerId', async (req, res, next) => {
  let beerId = req.params.beerId

  try {
    const beer = await Beer.findByPk(beerId, {
      include: [{model: Review, include: {model: User}}, {model: Category}]
    })

    let total = 0
    if (beer.reviews === undefined || beer.reviews.length === 0) {
      beer.dataValues.averageRating = 'No Ratings Yet!'
    } else {
      beer.reviews.forEach(review => {
        total += review.rating
      })
      beer.dataValues.averageRating = `${(total / beer.reviews.length).toFixed(
        1
      )}/5`
    }
    res.send(beer)
  } catch (err) {
    next(err)
  }
})

// 8080/api/beer/

router.post('/', isAdmin, async (req, res, next) => {
  try {
    const newBeer = await Beer.create(req.body)
    res.json(newBeer)
  } catch (err) {
    next(err)
  }
})

// 8080/api/beer/:id/review
router.post('/:id/review', isUser, async (req, res, next) => {
  try {
    const {id} = req.user
    const {rating, description} = req.body

    const beer = await Beer.findByPk(req.params.id)

    const newReview = await Review.create({rating, description, userId: id})
    newReview.setBeer(beer)
    const review = await Review.findOne({
      where: {
        id: newReview.id
      },
      include: {
        model: User
      }
    })
    res.json(review)
  } catch (err) {
    next(err)
  }
})

// 8080/api/beer/:beerId

router.put('/:beerId', isAdmin, async (req, res, next) => {
  let beerId = req.params.beerId

  try {
    const beer = await Beer.findByPk(beerId)
    beer.update(req.body)
    res.send(beer)
  } catch (err) {
    next(err)
  }
})

router.get('/pagination/page?', async (req, res, next) => {
  try {
    let beers = await Beer.findAll({
      limit: 50,
      offset: 1
    })
    res.json(beers)
  } catch (err) {
    next(err)
  }
})
