import express from 'express';
import { detectFakeNews } from '../controllers/predict.js';
import { isAuth } from '../middlewares/isAuth.js';

const predictRouter = express.Router();
predictRouter.post('/', isAuth, detectFakeNews);
export default predictRouter;