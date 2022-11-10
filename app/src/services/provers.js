/* eslint-disable camelcase */
const ProverModel = require('../models/provers');

class ProverService {
  constructor(db) {
    this.proverModel = new ProverModel(db);
  }

  async processBlock(data) {
    const {
      height, coinbase_target, proof_target,
    } = data.header.metadata;

    const solutions = data.coinbase
      && data.coinbase.partial_solutions ? data.coinbase.partial_solutions.length : 0;
    const provers = [];

    if (solutions > 0) {
      data.coinbase.partial_solutions.forEach((solution) => {
        const { address, commitment } = solution;
        const prover = {
          address,
          commitment,
          height,
          proof_target,
          coinbase_target,
        };
        provers.push(prover);
      });
    }

    await this.proverModel.bulkCreateProvers(provers);
  }
}

module.exports = ProverService;
