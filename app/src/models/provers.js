const Sequelize = require('sequelize');

class ProverModel {
  constructor(db) {
    this.model = db.define('provers', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      address: { type: Sequelize.STRING, allowNull: false },
      commitment: { type: Sequelize.TEXT, allowNull: false },
      height: { type: Sequelize.INTEGER, allowNull: false },
      coinbase_target: { type: Sequelize.INTEGER },
      proof_target: { type: Sequelize.INTEGER },
    }, {
      // don't add the timestamp attributes (updatedAt, createdAt)
      timestamps: false,
    });
  }

  async bulkCreateProvers(provers) {
    if (provers != null || provers.length > 0) {
      const result = await this.model.bulkCreate(provers);
      return result;
    }
    return null;
  }
}

module.exports = ProverModel;
