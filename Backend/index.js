import express from 'express';
import connectdb from './config/db.js';
import dotenv from 'dotenv';
import cors from 'cors';
import authRouter from './routes/auth.routes.js';
import predictRouter from './routes/predict.route.js';
dotenv.config();
const app = express();
connectdb();
const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true,
};

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));
app.use(express.json());
app.get('/', (req, res) => {
    res.send('Hello World!');
});
app.use('/api/auth', authRouter);
app.use('/api/predict',predictRouter);
app.listen(8000, () => {
    console.log('Server is running on port 8000');
});
