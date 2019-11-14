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

const port = process.env.PORT || 5000;

app.listen(port, () => console.log('fullstack app is listening on port', port));
