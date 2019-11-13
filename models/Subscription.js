const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SubscriptionSchema = new Schema({
	name: {
		type: String
	},
	timestamp: {
		type: Number,
		// unique: true		// avoid insert duplicates on nodemon restart server.js
	},
	price: {
		type: Number
	}
});

const Subscription = mongoose.model('subscription', SubscriptionSchema);

module.exports = Subscription;
