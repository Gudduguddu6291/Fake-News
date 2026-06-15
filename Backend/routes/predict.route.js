import express from 'express';
import { detectFakeNews } from '../controllers/predict.js';
const predictRouter = express.Router();
predictRouter.post('/', detectFakeNews);
export default predictRouter;