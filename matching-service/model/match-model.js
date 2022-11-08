import { DataTypes } from 'sequelize';

const MatchModel = (sequelize) => sequelize.define('MatchModel', {
  // Model attributes are defined here
  hostPlayer: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  hostSocket: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  difficulty: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  timestamps: false
});

export default MatchModel;
