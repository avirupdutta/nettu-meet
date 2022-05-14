import express from 'express';
import { docsRouter } from '../../../../docs/spec';
const swaggerRouter = express.Router();

swaggerRouter.use('/docs', docsRouter)

export { swaggerRouter };
