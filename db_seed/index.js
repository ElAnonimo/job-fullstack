const mongoose = require('mongoose');
const csvParser = require('csv-parser');
const fs = require('fs');
const Subscription = require('../models/Subscription');
const keys = require('../config/keys');

const connectDb = async () => {
	try {
		await mongoose.connect(keys.mongoURI, {
			useNewUrlParser: true,
      useCreateIndex: true,
			useFindAndModify: false,
			useUnifiedTopology: true
		});

		console.log('MongoLab connected.')
	} catch(ex) {
		console.log('MongoLab connection error:', ex)
	}
}

// connect to DB
connectDb();

const results = [];

const readStream = fs.createReadStream('data/data.csv');
readStream
	.pipe(csvParser({
		headers: ['name', 'timestamp', 'price'],
		mapValues: ({ header, value }) => {
			if (header === "price" || header === "timestamp") {
				return parseInt(value, 10);
			} else {
				return value;
			}
		}	
	}))
	.on('data', (data) => results.push(data))
	.on('end', () => {
		insertToDb(results);
		readStream.destroy();
	})
	.on('close', (err) => {
		console.log('Stream has been destroyed and file has been closed');
	});

const insertToDb = (data) => Subscription.insertMany(data, { ordered: false }, (error, res) => {
	if (error) {
		console.log('Subscription.insertMany() error:', error);
	}
	if (res) {
		console.log(`inserted docs to collection: ${res}`);
	}
});
