import { Op, Sequelize } from 'sequelize';
import MatchModel from './match-model.js';
import 'dotenv/config'

const sequelize = new Sequelize('sqlite::memory:');
const matchModel = await MatchModel(sequelize);
sequelize.sync({ force: true }).then(() => console.log('db is ready'));

export async function createMatch(params) { 
  return matchModel.create(params);
}

export async function getAvailableMatch(socketId, difficulty) {
  console.log(socketId, difficulty);
  const availableMatch = await matchModel.findOne({
    where: { 
      difficulty,
      hostPlayer: {
        [Op.not]: socketId,  
      }
    }
  })
  .then(result => {
    return matchModel.destroy({ where: { difficulty }})
      .then(u => result)
  })
  .catch(error => error);
  return availableMatch;
}

export async function destroyMatch(hostPlayer) {
  return await matchModel.destroy({
    where: {
      hostPlayer
    }
  })
}
