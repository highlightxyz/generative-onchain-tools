/**
 * Highlight Generative Art Deployer : V0
 * @version: 0.1.0
 * @description Removes a file from a contract's file system
 */

const commandLineArgs = require('command-line-args');
const ethers = require("ethers");

const config = require("../config.json");
const GenSeriesABI = require("../abi/ERC721GenerativeOnchain.json").abi;

const removeFile = async (fileName, network, contractAddress, accountName) => {
    if (network === "mainnet") network = "ethereum";
    if (!(network in config.rpc)) throw new Error("Unsupported network");
    if (!(accountName in config.accounts)) throw new Error("Unsupported account");

    const provider = ethers.getDefaultProvider(config.rpc[network]);
    let signer;
    try {
        signer = new ethers.Wallet(config.accounts[accountName], provider);
    } catch(error) {
        throw new Error("Could not instantiate wallet from private key");
    }

    try {
        console.log(`Signer balance: ${ethers.formatEther(await signer.provider.getBalance(signer.address))}\n`);
    } catch (error) {
        console.error(error);
        throw new Error(`Failed to connect to ${network} using rpc ${config.rpc[network]}`);
    }
    
    const contract = new ethers.Contract(contractAddress, GenSeriesABI, signer);
    const tx = await contract.removeFile(fileName);
    console.log(`Removing file tx: ${tx.hash}`);
    await tx.wait();
    console.log(`tx completed: ${tx.hash}`);
}

const args = commandLineArgs([
    { name: 'name', type: String },
    { name: 'network', alias: 'n', type: String },
    { name: 'contract', alias: 'c', type: String },
    { name: 'account', alias: 'a', type: String, defaultValue: "default" }
])

removeFile(args.name, args.network, args.contract, args.account)
    .then(() => process.exit(0))
    .catch(error => {
    console.error(error);
    process.exit(1);
    });