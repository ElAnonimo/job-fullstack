const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SubscriptionSchema = new Schema({
	name: {
		type: String,
		index: true		// https://mongoosejs.com/docs/guide.html#indexes. Needed for MongoDB sort on big collections
	},
	timestamp: {
		type: Number,
		index: true
		// unique: true		// avoid insert duplicates on nodemon restart server.js
	},
	price: {
		type: Number,
		index: true
	}
});

const Subscription = mongoose.model('subscription', SubscriptionSchema);

module.exports = Subscription;
