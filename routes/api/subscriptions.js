const express = require('express');
const router = express.Router();
const Subscription = require('../../models/Subscription');
const auth = require('../../middlewares/auth');

// get `limit` number of subscriptions with authentication sorted by price/timestamp
router.post('/subs/:sortby/:order/:limit', auth, async (req, res) => {
	if (req.user.username === 'mikki' && req.user.password === 'test') {	
		try {
			const subscriptions = await Subscription
				.find({})
				// .sort({ [req.params.sortby]: [req.params.order] });
				.limit(parseInt(req.params.limit, 10))

			res.status(200).json(subscriptions);	
		} catch(ex) {
			console.log('error fetching all subscriptions:', ex.message);
			res.status(500).json({ message: 'error fetching all subscriptions' });
		}
	} else {
		res.status(401).json({ message: '/subs/:sortby/:order/:limit server route: username or password incorrect' });
	}
});

// get all unique (distinct) timestamps
router.post('/timestamps', auth, async (req, res) => {
	if (req.user.username === 'mikki' && req.user.password === 'test') {	
		try {
			const timestamps = await Subscription
				// .limit(req.params.limit);	// mongo error: limit cannot be used with distinct
				.distinct('timestamp')

				res.status(200).json(timestamps);
		} catch(ex) {
			console.log('error fetching all timestamps:', ex.message);
			res.status(500).json({ message: 'error fetching all timestamps' });
		}	
	} else {
		res.status(401).json({ message: '/timestamps server route: username or password incorrect' });
	}
});

// get number of entries for an individual timestamp
router.post('/entries', auth, async (req, res) => {
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
		res.status(401).json({ message: '/entries/:timestamp server route: username or password incorrect' });
	}
});

// sum `price` for each individual timestamp
router.post('/prcs/:limit', auth, async (req, res) => {
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
		res.status(401).json({ message: '/prices/test/:limit server route: username or password incorrect' });
	}
});

module.exports = router;
