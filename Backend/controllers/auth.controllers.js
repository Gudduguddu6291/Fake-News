import User from '../models/User.js';
import { getToken } from '../config/token.js'

export const googleauth = async (req, res) => {
    try {
        const { firebaseUid, email, name } = req.body;
        let user = await User.findOne({ email });
        if(!user) {
            user = await User.create({ firebaseUid: firebaseUid || email, email, name });
        }
        let token = await getToken(user._id);
        res.cookie('token', token, { 
            httpOnly: true, 
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });
        return res.status(200).json({ message: 'User authenticated successfully', user });
    } 
    catch (error) {
        console.error('Error in googleauth:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const logout = async (req, res) => {
    try{
        await res.clearCookie('token');
        return res.status(200).json({ message: 'User logged out successfully' });
    } 
    catch (error) {
        console.error('Error in logout:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}
