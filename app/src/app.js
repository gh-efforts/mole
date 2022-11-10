/* eslint-disable no-await-in-loop */
// load .env config
require('dotenv').config();
const sequelize = require('./lib/db');
const helper = require('./lib/helper');

const BlockService = require('./services/blocks');
const ProverService = require('./services/provers');

async function main() {
  try {
    // connect to database
    await sequelize.authenticate();

    const blockService = new BlockService(sequelize);
    const proverService = new ProverService(sequelize);

    // eslint-disable-next-line no-constant-condition
    while (true) {
      const { heightInDB, heightInBeacon, diff } = await blockService.heightDiff();

      if (heightInDB !== -1 && diff !== 0) {
        console.time(`process from ${heightInDB + 1} to ${heightInBeacon}`);
        // start import data one by one.
        for (let i = heightInDB + 1; i <= heightInBeacon; i += 1) {
          console.log(`Start Process height: ${i} ...`);
          // get block
          const data = await blockService.getBlock(i);
          await blockService.processBlock(data);
          await proverService.processBlock(data);
          console.log(`Process height: ${i} Done!`);
        }
        console.timeEnd(`process from ${heightInDB + 1} to ${heightInBeacon}`);
        console.log('\n');
      } else {
        // 调用方法，同步执行，阻塞后续程序的执行；
        console.log('yeild 10 seconds');
        helper.sleep(10000);
      }
    }
  } catch (err) {
    console.error(err);
  }
}

main();
