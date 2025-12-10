import express from 'express';
import dotenv from 'dotenv';
import dispatcherRoute from './routes/dispatcher.routes.js';
dotenv.config();

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/dispatcher', dispatcherRoute);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});