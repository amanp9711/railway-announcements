const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const announcementSchema = new Schema({
	name: String,
	type: String,
	averageSpeed: Number,
	destinationStation: String,
	currentStation: String,
	estimatedTime: Date
	},
	{
		toJSON: {
			transform: (doc, ret) => {
				ret.id = doc._id.toHexString();
				delete ret._id;
				delete ret.__v;
			}
		}
	});

// Create a model based on the schema
const AnnouncementModel = mongoose.model('announcements', announcementSchema);

module.exports = AnnouncementModel;
