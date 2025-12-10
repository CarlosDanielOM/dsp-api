import { Schema, model } from 'mongoose';

const codeSchema = new Schema({
    code: { type: String, required: true },
    notes: { type: String, required: false, default: '' },
    created_by: { type: Schema.Types.ObjectId, ref: 'Dispatcher', required: true },

    // Voting system
    upvotes: { type: Number, required: true, default: 0 },
    downvotes: { type: Number, required: true, default: 0 },
    total_votes: { type: Number, required: true, default: 0 },

    trust_score: { type: Number, required: true, default: 100 },

    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
})

const buildingSchema = new Schema({
    address: { type: String, required: true, index: true },
    name: { type: String, required: false, default: '' },
    notes: { type: String, required: false, default: '' },
    
    access_codes: [codeSchema],
    locker_codes: [codeSchema],

    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
});

const Building = model('Building', buildingSchema);

export default Building;