/* eslint-disable camelcase */
const axios = require('axios');

const BlockModel = require('../models/blocks');
const config = require('../config');

class BlockService {
  constructor(db) {
    this.blockModel = new BlockModel(db);
    this.apiEndpoint = config.apiEndpoint;
  }

  async heightDiff() {
    const beaconLatestBlock = await this.getLatestBlock();

    // get current height from API
    let heightInBeacon = 0;
    if (beaconLatestBlock !== null
      && beaconLatestBlock.header != null
      && beaconLatestBlock.header.metadata != null) {
      heightInBeacon = beaconLatestBlock.header.metadata.height;
    }

    // get latest height from database
    const heightInDB = await this.blockModel.getLatestHeight();
    return { heightInDB, heightInBeacon, diff: heightInBeacon - heightInDB };
  }

  async getLatestBlock() {
    const url = `${this.apiEndpoint}/testnet3/latest/block`;
    const result = await axios.get(url);
    return result.data;
  }

  /**
   * Get block by height from beacon
   * @param { number } height
   * @returns
   */
  async getBlock(height) {
    const url = `${this.apiEndpoint}/testnet3/block/${height}`;
    const result = await axios.get(url);
    return result.data;
  }

  async processBlock(data) {
    const {
      height, coinbase_target, proof_target, timestamp, last_coinbase_timestamp,
    } = data.header.metadata;

    const hash = data.block_hash;

    const solutions = data.coinbase
    && data.coinbase.partial_solutions ? data.coinbase.partial_solutions.length : 0;
    const txs = data.transactions ? data.transactions.length : 0;

    const block = {
      time: timestamp * 1000,
      height,
      hash,
      txs,
      solutions,
      coinbase_target,
      proof_target,
      last_coinbase_ts: last_coinbase_timestamp * 1000,
    };

    await this.blockModel.createNewBlock(block);
  }
}

module.exports = BlockService;
