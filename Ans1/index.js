const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/User');
const Profile = require('./models/Profile');

const app = express();
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/user-profile-db', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Could not connect to MongoDB:', err));

// Add User Route
app.post('/add-user', async (req, res) => {
    try {
        const { name, email } = req.body;
        const user = new User({ name, email });
        await user.save();
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Add Profile Route
app.post('/add-profile', async (req, res) => {
    try {
        const { bio, socialMediaLinks, userId } = req.body;
        
        // Check if user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Check if profile already exists for this user
        const existingProfile = await Profile.findOne({ user: userId });
        if (existingProfile) {
            return res.status(400).json({ error: 'Profile already exists for this user' });
        }

        const profile = new Profile({
            bio,
            socialMediaLinks,
            user: userId
        });
        
        await profile.save();
        res.status(201).json(profile);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get all profiles with user details
app.get('/profiles', async (req, res) => {
    try {
        const profiles = await Profile.find().populate('user', 'name email');
        res.json(profiles);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 