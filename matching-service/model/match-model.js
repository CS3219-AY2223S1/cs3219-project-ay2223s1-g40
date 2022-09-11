import { DataTypes } from 'sequelize';

const MatchModel = (sequelize) => sequelize.define('MatchModel', {
  // Model attributes are defined here
  hostPlayer: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  difficulty: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  timestamps: false
});

export default MatchModel;
