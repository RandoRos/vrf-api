import express from 'express';

import './environment';

import { mediaContextController } from './controller';

export const app = express();
const port = 3000;

const router = express.Router();

router.get('/sessions/:sessionId', mediaContextController);

app.use('/api', router);

app.listen(port, () => {
  console.info(`Service is listening at http://localhost:${port}`);
});
