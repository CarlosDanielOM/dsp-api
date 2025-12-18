import mongoose from 'mongoose';

export const connectToMongo = async () => {
    await mongoose.connect(process.env.MONGO_URI).catch(err => {
        console.error('MongoDB connection error:', err);
        throw new Error('Failed to connect to MongoDB');
    });

    return mongoose.connection;
}

export const closeMongoConnection = async () => {
    await mongoose.connection.close().catch(err => {
        throw new Error('Failed to close MongoDB connection');
    });
}