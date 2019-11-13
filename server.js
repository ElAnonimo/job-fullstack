const express = require('express');
const mongoose = require('mongoose');
const csvParser = require('csv-parser');
// const fs = require('fs');
const keys = require('./config/keys');
// const Subscription  = require('./models/Subscription');
const subsRoute = require('./routes/api/subscriptions');

const app = express();

// use body parser middleware
app.use(express.json({ extended: false }));

// define routes
app.use('/api/subscriptions', subsRoute);

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

// const results = [];

// const readStream = fs.createReadStream('data/data.csv');
// readStream
// 	.pipe(csvParser({
// 		headers: ['name', 'timestamp', 'price'],
// 		mapValues: ({ header, value }) => {
// 			if (header === "price" || header === "timestamp") {
// 				return parseInt(value, 10);
// 			} else {
// 				return value;
// 			}
// 		}	
// 	}))
// 	.on('data', (data) => results.push(data))
// 	// .on('end', () => insertToDb(results.slice(0, 10)));
// 	.on('end', () => {
// 		console.log(results.slice(0, 10));
// 		readStream.destroy();
// 	})
// 	.on('close', (err) => {
// 		console.log('Stream has been destroyed and file has been closed');
// 	});

// const insertToDb = (data) => Subscription.insertMany(data, (error, res) => {
// 	if (error) {
// 		console.log('Subscription.insertMany() error:', error);
// 	}
// 	if (res) {
// 		console.log(`inserted docs to collection: ${res}`);
// 	}
// });

const port = process.env.PORT || 5000;

app.listen(port, () => console.log('fullstack app is listening on port', port));
