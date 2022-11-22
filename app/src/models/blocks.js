const Sequelize = require('sequelize');

class BlockModel {
  constructor(db) {
    this.model = db.define('blocks', {
      time: { type: Sequelize.DATE, primaryKey: true },
      height: { type: Sequelize.INTEGER, allowNull: false },
      hash: { type: Sequelize.STRING, allowNull: false },
      txs: { type: Sequelize.INTEGER },
      solutions: { type: Sequelize.INTEGER },
      coinbase_target: { type: Sequelize.INTEGER },
      proof_target: { type: Sequelize.INTEGER },
      last_coinbase_ts: { type: Sequelize.DATE },
    }, {
      // don't add the timestamp attributes (updatedAt, createdAt)
      timestamps: false,
    });
  }

  async getLatestHeight() {
    const block = await this.model.findOne({ order: [['time', 'DESC']] });
    if (block === null) {
      return -1;
    }
    return block.height;
  }

  async getBlock(height) {
    const block = await this.model.findOne({ where: { height } });
    return block;
  }

  async createNewBlock(block) {
    const result = await this.model.create(block);
    return result;
  }
}

module.exports = BlockModel;
