import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const _filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(_filename);
dotenv.config({ path: path.join(_dirname, '.env') });

import express from 'express';
import cors from 'cors';
import session from 'express-session';
import connectSessionSequelize from 'connect-session-sequelize';
import sequelize from './controllers/dbController.js';
import './models/index.js';
import http from 'http';

import pointOfInterestRoutes from './routes/pointOfInterestRoutes.js';
import userRoutes from './routes/userRoutes.js';
import alertRoutes from './routes/alertRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import userLocationRoutes from './routes/userLocationRoutes.js';
import locationRoutes from './routes/locationRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import pushRoutes from './routes/pushRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import authRoutes from './routes/authRoutes.js';

import swaggerUi from 'swagger-ui-express';

import swaggerSpec from './config/swagger.config.js';
import initWebsocket from './services/websocketService.js';
import { startAlertScheduler } from './services/alertScheduler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const PORT = process.env.PORT || 85;

const isProduction =
    process.env.NODE_ENV === 'production' ||
    (process.env.FRONTEND_URL &&
        process.env.FRONTEND_URL.includes('canaryweather.xyz'));
const isDevelopment = !isProduction;

const ALLOWED_ORIGINS = [
    'http://localhost:5173',
    'http://134.209.22.118:5173',
    'https://canaryweather.xyz',
];

app.use(
    cors({
        origin: ALLOWED_ORIGINS,
        credentials: true,
    }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const SequelizeStore = connectSessionSequelize(session.Store);
const sessionStore = new SequelizeStore({
    db: sequelize,
    tableName: 'Sessions',
});


app.use(
    session({
        secret: process.env.SESSION_SECRET || 'supersecretkey',
        store: sessionStore,
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: false,
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
        },
    }),
);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get(['/api/docs', '/docs'], (req, res, next) => {
    if (!req.originalUrl.endsWith('/')) {
        return res.redirect(req.originalUrl + '/');
    }
    next();
});

app.use(
    ['/api/docs', '/docs'],
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
        customCss: '.swagger-ui .topbar { display: none }',
        customSiteTitle: 'CanaryWeather API Docs',
        customJs:
            'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.min.js',
        customCssUrl:
            'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css',
    }),
);

app.get(['/api/docs.json', '/docs.json'], (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
});

app.get('/api-docs', (req, res) => {
    res.redirect('/api/docs/');
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/pois', pointOfInterestRoutes);

app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);

app.use('/api/locations', locationRoutes);

app.use('/api/alerts', alertRoutes);

app.use('/api/notifications', notificationRoutes);

app.use('/api/user-locations', userLocationRoutes);

app.use('/admin', adminRoutes);
app.use('/api/push', pushRoutes);
app.use('/api/ai', aiRoutes);

app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'CanaryWeather API is running' });
});

(async () => {
    try {
        await sequelize.authenticate();

        await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');

        await sequelize.sync();

        await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');

        await sessionStore.sync();

        const server = http.createServer(app);

        initWebsocket(server);

        server.on('error', (error) => {
            console.error('Server failed to start:', error);
        });

        server.listen(PORT, () => {
            startAlertScheduler();
        });
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
})();
