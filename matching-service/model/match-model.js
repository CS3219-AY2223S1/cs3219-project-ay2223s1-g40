import mongoose from 'mongoose';

var Schema = mongoose.Schema
let MatchModelSchema = new Schema({
    hostPlayer: {
        type: String,
        required: true,
        unique: true,
    },
    difficulty: {
        type: String,
        required: true,
    }
})

export default mongoose.model('MatchModel', MatchModelSchema)
