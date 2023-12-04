/**
 * Highlight Generative Art Deployer : V0
 * @version: 0.1.0
 * @description Checks the cost to deploy a file on-chain
    * @argument name File name in file-system/files
    * @argument network Network name, as available in chains.json
    * @argument legacy Use pre EIP-1559 gas framework
*/

const fs = require("fs");
const resolve = require("path").resolve;
const commandLineArgs = require('command-line-args');
const ethers = require("ethers");

const config = require("../config.json");
const rpcConfig = require("../../chains.json");
const L1BlockABI = require("../abi/L1Block.json").abi;
 
const { FILE_NAME_FORMAT, UTF_BASED_FILE_EXTENSIONS } = require("./constants.js");
const APPROX_DEPLOY_COMPUTE_PER_BYTE = BigInt(250);
const APPROX_DEPLOY_L1_COMPUTE_OP_BASED_PER_BYTE = BigInt(17);
const FEE_SCALAR_BASE = BigInt(1000000);
 
const checkCost = async (fileName, network, useLegacyGas) => {
    if (network === "mainnet") network = "ethereum";
    if (!(network in config.addresses) || !(network in rpcConfig)) throw new Error("Unsupported network");
    if (!fileName.match(FILE_NAME_FORMAT)) throw new Error("Unsupported file name format");
    const filePath = resolve(__dirname, `../files/${fileName}`);
    if (!fs.existsSync(filePath)) throw new Error("File doesn't exist in file-system/files/");
    
    // factor in size increase with base64 encoding
    const fileNameSplit = fileName.split(".");
    const deployCostMultiplierBPS = UTF_BASED_FILE_EXTENSIONS.includes(fileNameSplit[fileNameSplit.length - 1]) ? BigInt(10000) : BigInt(13300);

    const provider = ethers.getDefaultProvider(rpcConfig[network].rpc);

    let gasPrice;
    try {
        const feeData = await provider.getFeeData();
        gasPrice = useLegacyGas ? feeData.gasPrice : feeData.maxFeePerGas;
    } catch (error) {
        throw new Error(`Failed to get gas fee data for ${network} using rpc ${rpcConfig[network].rpc}`);
    }
    
    const stats =  await fs.promises.stat(filePath);
    console.log(`File size: ${stats.size} bytes`);
    if (deployCostMultiplierBPS != BigInt(10000)) {
        console.log(`File size multiplier: ${Number(deployCostMultiplierBPS) / 10000}`);
    }
    let weiConsumed = (gasPrice * APPROX_DEPLOY_COMPUTE_PER_BYTE * BigInt(stats.size)) * deployCostMultiplierBPS / BigInt(10000);
    if (config.addresses[network].isOPBasedL2) {
        const l1Block = new ethers.Contract(config.addresses[network].opL1Block, L1BlockABI, provider);
        const feeScalar = await l1Block.l1FeeScalar();

        const l1Provider = ethers.getDefaultProvider(rpcConfig["ethereum"].rpc);
        let l1GasPrice;
        try {
            const feeData = await l1Provider.getFeeData();
            l1GasPrice = feeData.gasPrice;
        } catch (error) {
            throw new Error(`Failed to get gas fee data for ethereum (L1) using rpc ${rpcConfig["ethereum"].rpc}`);
        }
        
        const l1WeiConsumed = (l1GasPrice * APPROX_DEPLOY_L1_COMPUTE_OP_BASED_PER_BYTE  * BigInt(stats.size) * feeScalar / FEE_SCALAR_BASE) * deployCostMultiplierBPS / BigInt(10000);
        weiConsumed = weiConsumed + l1WeiConsumed;
    }
    console.log(`At current gas fees, approximate cost to deploy on ${network} is ${ethers.formatEther(weiConsumed)} ETH`);
}

const args = commandLineArgs([
    { name: 'name', type: String },
    { name: 'network', alias: 'n', type: String },
    { name: 'legacy', alias: 'l', type: Boolean, defaultValue: false }
])

checkCost(args.name, args.network, args.legacy)
    .then(() => process.exit(0))
    .catch(error => {
    console.error(error);
    process.exit(1);
    });