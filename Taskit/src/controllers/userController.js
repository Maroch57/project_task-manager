// userController.js
const User = require('../models/User'); // Your User model

// Get User Profile
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findUnique({ where: { id: req.user.id } }); // Adjust according to your User model
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ user });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Update User Profile
const updateUserProfile = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findUnique({ where: { id: req.user.id } });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Only update email if provided
        if (email) {
            user.email = email;
        }

        // Only update password if provided
        if (password) {
            user.password = await bcrypt.hash(password, 10);
        }

        await User.update({ where: { id: req.user.id }, data: user });

        res.json({ message: 'Profile updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    getUserProfile,
    updateUserProfile
};
