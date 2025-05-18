const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
    bio: {
        type: String,
        required: false
    },
    socialMediaLinks: {
        type: [String],
        required: false
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    }
}, { timestamps: true });

const Profile = mongoose.model('Profile', profileSchema);

module.exports = Profile; 