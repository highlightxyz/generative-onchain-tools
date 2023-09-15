/**
 * Highlight Generative Art Deployer : V0
 * @version: 0.1.0
 * @description Checks the cost to deploy a file on-chain
    * @argument file File name in file-system/files
    * @argument network Network name, as available in file-system/config.json
*/

const fs = require("fs");
const resolve = require("path").resolve;
const commandLineArgs = require('command-line-args');
const ethers = require("ethers");

const config = require("../config.json");
 
const { FILE_NAME_FORMAT  } = require("./constants.js");
const APPROX_DEPLOY_COMPUTE_PER_BYTE = BigInt(190);
 
const checkCost = async (fileName, network, useLegacyGas) => {
    if (network === "mainnet") network = "ethereum";
    if (!(network in config.addresses) || !(network in config.rpc)) throw new Error("Unsupported network");
    if (!fileName.match(FILE_NAME_FORMAT)) throw new Error("Unsupported file name format");
    const filePath = resolve(__dirname, `../files/${fileName}`);
    if (!fs.existsSync(filePath)) throw new Error("File doesn't exist in file-system/files/");
    
    const provider = ethers.getDefaultProvider(config.rpc[network]);

    let gasPrice;
    try {
        const feeData = await provider.getFeeData();
        gasPrice = useLegacyGas ? feeData.gasPrice : feeData.maxFeePerGas;
    } catch (error) {
        throw new Error(`Failed to get gas fee data for ${network} using rpc ${config.rpc[network]}`);
    }
    
    const stats =  await fs.promises.stat(filePath);
    console.log(`File size: ${stats.size} bytes`);
    const weiConsumed = gasPrice * APPROX_DEPLOY_COMPUTE_PER_BYTE * BigInt(stats.size);
    console.log(`At current gas fees, approximate cost to deploy on ${network} is ${ethers.formatEther(weiConsumed)} ETH`);
}

const args = commandLineArgs([
    { name: 'file', alias: 'f', type: String },
    { name: 'network', alias: 'n', type: String },
    { name: 'legacy', alias: 'l', type: Boolean, defaultValue: true }
])

checkCost(args.file, args.network, args.legacy)
    .then(() => process.exit(0))
    .catch(error => {
    console.error(error);
    process.exit(1);
    });