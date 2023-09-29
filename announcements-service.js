const AnnouncementModel = require('./announcement-model');

class AnnouncementService {
	async create(data) {
		const newAnnouncement = new AnnouncementModel(data);
		try {
			const response = await newAnnouncement.save();
			return response.toJSON();
		} catch (error) {
			throw new Error("Announcement Creation Error");
		}
	}

	async update(id, data) {
		try {
			const response = await AnnouncementModel.findByIdAndUpdate(id, data, { new: true }).exec();
			return response.toJSON();
		} catch (error) {
			console.log(error);
			throw new Error("Announcement Update Error");
		}
	}

	async delete(id) {
		try {
			const response = await AnnouncementModel.findByIdAndDelete(id).exec();
			return response.toJSON();
		} catch (error) {
			console.log(error);
			throw new Error("Announcement Update Error");
		}
	}

	async get(query) {
		if (Object.keys(query).length) {
			const now = new Date();
			const twentyFourHoursFromNow = new Date(now.getTime() + 24 * 60 * 60 * 1000); 
			query['estimatedTime'] = {
				$gt: now,
				$lt: twentyFourHoursFromNow,
			};
		}
		const response = await AnnouncementModel.find(query).sort({ 'estimatedTime': '1' }).exec();
		return response;
	}
}

module.exports = AnnouncementService;