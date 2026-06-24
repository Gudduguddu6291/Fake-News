import jwt from 'jsonwebtoken';
export const isAuth = async (req, res, next) => {
    try {
        const cookieHeader = req.headers.cookie || '';
        const cookies = Object.fromEntries(
            cookieHeader
                .split(';')
                .map((cookie) => cookie.trim().split('='))
                .filter(([key, value]) => key && value)
                .map(([key, value]) => [key, decodeURIComponent(value)])
        );
        let token = req.cookies?.token || cookies.token;
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized: No token provided' });
        }
        let verifiedToken = jwt.verify(token, process.env.JWT_SECRET);
        if (!verifiedToken) {
            return res.status(401).json({ message: 'Unauthorized: Invalid token' });
        }
        req.userId = verifiedToken.userId;
        next();
    } 
    catch (error) {
        console.error('Error in isAuth middleware:', error);
        return res.status(500).json({ message: 'isAuth server error' });
    }
}
