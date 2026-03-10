import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const _filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(_filename);
dotenv.config({ path: path.join(_dirname, '.env') });

import express from 'express';
import cors from 'cors';
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

import swaggerUi from 'swagger-ui-express';

import swaggerSpec from './config/swagger.config.js';
import initWebsocket from './services/websocketService.js';
import { startAlertScheduler } from './services/alertScheduler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('trust proxy', 1);

const PORT = process.env.PORT || 10000;

const ALLOWED_ORIGINS = [
    'http://localhost:5173',
    process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
    cors({
        origin: ALLOWED_ORIGINS,
        credentials: true,
    }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

        if (process.env.NODE_ENV !== 'production') {
            await sequelize.query('SET session_replication_role = replica');
            await sequelize.sync();
            await sequelize.query('SET session_replication_role = DEFAULT');
        }

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
