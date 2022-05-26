import bodyParser from 'body-parser';
import compression from 'compression';
import cors from 'cors';
import express from 'express';
import fs from 'fs';
import helmet from 'helmet';
import http from 'http';
import https from 'https';
import morgan from 'morgan';
import { Server, Socket } from 'socket.io';
import { createAdapter } from 'socket.io-redis';
import { isProduction } from '../../../config';
import { logger } from "../../../logger";
import { createDefaultAccountController } from '../../../modules/account/useCases/createDefaultAccount';
import { redisConnection } from '../../services';
import { _db_connect_promise } from '../db/connection';
import { swaggerRouter } from './api/docs';
import { v1Router, v1SocketHandler } from './api/v1';

const corsConfig = {
    origin: isProduction ? '*' : '*',
};

const app = express();

const createServer = () => {
    if (isProduction) {
        console.log('------- PRODUCTION MODE --------');

        // Certificate
        const domain = process.env['SERVER_DOMAIN_NAME'];
        const privateKey = fs.readFileSync(`/etc/letsencrypt/live/${domain}/privkey.pem`, 'utf8');
        const certificate = fs.readFileSync(`/etc/letsencrypt/live/${domain}/cert.pem`, 'utf8');
        const ca = fs.readFileSync(`/etc/letsencrypt/live/${domain}/chain.pem`, 'utf8');
        const credentials = {
            key: privateKey,
            cert: certificate,
            ca,
        };
        return https.createServer(credentials, app);
    } else {
        console.log('------- DEVELOPMENT MODE --------');
        return http.createServer(app);
    }
};

const server = createServer();

const port = process.env.PORT || (isProduction ? 443 : 5000);

export const io = new Server(server, {
    path: '/api/v1/ws',
    adapter: createAdapter({
        pubClient: redisConnection,
        subClient: redisConnection.duplicate(),
    }),
    cors: corsConfig,
});

io.on('connection', (socket: Socket) => {
    v1SocketHandler(socket);
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors(corsConfig));
app.use(compression());
app.use('/nettu/api/v1', swaggerRouter);
app.use(helmet());
app.use(morgan('combined'));
app.use('/nettu/api/v1', v1Router);

server.listen(port, '127.0.0.1' as unknown as number, async () => {
    logger.info(`[App]: Listening on port ${port}`);

    // Setup default account if provided
    await _db_connect_promise;
    createDefaultAccountController.execute();
});
