import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
const TOKEN_EXPIRY = '15m';

export const generateAccessToken = (user) => {
    return jwt.sign(
        {
            id: user.id,
            username: user.username,
            email: user.email,
            profile_picture_url: user.profile_picture_url,
            is_admin: user.is_admin,
        },
        JWT_SECRET,
        { expiresIn: TOKEN_EXPIRY },
    );
};

export const generateResetToken = (user) => {
    return jwt.sign(
        {
            id: user.username,
            email: user.email,
            type: 'reset',
        },
        JWT_SECRET,
        { expiresIn: '1h' },
    );
};

export const verifyToken = (token) => {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        return null;
    }
};

export const decodeToken = (token) => {
    return jwt.decode(token);
};
