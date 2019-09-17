import Beer from '../server/db/models/beer';
import User from '../server/db/models/user';
const Review = require('../server/db/models/review');

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
		description: 'Stout with coconut added in secondary. Chocolatey, roasty, coconutty, delicious.',
		imageUrl: '/images/dark-paradise.jpg',
		quantityInv: 10,
		price: 15.0
	},
	{
		name: 'Hibiscus Saison',
		type: 'saison',
		ibu: 40,
		color: 'light',
		description: 'Slightly tart, sessionable saison with a beautiful light pink color',
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
		name: 'Jalapeno Business',
		type: 'ale',
		color: 'light',
		price: 5.0
	}
];

const seedReviews = [
	{
		description: 'Love this beer. Great on a hot day!',
		rating: 5
	},
	{
		description: 'I do not even like beer, but I still enjoyed this drink',
		rating: 4
	},
	{
		description: 'I did not even receive my order. Terrible.',
		rating: 1
	},
	{
		description:
			'I bought this beer as a gift for a friend. The bottle cracked and I did not want to waste it. so I licked the bottle. Cut my tongue but the beer tasted great.',
		rating: 5
	},
	{
		description: 'I think it is all right',
		rating: 3
	},
	{
		description: 'The bottle design looks pretty',
		rating: 2
	},
	{
		description: 'I am definitely 21 years old and can drink. This is a good drink.',
		rating: 4
	}
];

// from robots and projects seed
const seed = async () => {
	try {
		await db.sync({ force: true });
		const [ beerOne, beerTwo, beerThree, beerFour, beerFive, beerSix ] = await Beer.bulkCreate(seedBeers, {
			returning: true
		});
		const [ userOne, userTwo, userThree, userFour, userFive ] = await User.bulkCreate(seedUsers, {
			returning: true
		});
		const [
			reviewOne,
			reviewTwo,
			reviewThree,
			reviewFour,
			reviewFive,
			reviewSix,
			reviewSeven
		] = await Review.bulkCreate(seedReviews, {
			returning: true
		});
		await beerOne.addReviews([ reviewOne, reviewTwo ]);
		await beerTwo.addReview(reviewThree);
		await beerThree.addReview(reviewFour);
		await beerFour.addReview(reviewFive);
		await beerFive.addReview(reviewSix);
		await beerSix.addReview(reviewSeven);
		db.close();
	} catch (err) {
		console.log(err);
	}
};

seed();
module.exports = seed;
