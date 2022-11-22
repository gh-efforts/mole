// const math = require('mathjs');
// const Excel = require('exceljs');
// const config = require('../../config').lotus;
// const Lotus = require('../../../lib/lotus');
// const Helper = require('../../../lib/helper');

// eslint-disable-next-line import/extensions
const aleoAddon = require('../../../aleo-addon');
const BlockModel = require('../../models/blocks');

/**
 * Aleo Service for daily use.
 * TODO: need to organize errors.
 */
class AleoService {
  constructor(db) {
    this.blockModel = new BlockModel(db);
    this.unit = 1e18;
  }

  /**
   * Get prove target by commitment
   * @param { string } commitment hash
   * @returns { number } prove target
   */
  async getProveTarget(commitment) {
    return aleoAddon.getTarget(commitment);
  }

  /**
   * get coinbase reward by block height
   * @param { number } height block height
   * @returns { number } coinbase reward in in credit unit
   */
  async getCoinbaseReward(height) {
    if (height < 1) {
      throw new Error('block height should not less than 1');
    }

    const block = await this.blockModel.getBlock(height);

    if (block == null) {
      throw new Error('data not found');
    } else if (block.solutions === 0) {
      // if block solutions length is 0, throw an error
      throw new Error(`no solutions in block #${height}`);
    } else {
      const previousBlock = await this.blockModel.getBlock(height - 1);
      if (previousBlock == null) {
        throw new Error(`data not found in block #${height - 1}`);
      } else {
        const timestamp = block.time.getTime() / 1000;
        const previousCoinbaseTimestamp = previousBlock.last_coinbase_ts.getTime() / 1000;
        const reward = aleoAddon.getCoinbaseReward(previousCoinbaseTimestamp, timestamp, height);
        return reward;
      }
    }
  }
}

module.exports = AleoService;
