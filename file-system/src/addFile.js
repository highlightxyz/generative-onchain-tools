/**
 * Highlight Generative Art Deployer : V0
 * @version: 0.1.0
 * @description Adds a file to a contract's file system
    * @argument name File name in file-system/files
    * @argument network Network name, as available in chains.json
    * @argument contract Address of collection to add file to
    * @argument account (optional) Account name if different from 'default', as available in env
 */

const fs = require("fs");
const resolve = require("path").resolve;
const commandLineArgs = require('command-line-args');
const ethers = require("ethers");

const rpcConfig = require("../../chains.json");
const GenSeriesABI = require("../abi/ERC721GenerativeOnchain.json").abi;

const { getAccountOrThrow } = require("./utils");

const addFile = async (fileName, network, contractAddress, accountName) => {
    if (network === "mainnet") network = "ethereum";
    if (!(network in rpcConfig)) throw new Error("Unsupported network");
    const deploymentsPath = resolve(__dirname, `../deployments/${fileName}.json`);
    if (!fs.existsSync(deploymentsPath)) throw new Error("Deployments file doesn't exist in file-system/deployments/");
    const deployments = JSON.parse(await fs.promises.readFile(deploymentsPath, "utf-8"));
    if (!(network in deployments)) throw new Error(`File not deployed to ${network}`);

    const provider = ethers.getDefaultProvider(rpcConfig[network].rpc);
    const signer = getAccountOrThrow(accountName).connect(provider);

    try {
        console.log(`Signer balance: ${ethers.formatEther(await signer.provider.getBalance(signer.address))}\n`);
    } catch (error) {
        console.error(error);
        throw new Error(`Failed to connect to ${network} using rpc ${rpcConfig[network].rpc}`);
    }
    
    const contract = new ethers.Contract(contractAddress, GenSeriesABI, signer);
    const addresses = deployments[network];
    const tx = await contract.addFile(fileName, addresses);
    console.log(`Adding file tx: ${tx.hash}`);
    await tx.wait();
    console.log(`tx completed: ${tx.hash}`);
    console.log(`Head to a block explorer to view the file contents and file addresses on your contract's file system`);
}

const args = commandLineArgs([
    { name: 'name', type: String },
    { name: 'network', alias: 'n', type: String },
    { name: 'contract', alias: 'c', type: String },
    { name: 'account', alias: 'a', type: String, defaultValue: "default" }
])

addFile(args.name, args.network, args.contract, args.account)
    .then(() => process.exit(0))
    .catch(error => {
    console.error(error);
    process.exit(1);
    });