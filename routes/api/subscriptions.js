const express = require('express');
const router = express.Router();
const Subscription = require('../../models/Subscription');
const auth = require('../../middlewares/auth');

// get all subscriptions with authentication
router.post('/', async (req, res) => {
	console.log('req.body:', req.body);

	if (req.body.username === 'mikki' && req.body.password === 'test') {
		try {
			const subscriptions = await Subscription
				.find({})
				// .limit(10);
	
			res.status(200).json(subscriptions);	
		} catch(ex) {
			console.log('error fetching all subscriptions:', ex.message);
			res.status(500).json({ message: 'error fetching all subscriptions' });
		}
	} else {
		res.status(401).json({ message: '/ username or password incorrect' });
	}
});

// get `limit` number of subscriptions with authentication sorted by price/timestamp
router.post('/subs/:sortby/:order/:limit', auth, async (req, res) => {
	console.log('req.body:', req.body);
	console.log('req.params:', req.params);
	console.log('/subs/:sortby/:order/:limit req.user:', req.user);

	if (req.user.username === 'mikki' && req.user.password === 'test') {	
		try {
			const subscriptions = await Subscription
				.find({})
				.limit(parseInt(req.params.limit, 10))
				// .sort({ [req.params.sortby]: [req.params.order] });
	
			res.status(200).json(subscriptions);	
		} catch(ex) {
			console.log('error fetching all subscriptions:', ex.message);
			res.status(500).json({ message: 'error fetching all subscriptions' });
		}
	} else {
		res.status(401).json({ message: '/subs/:sortby/:order/:limit username or password incorrect' });
	}
});

// get all unique (distinct) timestamps
router.post('/timestamps', auth, async (req, res) => {
	console.log('req.user from /timestamps backend route:', req.user);
	console.log('req.body from /timestamps backend route:', req.body);

	if (req.user.username === 'mikki' && req.user.password === 'test') {	
		try {
			const timestamps = await Subscription
				.distinct('timestamp')
				// .limit(req.params.limit);	// mongo error: limit cannot be used with distinct

				res.status(200).json(timestamps);
				// console.log('timestamps from /timestamps backend route:', timestamps);
		} catch(ex) {
			console.log('error fetching all timestamps:', ex.message);
			res.status(500).json({ message: 'error fetching all timestamps' });
		}
		
	} else {
		res.status(401).json({ message: '/timestamps username or password incorrect' });
	}
});

// get number of entries for an individual timestamp
router.post('/entries', auth, async (req, res) => {
	console.log('req.user from /entries backend route:', req.user);
	console.log('req.body from /entries backend route:', req.body);

	if (req.user.username === 'mikki' && req.user.password === 'test') {
		try {
			const entries = await Subscription
				.aggregate([
					{ $match: { timestamp: { $in: req.body.timestamps } } },
					{ $group: { 
						_id: "$timestamp",
						count: { $sum: 1 }
					}},
					{ $project: {
						_id: false,
						"timestamp": "$_id",
						count: true
					}}
				]);

			res.status(200).json({ entries });
		} catch(ex) {
			console.log('error fetching all entires for an individual timestamp:', ex.message);
			res.status(500).json({ message: 'error fetching all entires for an individual timestamp' });
		}
	} else {
		res.status(401).json({ message: '/entries/:timestamp username or password incorrect' });
	}
});

// get `price` data sum for an individual timestamp
router.post('/prices/:timestamp/:limit', auth, async (req, res) => {
	console.log('/prices/:timestamp/:limit:', req.user);

	if (req.user.username === 'mikki' && req.user.password === 'test') {
		try {
			const entries = await Subscription
				.aggregate([
					{ $match: { timestamp: parseInt(req.params.timestamp, 10) } },
					{ $group: {
						_id: "$timestamp",
						sum: { $sum: "$price" }
					}},
					{ $project: {
						_id: false,
						"timestamp": "$_id",
						sum: true						
					}},
					{ $limit: parseInt(req.params.limit, 10) }
				])

				res.status(200).json({ entries });		
		} catch(ex) {
			console.log('error fetching all entires for an individual timestamp:', ex.message);
			res.status(500).json({ message: 'error fetching all entires for an individual timestamp' });
		}
	} else {
		res.status(401).json({ message: '/prices/:timestamp/:limit username or password incorrect' });
	}
});

// get `price` sum for each individual timestamp
router.post('/prcs/:limit', auth, async (req, res) => {
	console.log('req.body.timestamps:', req.body.timestamps);
	console.log('req.user.username:', req.user.username);
	console.log('limit:', req.params.limit);

	if (req.user.username === 'mikki' && req.user.password === 'test') {
		try {
			const entries = await Subscription
				.aggregate([
					{ $match: { timestamp: { $in: req.body.timestamps } } },
					{ $group: {
						_id: "$timestamp",
						sum: { $sum: "$price" }
					}},
					{ $project: {
						_id: false,
						"timestamp": "$_id",
						sum: true
					}},
					{ $limit: parseInt(req.params.limit, 10) }
				])

				res.status(200).json({ entries });
		} catch(ex) {
			console.log('error fetching price sum for an individual timestamp:', ex.message);
			res.status(500).json({ message: 'error fetching price sum for an individual timestamp' });
		}
	} else {
		res.status(401).json({ message: '/prices/test/:limit username or password incorrect' });
	}
});

module.exports = router;
