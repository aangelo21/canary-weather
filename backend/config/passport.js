import passport from 'passport';
import { Strategy as GitHubStrategy } from 'passport-github2';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { User } from '../models/index.js';
import dotenv from 'dotenv';

dotenv.config();

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findByPk(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

// GitHub Strategy
if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
    passport.use(
        new GitHubStrategy(
            {
                clientID: process.env.GITHUB_CLIENT_ID,
                clientSecret: process.env.GITHUB_CLIENT_SECRET,
                callbackURL: '/api/auth/github/callback',
                scope: ['user:email'],
            },
            async (accessToken, refreshToken, profile, done) => {
                try {
                    const email =
                        profile.emails && profile.emails[0]
                            ? profile.emails[0].value
                            : null;
                    const username = profile.username;

                    if (!email) {
                        return done(
                            new Error(
                                'No email found in GitHub profile. Please make your email public or use another login method.',
                            ),
                            null,
                        );
                    }

                    // Check if user exists
                    let user = await User.findOne({ where: { email } });

                    if (!user) {
                        // Create new user
                        user = await User.create({
                            email,
                            username: username || email.split('@')[0],
                            profile_picture_url:
                                profile.photos && profile.photos[0]
                                    ? profile.photos[0].value
                                    : null,
                            is_admin: false,
                        });
                    }

                    return done(null, user);
                } catch (err) {
                    return done(err, null);
                }
            },
        ),
    );
}

// Google Strategy
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    passport.use(
        new GoogleStrategy(
            {
                clientID: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                callbackURL: '/api/auth/google/callback',
            },
            async (accessToken, refreshToken, profile, done) => {
                try {
                    const email =
                        profile.emails && profile.emails[0]
                            ? profile.emails[0].value
                            : null;

                    if (!email) {
                        return done(
                            new Error('No email found in Google profile.'),
                            null,
                        );
                    }

                    let user = await User.findOne({ where: { email } });

                    if (!user) {
                        user = await User.create({
                            email,
                            username: profile.displayName || email.split('@')[0],
                            profile_picture_url:
                                profile.photos && profile.photos[0]
                                    ? profile.photos[0].value
                                    : null,
                            is_admin: false,
                        });
                    }

                    return done(null, user);
                } catch (err) {
                    return done(err, null);
                }
            },
        ),
    );
}

export default passport;
