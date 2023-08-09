import express, { Express } from 'express';
import cors from 'cors';
import routes from './routes';
import bodyParser from 'body-parser';
import genericErrorHandler from './middlwares/genericErrorHandler';
import morgan from 'morgan';

const app: Express = express();

app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use('/ecommerce', routes);

app.use(genericErrorHandler);

export default app;
