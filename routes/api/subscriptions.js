const express = require('express');
const router = express.Router();
const Subscription = require('../../models/Subscription');
const auth = require('../../middlewares/auth');

// test route with pagination
router.get('/test/subs', auth, async (req, res) => {
	console.log('server /test/subs pageNumber:', req.query.page_number);
	console.log('server /test/subs nameFilter:', req.query.name_filter);
	console.log('server /test/subs min:', req.query.min);
	console.log('server /test/subs max:', req.query.max);
	console.log('server /test/subs unix start timestamp:', req.query.unix_start_timestamp);
	console.log('server /test/subs unix end timestamp:', req.query.unix_end_timestamp);
	console.log('server /test/subs per_page:', req.query.per_page);
	console.log('server /test/subs sort_by:', req.query.sort_by);
	console.log('server /test/subs sort_order:', req.query.sort_order);

	const resultsPerPage = parseInt(req.query.per_page, 10);
	const pageNumber = parseInt(req.query.page_number, 10);

	const isNumber = value => {
		if (typeof value !== 'number') {
			return false;
		}
		if (value !== Number(value)) {
			return false;
		}
		if (Number.isFinite(value) === false) {
			return false;
		}
		return true;
	};

	try {
		/* const docs = await Subscription
			.aggregate([
				{ "$facet": {
					"records": [
						{ "$match": {} },
						{ "$skip": (currentPage - 1) * RESULTS_PER_PAGE },
						{ "$limit": RESULTS_PER_PAGE }
					],
					"count": [
						{ "$count": "count" }
					]
				} }
			]); */

			// .find({})
			// .skip((currentPage - 1) * RESULTS_PER_PAGE)
			// .limit(RESULTS_PER_PAGE);
			
		/* if (req.params.name_filter)	{
			const records = await Subscription
				.find({ name: [req.params.name_filter] })
				.skip((currentPage - 1) * RESULTS_PER_PAGE)
				.limit(RESULTS_PER_PAGE);
		} else {
			const records = await Subscription
				.find({})
				.skip((currentPage - 1) * RESULTS_PER_PAGE)
				.limit(RESULTS_PER_PAGE);
		} */

		let query = {};
		let sort = {};

		if (req.query.name_filter && typeof req.query.name_filter === 'string') {
			// console.log('subscriptions route ');

			query['name'] = {};
			query['name']['$regex'] = req.query.name_filter;
		}
		
		if (req.query.min > 0 || req.query.max > 0) {
			console.log('subscriptions.js req.query.min:', req.query.min);

			query['price'] = {};
			
			if (req.query.min && req.query.min > 0) {
				query['price']['$gte'] = req.query.min * 100;
			}
		
			if (req.query.max && req.query.max > 0) {
				query['price']['$lte'] = req.query.max * 100;
			}
		}

		if (req.query.unix_start_timestamp || req.query.unix_end_timestamp) {
			console.log('backend api req.query.unix_start_timestamp:', req.query.unix_start_timestamp);

			query['timestamp'] = {};

			if (req.query.unix_start_timestamp) {
				query['timestamp']['$gte'] = req.query.unix_start_timestamp;
				console.log('query["timestamp"]["$gte"]:', query['timestamp']['$gte']);
			}

			if (req.query.unix_end_timestamp) {
				query['timestamp']['$lte'] = req.query.unix_end_timestamp;
			}
		}

		if (req.query.sort_by && req.query.sort_order) {
			sort = { [req.query.sort_by]: req.query.sort_order === 'asc' ? 1 : -1 };
		}
		
		const records = await Subscription
			.find(query)
			.skip((pageNumber - 1) * resultsPerPage)
			.limit(resultsPerPage)
			.sort(sort);			

		// console.log('server records:', records);
		// console.log('server records.length:', records.length);	
		
		const size = await Subscription
			.find(query)
		 	.countDocuments();
			
		// const size = records.length;

		res.status(200).json({
			records,
			size
		});
	} catch(ex) {
		console.log('error fetching docs from Subscription:', ex.message);
		res.status(500).json({ message: `error fetching docs from Subscription: ${ex.message}` });
	}
});

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
					// { $limit: parseInt(req.params.limit, 10) }
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
