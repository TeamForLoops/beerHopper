const Beer = require('./server/db/models/beer')
const db = require('./server/db/db')
const User = require('./server/db/models/user')

const seedUsers = [
  {
    username: 'theo_truong',
    role: 'guest',
    email: 'theo@gmail.com',
    password: '123theo'
  },
  {
    username: 'andrea_soloko',
    role: 'user',
    email: 'andrea@gmail.com',
    password: '123andrea'
  },
  {
    username: 'natalie_estrada',
    role: 'admin',
    email: 'natalie@gmail.com',
    password: '123natalie'
  },
  {
    username: 'pinzhi_zhang',
    role: 'guest',
    email: 'pinzhi@gmail.com',
    password: '123pinzhi'
  },
  {
    username: 'lea_seydoux',
    role: 'user',
    email: 'lea@gmail.com',
    password: '123lea'
  },
  {
    username: 'jim_harbough',
    role: 'admin',
    email: 'jim@gmail.com',
    password: '123jim'
  },
  {
    username: 'ariana_grande',
    role: 'user',
    email: 'ariana@gmail.com',
    password: '123ariana'
  },
  {
    username: 'steve_green',
    role: 'guest',
    email: 'steve@gmail.com',
    password: '123steve'
  }
]

const seedBeers = [
  {
    name: 'Bad Mama Yama',
    type: 'ale',
    ibu: 25,
    color: 'red',
    description: 'Sweet potato ale. Comparable to pumpkin spice ales.',
    imageUrl: '/images/bad-mama-yama.jpg',
    quantityInv: 20,
    price: 12.99
  },
  {
    name: 'Dark Paradise',
    type: 'stout',
    ibu: 8,
    color: 'dark',
    description:
      'Stout with coconut added in secondary. Chocolatey, roasty, coconutty, delicious.',
    imageUrl: '/images/dark-paradise.jpg',
    quantityInv: 10,
    price: 15.0
  },
  {
    name: 'Hibiscus Saison',
    type: 'saison',
    ibu: 40,
    color: 'light',
    description:
      'Slightly tart, sessionable saison with a beautiful light pink color',
    imageUrl: '/images/hibiscus-saison.jpg',
    quantityInv: 100,
    price: 49.99
  },
  {
    name: 'Hi Honey',
    type: 'ale',
    ibu: 25,
    color: 'light',
    description: 'American honey ale, brewed and fermented with honey',
    imageUrl: '/images/hi-honey.jpg',
    quantityInv: 10,
    price: 8.99
  },
  {
    name: 'Wedding Saison',
    type: 'saison',
    ibu: 13,
    color: 'light',
    description: 'Become married with the saison at the firts sip',
    imageUrl: '/images/wedding-saison.jpg',
    quantityInv: 2,
    price: 5.99
  },
  {
    name: 'J',
    type: 'ale',
    color: 'light',
    price: 5.0
  }
]

// from robots and projects seed
const seed = async () => {
  try {
    await db.sync({force: true})
    const [
      beerOne,
      beerTwo,
      beerThree,
      beerFour,
      beerFive,
      beerSix
    ] = await Beer.bulkCreate(seedBeers, {returning: true})
    const [
      userOne,
      userTwo,
      userThree,
      userFour,
      userFive,
      userSix,
      userSeven,
      userEight
    ] = await User.bulkCreate(seedUsers, {returning: true})
    console.log('done seeding users!')
    db.close()
  } catch (err) {
    console.log(err)
  }
}

seed()

module.exports = seed
