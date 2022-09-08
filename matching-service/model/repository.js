import MatchModel from './match-model.js';
import 'dotenv/config'

// Set up mongoose connection
import mongoose from 'mongoose';

let mongoDB = process.env.ENV == "PROD" ? process.env.DB_CLOUD_URI : process.env.DB_LOCAL_URI;

mongoose.connect(mongoDB, { useNewUrlParser: true , useUnifiedTopology: true});

let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

export async function createMatch(params) { 
  return new MatchModel(params)
}

export async function getAvailableMatch(difficulty) {
  let availableMatch = await db.collection("matchmodels").findOneAndDelete({ difficulty })
    .then(result => result)
    .catch(error => error);
  return availableMatch;
}
