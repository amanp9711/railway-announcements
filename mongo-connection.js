const mongoose = require('mongoose');
class MongooseConnection {
	create() {
		// Connection URL for the local MongoDB database
		const mongoURL = 'mongodb://localhost:27017/railwaydata';
		mongoose.Promise = global.Promise;
		return new Promise((resolve,reject) => {
			mongoose.connect(mongoURL);
			mongoose.connection.on('connected', () => {
				console.log('MongooseConnection: Mongoose connection connected.');
				resolve('Connection is open'); // Resolve the promise
			});
			mongoose.connection.on('error', (err) => {
				console.error('MongooseConnection: Mongoose connection error:', err);
				reject(err); // Reject the promise if there's an error
			});
		})
	}
	
}
module.exports = MongooseConnection;