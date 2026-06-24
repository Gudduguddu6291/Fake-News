import User from '../models/User.js';
import Response from '../models/Response.js';

export const getUser = async (req, res) => {
    try {
        const userId = req.userId;
        const user = await User.findById(userId)
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.status(200).json({ user });
    }
    catch (error) {
        console.error('Error in getUser:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

export const getHistory = async (req, res) => {
  try {
    const history = await Response.find({
      user: req.userId,
    }).sort({ createdAt: -1 });

    res.status(200).json(history);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};