use snarkvm::prelude::Testnet3;
use snarkvm::prelude::ToBytes;
use snarkvm_algorithms::crypto_hash::sha256d_to_u64;
use snarkvm_synthesizer::coinbase_puzzle::PuzzleCommitment;
use std::str::FromStr;
use snarkos_node_consensus::coinbase_reward;
use neon::prelude::*;


// The starting supply of Aleo credits.
const STARTING_SUPPLY: u64 = 1_100_000_000_000_000; // 1.1B credits
/// The anchor time per block in seconds, which must be greater than the round time per block.
const ANCHOR_TIME: u16 = 25;

fn get_target(mut cx: FunctionContext) -> JsResult<JsNumber> {
    let cstr = cx.argument::<JsString>(0)?.value(&mut cx);
    let commitment = PuzzleCommitment::<Testnet3>::from_str(&cstr).unwrap();
    let hash_to_u64 = sha256d_to_u64(&commitment.to_bytes_le().unwrap());
    let target = if hash_to_u64 == 0 {
        u64::MAX
    } else {
        u64::MAX / hash_to_u64
    };
    Ok(cx.number(target as f64))
}

fn get_coinbase_reward(mut cx: FunctionContext) -> JsResult<JsNumber> {
    let previous_timestamp = cx.argument::<JsNumber>(0)?.value(&mut cx) as i64;
    let timestamp = cx.argument::<JsNumber>(1)?.value(&mut cx) as i64;
    let block_height = cx.argument::<JsNumber>(2)?.value(&mut cx) as u32;

    let mut _reward = STARTING_SUPPLY;
    match coinbase_reward(
        previous_timestamp,
        timestamp,
        block_height,
        STARTING_SUPPLY,
        ANCHOR_TIME,
    ){
        Ok(result) => { _reward = result },
        Err(_error) => { _reward = STARTING_SUPPLY }
    };

    Ok(cx.number(_reward as f64))
}

#[neon::main]
fn main(mut cx: ModuleContext) -> NeonResult<()> {
    cx.export_function("getTarget", get_target)?;
    cx.export_function("getCoinbaseReward", get_coinbase_reward)?;
    Ok(())
}
