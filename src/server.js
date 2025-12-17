import express from 'express';
import dotenv from 'dotenv';
import dispatcherRoute from './routes/dispatcher.routes.js';
import buildingRoute from './routes/building.routes.js';
import { connectToMongo } from '../utils/db/mongo.js';
import { connectToDragonflydb } from '../utils/db/dragonflydb.js';
dotenv.config();

await connectToMongo()
await connectToDragonflydb()

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/dispatchers', dispatcherRoute);
app.use('/buildings', buildingRoute);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});