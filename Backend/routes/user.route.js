import express from 'express';
import { getUser,getHistory } from '../controllers/user.controllers.js';
import {isAuth} from '../middlewares/isAuth.js'
const userRouter = express.Router();
userRouter.get('/profile', isAuth, getUser);
userRouter.get('/history', isAuth, getHistory);
export default userRouter;