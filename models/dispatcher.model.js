import { Schema, model } from 'mongoose';

const dispatcherSchema = new Schema({
    name: { type: String, required: true },
    pin: { type: String, required: true },
    trust_score: { type: Number, required: true, default: 25 },
    admin: { type: Boolean, required: true, default: false },

    score: { type: Number, required: true, default: 0 },
    total_score: { type: Number, required: true, default: 0 },
    
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
});

const Dispatcher = model('Dispatcher', dispatcherSchema);

export default Dispatcher;